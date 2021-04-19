import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

const handleListening = (req, res) => console.log(`🚀 Listen on ${PORT} ✅`);

app.listen(PORT, handleListening);