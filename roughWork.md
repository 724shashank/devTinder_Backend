//Feed API GET/Feed

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({}); //if we want all users we left the find field empty
    if (users.length === 0) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong" + error.message);
  }
});

//Delete User API DELETE/user

app.delete("/user", async (req, res) => {
  try {
    const response = await User.findByIdAndDelete({ _id: req.body.id });
    if (response === null) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send("User Deleted : " + response);
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong" + error.message);
  }
});

//Update User API Patch/user

app.patch("/user/:userId", async (req, res) => {
  try {
    //API Level validations
    const allowedFields = [
      "password",
      "photoUrl",
      "skills",
      "about",
      "mobileNo",
    ];
    const result = Object.keys(req.body).every((k) =>
      allowedFields.includes(k)
    );
    if (!result) {
      throw new Error("Update is not Possible");
    }

    if (req.body?.skills.length >= 11) {
      throw new Error("Update is not Possible");
    }

    const response = await User.findByIdAndUpdate(
      { _id: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (response === null) {
      res.status(404).send("No data found");
    } else {
      res.status(200).send("User Firstname Updated to :" + response);
    }
  } catch (error) {
    res.status(500).send("Something Went Wrong " + error.message);
  }
});


/request/send/:like/:userId
/request/send/:ignored/:userId
/request/review/accepted/:requestId
/request/review/rejected/:requestId

firstname,lastname,gender,age,photoURL,skills,about,mobileNo.