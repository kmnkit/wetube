export const trending = (req, res) => res.render("home", { pageTitle: "Home" });
export const see = (req, res) => res.render("see", { pageTitle: "see" });
export const edit = (req, res) => res.render("edit", { pageTitle: "edit" });
export const search = (req, res) => res.render("search", { pageTitle: "search" });
export const upload = (req, res) => res.render("upload", { pageTitle: "upload" });
export const deleteVideo = (req, res) => res.render("deleteVideo", { pageTitle: "delete" });