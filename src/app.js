const express = require("express");
const app = express();

app.get("/user/test1", (req, res) => {
  //res.send("user1 Route handler");
  throw new Error("Possible error");
});

app.get("/user/test2", (req, res) => {
  //res.send("user1 Route handler");
  throw new Error("Possible error occured");
});
//Global Error Handler
app.use((err,req,res,next)=>{
  res.status(401).send("Something Went Wrong...!")
})

app.listen(3000, () => {
  console.log("The Server Is Up and Running on port no.3000");
});
