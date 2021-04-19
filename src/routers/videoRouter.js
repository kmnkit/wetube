import express from 'express';
import { trending, watch, getEdit, postEdit, getUpload, postUpload, deleteVideo } from "../controllers/videoController";
import routes from "../../routes";

const videoRouter = express.Router();

videoRouter.route("/:id(\\d+)").get(watch);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/upload").get(getUpload).post(postUpload);
export default videoRouter;
// videoRouter.route("/:id(\\d+)/delete", deleteVideo);