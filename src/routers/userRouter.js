const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/authentication");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requiredFields = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "skills",
  "about",
];

//GET all the pending connection requests

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const result = await ConnectionRequest.find({
      toUserID: loggedInUser._id,
      status: "interested",
    }).populate("fromUserID", requiredFields);

    res.status(200).json({ message: "Pending Requests", result });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong..." });
  }
});

// GET all the accepted connections

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const response = await ConnectionRequest.find({
      $or: [
        { fromUserID: loggedInUser._id, status: "accepted" },
        { toUserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserID", requiredFields)
      .populate("toUserID", requiredFields);

    const result = response.map((confirmRequest) => {
      if (
        confirmRequest.fromUserID._id.toString() === loggedInUser._id.toString()
      ) {
        return confirmRequest.toUserID;
      } else if (confirmRequest.toUserID._id.equals(loggedInUser._id)) {
        return confirmRequest.fromUserID;
      }
    });

    if (!result || result.length <= 0) {
      res.status(404).json({ message: `No Connection Found` });
    }
    res.status(200).json({ message: "Approved Connections", result });
  } catch (error) {
    res.status(400).json({ message: `Something Went Wrong ${error.message}` });
  }
});

// Feed API get all the users

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const loggedInUser = req.user;
    const response = await ConnectionRequest.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    }).select("fromUserID toUserID");

    const hideUserAccounts = new Set();
    response.map((i) => {
      hideUserAccounts.add(i.fromUserID);
      hideUserAccounts.add(i.toUserID);
    });

    const result = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserAccounts) } },
        { _id: { $ne: loggedInUser._id } },
      ],

      // _id: { ( If you're applying multiple conditions to the same field, you can combine them)
      //   $nin: Array.from(hideUserAccounts),
      //   $ne: loggedInUser._id,
      // },
    })
      .select(requiredFields)
      .skip(skip)
      .limit(limit);
    if (!result) {
      res.status(404).json({ message: `Page no.${page} does not exist` });
    }
    //Array.from() is used to convert the set or any other iterables into array
    res.status(200).json({ message: "Logged in user Feed", result });
  } catch (error) {
    res.status(400).json({ message: `Something Went Wrong ${error.message}` });
  }
});
module.exports = userRouter;
