const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello From the server...");
});

app.get("/test/:userID/:password",(req, res, next) => {
    console.log(req.params);
    next();
  },
  [(req, res, next) => {
    console.log("Adding Route handler 1");
    res.send("Hello From Route handler 1");
    next();
  },
  (req, res, next) => {
    console.log("Adding Route handler 2");
    next();
  }],
  [(req, res, next) => {
    console.log("Adding Route handler 3");
    res.send("Hello From Route handler 3");
  }],
);

app.listen(3000, () => {
  console.log("The Server Is Up and Running...");
});
