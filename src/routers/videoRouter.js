import express from 'express';
import { trending, see, edit, search, upload, deleteVideo } from "../controllers/videoController";
import routes from "../../routes";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/trending", trending);
videoRouter.get("/search", search);
videoRouter.get("/upload", upload);
export default videoRouter;