require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dataBase");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const corsOptions = {
  origin: "http://localhost:1234", // whitelist frontend
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRouter = require("./routers/authRouter");
const profileRouter = require("./routers/profileRouter");
const userRouter = require("./routers/userRouter");
const connectionRequestRouter = require("./routers/connectionRequestRouter");

app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

connectDB
  .then(() => {
    console.log("Connected... ");
    app.listen(3000, () => {
      console.log("The Server Is Up and Running on port no.3000");
    });
  })
  .catch(() => console.log("Something Went Wrong..."));
