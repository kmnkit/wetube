import "./db";
import express from 'express';
import morgan from 'morgan';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import globalRouter from './routers/globalRouter';

const app = express();
const logger = morgan("dev");

const PORT = 4000;

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

function handleListening(req, res) {
    console.log(`🚀 Listen on ${PORT} ✅`);
}

app.listen(PORT, handleListening);