import express from 'express';
const app = express();

const PORT = 4000;

function gossipMiddleware(req, res, next) {
    console.log("I'm in the middle!");
    next();
}

function handleHome(req, res) {
    return res.send('Main입니다!!!하하하');
};

function handleLogin(req, res) {
    return res.send('Login Here!');
};

app.get('/', gossipMiddleware, handleHome);
app.get('/login', handleLogin);

function handleListening() {
    console.log(`✅ Server is listening on port ${PORT} 🚀`);
}
app.listen(PORT, handleListening);