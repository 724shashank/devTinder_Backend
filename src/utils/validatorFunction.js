const mongoose = require("mongoose");

const validator = require("validator");
function validatorFunction(req, res, next) {
  const { emailId, mobileNo, password } = req.body;

  if (!validator.isEmail(emailId)) {
    return next(new Error("Email is not valid"));
  } else if (!validator.isMobilePhone(mobileNo, "any")) {
    return next(new Error("Mobile no. is not valid"));
  } else if (!validator.isStrongPassword(password)) {
    return next(new Error("Password is weak..."));
  }
next();
}

function profileEdit(req, res, next) {
  const allowedEditFields = [
    "firstName",
    "lastname",
    "mobileNo",
    "age",
    "gender",
    "photoUrl",
    "skills",
    "about",
  ];

  const result = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );

  if (!result) {
    return next(new Error("Update Unsuccessful"));
  }
  next();
}

function validatePassword(req, res, next) {
  const allowedEditFields = ["password"];
  //if password is not present then skip validation and if password present then check it's strong or not
  const isStrongPassword =
    req.body.password.trim().length >= 0 &&
    validator.isStrongPassword(req.body.password) &&
    typeof req.body.password === "string";
  const onlyAllowedFields = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );
  if (!onlyAllowedFields) {
    return next(new Error("Only password can be updated"));
  } else if (!isStrongPassword) {
    return next(new Error("Password is not strong enough"));
  }
  next();
}

function dynamicParams(req,res,next){
const status=req.params.status;
const toUserID=req.params.toUserID;

if(!["interested","pass"].includes(status)){
  return next(new Error("Invalid status parameter"));
}

if(!mongoose.Types.ObjectId.isValid(toUserID)){
return next(new Error("Invalid User ID parameter"))
}



next();
}

module.exports = {
  validatorFunction,
  profileEdit,
  validatePassword,
  dynamicParams
};

//These two are different

//mongoose.Types.ObjectId is the construstor function for mongodb object ID having various methods like isValid(),.toHexString() etc.

//mongoose.Schema.Types.ObjectId this is used inside your schema to define a field's type.