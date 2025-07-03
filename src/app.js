require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validatorFunction } = require("./utils/validatorFunction");
const app = express();

app.use(express.json());

//signup API POST/signup

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

//Login API POST/login

app.post("/login", async (req, res) => {
  try {
    if (!validator.isEmail(req.body.emailId)) {
      throw new Error("Enter the valid Email-ID");
    }

    const user = await User.findOne({ emailId: req.body.emailId });
    if (user === null) {
      throw new Error("Invalid credentials");
    }
    const hash = user.password;

    const result = await bcrypt.compare(req.body.password, hash);
    if (result) {
      res.status(200).send("login Successful !");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(401).send(`Access Unauthorized : ${error.message}`);
  }
});

//user API GET/user by email ID

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.send("User not Found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong...");
  }
});

//Feed API GET/user - get single profile

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); //if we want all users we left the find field empty
    if (users.length === 0) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong" + error.message);
  }
});

//Delete User API DELETE/user

app.delete("/user", async (req, res) => {
  try {
    const response = await User.findByIdAndDelete({ _id: req.body.id });
    if (response === null) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send("User Deleted : " + response);
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong" + error.message);
  }
});

//Update User API Patch/user

app.patch("/user/:userId", async (req, res) => {
  try {
    //API Level validations
    const allowedFields = [
      "password",
      "photoUrl",
      "skills",
      "about",
      "mobileNo",
    ];
    const result = Object.keys(req.body).every((k) =>
      allowedFields.includes(k)
    );
    if (!result) {
      throw new Error("Update is not Possible");
    }

    if (req.body?.skills.length >= 11) {
      throw new Error("Update is not Possible");
    }

    const response = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (response === null) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send("User Firstname Updated to :" + response);
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong " + error.message);
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
