require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors")
const errorHandler = require("./middlewares/errorHandler")
const authRouter = require("./routes/authRoutes")
const profileRouter = require("./routes/profileRoutes")
const cloudinary = require("./config/cloudinary")
const interviewRouter = require("./routes/interviewRoutes")
const questionRouter = require("./routes/questionRoutes")

const app = express();
connectDB();

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://nexthire-ai-1-u49v.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/interview", interviewRouter);
app.use("/question", questionRouter);

app.get("/", (req, res) => {
    res.send("NextHire API Running...");
});

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});