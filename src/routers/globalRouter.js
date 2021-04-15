import express from 'express';

const globalRouter = express.Router();
globalRouter.get("/", (req, res) => res.send("Global Router Home!"));

export default globalRouter;