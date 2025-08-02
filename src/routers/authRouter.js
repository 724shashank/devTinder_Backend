const express = require("express");
const authRouter = express.Router();
const { validatorFunction } = require("../utils/validatorFunction");
const validator = require("validator")
const User = require("../models/user");
const bcrypt = require("bcrypt");

// API:- POST/signup

authRouter.post("/signup", validatorFunction,async (req, res) => {
  try {
  
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

authRouter.post("/login", async (req, res) => {
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

    const result = await user.checkPassword(req.body.password);
    if (result) {
      res.status(200).json({message:"login Successful !",user});
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(401).send(`Access Unauthorized : ${error.message}`);
  }
});


//Logout API POST

authRouter.post("/logout",(req,res)=>{
  res.cookie("token",null,{expires: new Date(Date.now())});
  res.send("Logout successful");
})

module.exports = authRouter;
