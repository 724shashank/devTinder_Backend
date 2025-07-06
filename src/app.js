require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validatorFunction } = require("./utils/validatorFunction");
const app = express();
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/authentication");

app.use(express.json());

app.use(cookieParser());

// API:- POST/signup

app.post("/signup", async (req, res) => {
  try {
    //validation

    validatorFunction(req);

    // Check skills limit before creating model

    if (req.body.skills?.length >= 11) {
      throw new Error("Enter Top 10 Skills Only...");
    }

    //Hashing the Password

    const hash = await bcrypt.hash(req.body.password, 10);

    const encryptedObj = { ...req.body, password: hash };

    const userData = new User(encryptedObj);

    await userData.save({ validateBeforeSave: true });
    res.send("Data has been send");
  } catch (error) {
    res.status(400).send("Something went Wrong:- " + error.message);
  }
});

// API:- POST/login

app.post("/login", async (req, res) => {
  try {
    if (!validator.isEmail(req.body.emailId)) {
      throw new Error("Enter the valid Email-ID");
    }

    const user = await User.findOne({ emailId: req.body.emailId });
    if (user === null) {
      throw new Error("Invalid credentials");
    }

    //Creating JWT

    const token = await user.getJWT();

    //Sending Cookies

    res.cookie("token", token);

    const hash = user.password;

    const result = await user.checkPassword(req.body.password);
    if (result) {
      res.status(200).send("login Successful !");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(401).send(`Access Unauthorized : ${error.message}`);
  }
});

// API:- GET/profile

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send(`Error Occurred :- ${error.message}`);
  }
});

// API:- POST/sendConnectionRequest

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(`${req.user.firstName} send the connection request !`);
  } catch (error) {
    res.status(400).send(`Something Went Wrong ${error.message}`);
  }
});

connectDB
  .then(() => {
    console.log("Connected... ");
    app.listen(3000, () => {
      console.log("The Server Is Up and Running on port no.3000");
    });
  })
  .catch(() => console.log("Something Went Wrong..."));
