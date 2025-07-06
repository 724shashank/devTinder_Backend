const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    if(!req.cookies.token)
    {
      throw new Error("Token is not valid...");
    }
    const { token } = req.cookies;
    const decoded = jwt.verify(token, "Secret@!Key");
    const user = await User.findById(decoded.id);
    if (!res) {
      res.status(401).send("User not found");
    } else {
      req.user = user; //due to request lifecycle req.user will be available to next middleware/routehandler
      next();
    }
  } catch (error) {
    res.status(400).send(`Error :- ${error.message}`);
  }
};

module.exports = {
  userAuth,
};
