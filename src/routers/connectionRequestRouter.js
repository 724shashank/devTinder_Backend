const mongoose = require("mongoose");
const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../middleware/authentication");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { dynamicParams } = require("../utils/validatorFunction");

//API for sending Connection Request

connectionRequestRouter.post(
  "/request/send/:status/:toUserID",
  userAuth,
  dynamicParams,
  async (req, res) => {
    try {
      const reqObj = {
        fromUserID: req.user._id,
        toUserID: req.params.toUserID,
        status: req.params.status,
      };

      if (String(reqObj.fromUserID) === String(reqObj.toUserID)) {
        return res.status(400).json({ message: "Object Id can not be same !" });
      }

      const checkExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserID: req.user._id, toUserID: req.params.toUserID },
          { fromUserID: req.params.toUserID, toUserID: req.user._id },
        ],
      });

      const validateToUserId = await User.findById(req.params.toUserID);

      if (checkExist) {
        return res
          .status(400)
          .json({ message: "Request has already been sent !" });
      }

      if (validateToUserId === null) {
        return res.status(404).json({ message: "User not Found !" });
      }

      const result = new ConnectionRequest(reqObj);

      await result.save();
      if (reqObj.status === "interested") {
        res.status(200).json({
          message: `The Request has been sent to ${validateToUserId.firstName}. `,
          result,
        });
      } else {
        res.status(200).json({
          message: `The Request from ${validateToUserId.firstName} has been ignored.`,
          result,
        });
      }
    } catch (error) {
      res.status(400).send(`Something Went Wrong ${error.message}`);
    }
  }
);

//API for reviewing the connection request

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status.toLowerCase())) {
        res.status(400).json({ message: "Status String not allowed !" });
      }

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        res.status(400).json({ message: "Invalid request ID parameter !" });
      }

      const userData = await ConnectionRequest.findOne({
        _id: requestId,
        toUserID: loggedInUser._id,
        status: "interested",
      });
      if (!userData) {
        res.status(404).json({ message: "Connection request not found !" });
      }

      userData.status = "accepted";

      await userData.save();
      res
        .status(200)
        .json({ message: "Connection request Accepted !  ", userData });
    } catch (error) {
      res
        .status(400)
        .json({ message: `Something Went Wrong ${error.message}` });
    }
  }
);

module.exports = connectionRequestRouter;
