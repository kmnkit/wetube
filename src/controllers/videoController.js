import Video from "../models/Video";

const capitalize = ([firstLetter, ...restOfWords]) => firstLetter.toUpperCase() + restOfWords.join('').toLowerCase();

export const home = async (_, res) => {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
    const { params: { id } } = req;
    return res.render("watch", { pageTitle: `Watching ${video.title}`, });
};
export const getEdit = (req, res) => {
    const { params: { id } } = req;
    return res.render("edit", { pageTitle: `Editting: ${video.title}` });
};

export const postEdit = (req, res) => {
    const { params: { id } } = req;
    const { body: { title } } = req;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (_, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const { body: { title, description, hashtags } } = req;
    const video = new Video({
        title,
        description,
        hashtags: hashtags.replace(/(\s*)/g, "").split(",").map(tag => `#${capitalize(tag)}`),
        createdAt: Date.now(),
        meta: {
            views: 0,
            rating: 0,
        },
    });
    await video.save();
    return res.redirect("/");
};

export const search = (_, res) => res.render("search", { pageTitle: "search" });
export const deleteVideo = (_, res) => res.render("deleteVideo", { pageTitle: "delete" });