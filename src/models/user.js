const mongoose = require("mongoose");

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
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    mobileNo: {
      type: Number,
      required: true,
      unique: true,
     match: [/^(?:\+91|91)?[6-9]\d{9}$/, "Please enter a valid phone number"]
    },
    password: {
      type: String,
      required: true,
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
      match:[/^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/,"URL not valid..."],
      default:"https://icones.pro/wp-content/uploads/2021/02/icone-utilisateur.png",
      
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is the default description about the user...",
      maxLength:200,
      minLength:30
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema, "users");
