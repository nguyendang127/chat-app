var express = require("express");
var router = express.Router();

router.post("/addfriend", (req, res) => {
  let newFriendAdd = req.body;
  let findFriend = await user
    .find({ username: newFriendAdd.username })
    .lean()
    .exec();
  if (findFriend) {
    await User.findByIdAndUpdate(
      { _id: newFriendAdd.owners },
      { $push: { friends: findFriend._id } }
    );
    await project.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.send({ redirect: "/addmember" });
      }
    });
  }
  else{
      res.send({error: "khong tim thay voi username nay"})
  }
});
