import { compareSync } from "bcrypt";
import Video from "../models/Video";
import User from "../models/User";

const HTTP_NOT_FOUND = 404;

export const home = async (_, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate('owner');
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { params: { id } } = req;
    const video = await Video.findById(id).populate("owner");
    if (!video) {
        return res.status(HTTP_NOT_FOUND).render("404", { pageTitle: "Video not found" });
    };
    return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
    const {
        params: { id },
        session: { user: { _id: me } } } = req;
    const video = await Video.findById(id);
    if (String(video.owner) !== String(me)) {
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    };
    if (!video) {
        return res.status(HTTP_NOT_FOUND).render("404", { pageTitle: "Video not found" });
    };
    return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
    const {
        params: { id },
        session: { user: { _id: me } } } = req;
    const video = await Video.findById(id);
    const { title, description, hashtags } = req.body;
    if (!video) {
        return res.status(HTTP_NOT_FOUND).render("404", { pageTitle: "Video not found" });
    };
    if (String(video.owner) !== String(me)) {
        req.flash("error", "You are not the owner of the video.");
        return res.status(403).redirect("/");
    };

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash("success", "Edit Successed");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (_, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const {
        session: { user: { _id: owner } },
        files: {
            video,
            thumb
        },
        body: { title, description, hashtags },
    } = req;
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].path,
            owner,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(owner);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message
        });
    }
};
export const deleteVideo = async (req, res) => {
    const {
        params: { id },
        session: { user: { _id: me } }
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(HTTP_NOT_FOUND).render("404", { pageTitle: "Video not found" });
    };
    if (String(video.owner) !== String(me)) {
        return res.status(403).redirect("/");
    };
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { query: { keyword } } = req;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i")
            },
        }).populate('owner');
    }
    return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
    const { params: { id } } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(HTTP_NOT_FOUND);
    };
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
}