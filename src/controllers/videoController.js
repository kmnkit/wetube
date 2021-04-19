const videos = [
    {
        title: "First Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 72,
        id: 1
    },
    {
        title: "Second Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 2
    },
    {
        title: "Third Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
        id: 3
    }
];
export const trending = (req, res) => {
    return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
    const { params: { id } } = req;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
    const { params: { id } } = req;
    const video = videos[id - 1];
    return res.render("edit", { pageTitle: `Editting: ${video.title}`, video });
};

export const postEdit = (req, res) => {
    const { params: { id } } = req;
    const { body: { title } } = req;
    const video = videos[id - 1];
    video.title = title;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
    const { body: { title } } = req;
    const newVideo = {
        title,
        rating: 0,
        comments: 0,
        createdAt: "Just now",
        views: 0,
        id: videos.length + 1,
    };
    videos.push(newVideo);
    return res.redirect("/");
};

export const search = (req, res) => res.render("search", { pageTitle: "search" });
export const deleteVideo = (req, res) => res.render("deleteVideo", { pageTitle: "delete" });