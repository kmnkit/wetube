import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();
// Morgan will return middleware
const logger = morgan("dev");

const PORT = 4000;

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

function handleListening(req, res) {
    console.log(`Listen on ${PORT} 🚀`);
}

app.listen(PORT, handleListening);