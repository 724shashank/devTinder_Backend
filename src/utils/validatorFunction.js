const validator = require("validator");
function validatorFunction(req) {
  const { emailId, mobileNo, password } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isMobilePhone(mobileNo, "any")) {
    throw new Error("Mobile no. is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak...");
  }
}

module.exports = {
  validatorFunction,
};
