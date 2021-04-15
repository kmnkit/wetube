import express from 'express';
import { join, edit, remove } from "../controllers/userController";
import routes from "../../routes";

const userRouter = express.Router();
userRouter.get("/join", join);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;