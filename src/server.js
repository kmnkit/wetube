import express from 'express';
import morgan from 'morgan';

const app = express();
// Morgan will return middleware
const logger = morgan("dev");

const PORT = 4000;

function gossipMiddleware(req, res, next) {
    console.log(`Someone is going to ${req.url}`);
    next();
};

function handleHome(req, res) {
    return res.send('Main입니다!!!하하하');
};

function handleLogin(req, res) {
    return res.send('Login Here!');
};

app.use(logger);
app.get('/', gossipMiddleware, handleHome);
app.get('/login', handleLogin);

function handleListening() {
    console.log(`✅ Server is listening on port ${PORT} 🚀`);
}
app.listen(PORT, handleListening);