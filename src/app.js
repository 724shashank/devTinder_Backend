require("dotenv").config();
const express = require("express");
const connectDB = require("./config/dataBase");
const User = require("./models/user");
const app = express();

app.use(express.json());    

app.post("/signup",async (req, res) => {

 const userData = new User(req.body);
  try {
    await userData.save();
    res.send("Data has been send");
  } catch (error) {
    res.status(400).send("Something went Wrong:"+ error.message);
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
