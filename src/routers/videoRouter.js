import express from 'express';

const videoRouter = express.Router();
videoRouter.get("/", (req, res) => res.send("Video Home!"));

export default videoRouter;