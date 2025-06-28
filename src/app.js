require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./models/user");
const app = express();

app.use(express.json());

//signup API POST/signup

app.post("/signup", async (req, res) => {
  const userData = new User(req.body);
  try {
    await userData.save();
    res.send("Data has been send");
  } catch (error) {
    res.status(400).send("Something went Wrong:" + error.message);
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
    if (users.lenght === 0) {
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

app.patch("/user", async (req, res) => {
  try {
    //const response = await User.findByIdAndUpdate({ _id: req.body.id },req.body, {returnDocument:"after"}); 
   const response = await User.findOneAndUpdate({ emailId: req.body.emailId },req.body, {returnDocument:"after"})
    if (response === null) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send("User Firstname Updated to :" + response );
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
