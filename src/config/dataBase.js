const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://shashankyadav724:cHg1Iy9C3KArCBE8@devtinder.zqxbcyd.mongodb.net/devTinder?retryWrites=true&w=majority&appName=DevTinder"
  );
  
};

module.exports = connectDB()
 
 
  