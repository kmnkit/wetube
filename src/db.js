import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

const handleOpen = () => console.log("🚀 Connected to DB 👍");
const handleError = (err) => console.log("❌ DB Error 😭", err);

db.on("error", handleError).once("open", handleOpen);