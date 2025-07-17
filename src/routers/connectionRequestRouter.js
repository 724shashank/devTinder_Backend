const express = require("express");
const connectionRequestRouter = express.Router();
const { userAuth } = require("../middleware/authentication");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { dynamicParams } = require("../utils/validatorFunction");

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

      const user = await User.findById(result.toUserID);

      if (user === null) {
        throw new Error("User Does not exist");
      }

      res.json({ message: `The Request has been sent to ${user.firstName} ` });
    } catch (error) {
      res.status(400).send(`Something Went Wrong ${error.message}`);
    }
  }
);

module.exports = connectionRequestRouter;
