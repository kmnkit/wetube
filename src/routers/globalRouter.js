import express from 'express';
import { join } from '../controllers/userController';

const globalRouter = express.Router();
globalRouter.get("/join", join);

export default globalRouter;