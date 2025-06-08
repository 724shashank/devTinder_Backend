const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello From the server...");
});

app.get("/test", (req, res) => {
  res.send("Hello From the Test Route...");
});

app.listen(3000, () => {
  console.log("The Server Is Up and Running...");
});
