const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/authentication");
const { profileEdit, validatePassword } = require("../utils/validatorFunction");
const bcrypt = require("bcrypt");

//Fetch user profile API GET/profile/view

profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

//Update the User Profile API PATCH/profile/edit

profileRouter.patch(
  "/profile/edit",
  userAuth,
  profileEdit,
  async (req, res) => {
    try {
      if (req.body?.skills.length >= 11) {
        throw new Error("Enter Your Top 10 skills");
      }

      const loggedInUser = req.user; //the req.user is not just plain js object it is a instance of mongoose document which is having the property of js object + also having the access to functions like .save, validate,populate etc any document return by mongoose methods like findById or somthing like that then it will be a instance of mongoose document not plain js.

      Object.keys(req.body).every((key) => (loggedInUser[key] = req.body[key])); //same result can be achived by using Object.assign(target_object, source_object);

      await loggedInUser.save();

      res.json({ message: "The data has been saved" });
    } catch (error) {
      res.status(400).send(`Error Occurred :- ${error.message}`);
    }
  }
);

//Update the User password API PATCH/profile/updatePassword

profileRouter.patch("/profile/updatePassword",validatePassword,userAuth,async (req, res) => {
    try {

      const loggedInUser = req.user;
      const newPassword = req.body.password;
      const hash = await bcrypt.hash(newPassword, 10);
      Object.assign(loggedInUser, { password: hash });
      await loggedInUser.save();
      res.cookie("token", null, { expires: new Date(Date.now()) });
      res.json({ message: "Password Updated Successfully" });
      
    } catch (error) {
      res.status(400).send(`Error Occurred :- ${error.message}`);
    }
  }
);

module.exports = profileRouter;
