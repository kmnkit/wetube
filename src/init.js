import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4001;

const handleListening = (req, res) => console.log(`🚀 Listen on ${PORT} ✅`);

app.listen(PORT, handleListening);