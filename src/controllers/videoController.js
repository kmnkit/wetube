export const trending = (req, res) => {
    const videos = [
        {
            title: "First Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 1
        }, {
            title: "Second Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 1
        }, {
            title: "Third Video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 1
        }
    ];
    res.render("home", { pageTitle: "Home", videos });
};
export const see = (req, res) => res.render("see", { pageTitle: "see" });
export const edit = (req, res) => res.render("edit", { pageTitle: "edit" });
export const search = (req, res) => res.render("search", { pageTitle: "search" });
export const upload = (req, res) => res.render("upload", { pageTitle: "upload" });
export const deleteVideo = (req, res) => res.render("deleteVideo", { pageTitle: "delete" });