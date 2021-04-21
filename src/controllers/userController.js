import User from "../models/User";
import bcrypt from "bcrypt";

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
export const getLogin = (_, res) => {
    res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
    const pageTitle = "Login";
    const { body: { username, password } } = req;
    const user = await User.findOne({ username });
    // Check if account exists
    if (!user) {
        return res.status(HTTP_BAD_REQUEST).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    };
    console.log(user.password);
    // Check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(HTTP_BAD_REQUEST).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    };
    res.end();
};
export const edit = (req, res) => res.render("edit");
export const remove = (req, res) => res.render("remove");
export const logout = (req, res) => res.render("logout");
export const see = (req, res) => res.render("login");