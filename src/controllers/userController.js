import bcrypt from "bcrypt";
import fetch from "node-fetch";
import User from "../models/User";

const HTTP_BAD_REQUEST = 400;

export const getJoin = (_, res) => {
    res.render("join", { pageTitle: "Create Account" });
};

export const postJoin = async (req, res) => {
    const { body: { name, username, email, password, password2, location } } = req;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(HTTP_BAD_REQUEST).render("join", {
            pageTitle,
            errorMessage: "Password Confirmation does not match",
        });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });

    if (exists) {
        return res.status(HTTP_BAD_REQUEST).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        });
    };

    try {
        await User.create({
            name,
            username,
            email,
            password,
            location
        });
        res.redirect("/login");
    } catch (error) {
        return res.status(HTTP_BAD_REQUEST).render("join", {
            pageTitle: "Join",
            errorMessage: error._message
        });
    }
};

export const getLogin = (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect("/");
    }
    res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
    const pageTitle = "Login";
    const { body: { username, password } } = req;
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(HTTP_BAD_REQUEST).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    };
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(HTTP_BAD_REQUEST).render("login", {
            pageTitle,
            errorMessage: "Wrong Password",
        });
    };
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        })).json();
    if ("access_token" in tokenRequest) {
        // Access Api
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                }
            })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            req.flash("error", "Can't finish Github Login.");
            return res.redirect("/login");
        }
        let user = await User.exists({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                name: userData.name,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }
    return res.redirect("/login");
};

export const getEdit = (_, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
}

export const postEdit = async (req, res) => {
    const {
        session: {
            user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername },
        },
        body: { name, email, username, location },
        file
    } = req;
    let searchParam = [];
    if (sessionEmail !== email) {
        searchParam.push({ email });
    }
    if (sessionUsername !== username) {
        searchParam.push({ username });
    }
    if (searchParam.length > 0) {
        const foundUser = await User.findOne({ $or: searchParam });
        if (foundUser && foundUser._id.toString() !== _id) {
            return res.status(HTTP_BAD_REQUEST).render("edit-profile", {
                pageTitle: "Edit Profile",
                errorMessage: "This username/email is already taken.",
            });
        }
    }
    const isHeroku = process.env.NODE_ENV === "production";
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl,
        name,
        email,
        username,
        location
    },
        {
            new: true
        }
    );
    req.session.user = updatedUser;
    return res.redirect("/users/edit");
}
export const edit = (req, res) => res.render("edit");

export const logout = (req, res) => {
    req.flash("info", "Bye Bye");
    req.session.destroy();
    return res.redirect("/");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password.");
        return res.redirect("/");
    };
    return res.render("users/change-password", { pageTitle: "Change Password" })
}

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPasswordConfirmation }
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        req.flash("error", "Can't change password.");
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect.",
        });
    }
    if (newPassword !== newPasswordConfirmation) {
        req.flash("error", "Can't change password.");
        return res.status(400).render("users/change-password", {
            pageTitle: "Change Password",
            errorMessage: "The new password does not match the confirmation",
        });
    }
    user.password = newPassword;
    await user.save();
    req.flash("info", "Password Updated");
    req.session.user.password = user.password;
    return res.redirect("/users/logout");
}

export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate('videos');
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found" });
    }
    return res.render("users/profile", { pageTitle: `${user.name}??? profile`, user });
}