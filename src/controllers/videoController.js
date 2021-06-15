import { compareSync } from "bcrypt";
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

const HTTP_NOT_FOUND = 404;

export const home = async (_, res) => {
    const videos = await Video.find({}).sort({ createdAt: "desc" }).populate('owner');
    return res.render("home", { pageTitle: "Home", videos });
};

const calculateNumOfDays = (day) => {
    const today = new Date();
    const value = new Date(day);
    const betweenTime = Math.floor((today.getTime() - value.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) return `${betweenTime}분전`;
    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) return `${betweenTimeHour}시간전`;
    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) return `${betweenTimeDay}일전`;
    return `${Math.floor(betweenTimeDay / 365)}년전`;
}

export const watch = async (req, res) => {
    const { params: { id } } = req;
    const video = await Video.findById(id).populate("owner");
    const comments = await Comment.find({ where: video.comments._id }).sort({ createdAt: "desc" }).populate('author');
    if (!video) {
        return res.status(HTTP_NOT_FOUND).render("404", { pageTitle: "Video not found" });
    };
    return res.render("watch", { pageTitle: video.title, video, comments, calculateNumOfDays });
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
    return res.render("edit", { pageTitle: `Edit ${video.title} `, video });
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
    return res.redirect(`/ videos / ${id} `);
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
            fileUrl: res.locals.isHeroku ? video[0].location : video[0].path,
            thumbUrl: res.locals.isHeroku ? thumb[0].location : video[0].path,
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
                $regex: new RegExp(`${keyword} $`, "i")
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

export const createComment = async (req, res) => {
    const {
        params: { id: video },
        body: { text },
        session: { user }
    } = req;
    const videoObj = await Video.findById(video);
    if (!videoObj) return res.sendStatus(404);
    const comment = await Comment.create({
        text,
        video,
        author: user._id,
    });
    videoObj.comments.push(comment._id);
    videoObj.save();
    return res.sendStatus(201);
};

export const updateComment = async (req, res) => {
    const {
        params: { id: video },
        body: { text },
        session: { user }
    } = req;
    const videoObj = await Video.findById(video);
    if (!videoObj) return res.sendStatus(404);
    const comment = await Comment.create({
        text,
        video,
        author: user._id,
    });
    videoObj.comments.push(comment._id);
    videoObj.save();
    return res.sendStatus(201);
};

export const deleteComment = async (req, res) => {
    const {
        params: { commentId: comment },
    } = req;
    await Comment.findByIdAndDelete(comment);
    return res.sendStatus(200);
};