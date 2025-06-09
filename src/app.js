const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello From the server...");
});

app.get("/test/:userID/:password", (req, res) => {
  console.log(req.params)
  res.send("Hello From the Test Route...");
});
app.post("/test", (req, res) => {
  res.send("Hello From the Post Method...");
});

app.patch("/test", (req, res) => {
  res.send("Hello From the Patch Method..");
});

app.delete("/test", (req, res) => {
  res.send("Hello From the Delete Method...");
});

app.listen(3000, () => {
  console.log("The Server Is Up and Running...");
});
