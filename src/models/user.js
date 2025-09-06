const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
      minLength: 3,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^(?:\+91|91)?[6-9]\d{9}$/, "Please enter a valid phone number"],
    },

    age: {
      type: Number,
      min: 11,
      trim: true,
    },
    gender: {
      type: String,
      lowercase: true,
      //custom validator
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Unexpected String !");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://nationalchaplains.us/wp-content/uploads/2021/07/dummy-profile-pic.jpg",
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is the default description about the user...",
      maxLength: 200,
      minLength: 30,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign({ id: user._id },process.env.Secret_Key, { expiresIn: "1d" });

  return token;
};

userSchema.methods.checkPassword = async function (password) {
  const user = this;

  const result = await bcrypt.compare(password, user.password);

  return result;
};

module.exports = mongoose.model("User", userSchema, "users");
