const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middleware/adminAuth");

app.use("/admin", adminAuth);

app.use("/user", userAuth, (req, res,next) => {
 console.log("Checking User Details");
 next();
});

app.get("/user/test1", (req, res) => {
  res.send("user1 Route handler");

});

app.get("/user/test2", (req, res) => {
  res.send("user2 Route handler");
});

app.get("/admin/test1", (req, res) => {
  res.send("Test1 Route handler");
});

app.get("/admin/test2", (req, res) => {
  res.send("Test2 Route handler");
});

app.listen(3000, () => {
  console.log("The Server Is Up and Running...");
});
