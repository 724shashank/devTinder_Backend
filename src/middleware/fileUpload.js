const multer = require("multer");

// Configure storage (where and how to save files)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, "./src/uploads"); //(.) denotes current working directory (CWD) which is S:\Tutorial\devTinder\devTinder_Backend\
  },
  filename: (req, file, cb) => {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = storage;
