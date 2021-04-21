import express from 'express';
import { edit, remove } from "../controllers/userController";
import routes from "../../routes";

const userRouter = express.Router();
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);

export default userRouter;