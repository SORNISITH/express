const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user.js");
usersRouter.post("/", async (req, res, next) => {
  const getbody = req.body;
  const saltRounds = 10;
  const pass1 = getbody.password;
  const password = await bcrypt.hash(pass1, saltRounds);
  const user = new User({
    username: getbody.username,
    name: getbody.name,
    password: password,
    userType: "guest",
  });
  const savedUser = await user.save().catch((e) => next(e));
  res.status(201).json(savedUser);
});
usersRouter.get("/", async (request, response, next) => {
  const users = await User.find({})
    .populate("notes", {
      content: 1,
      important: 1,
    })
    .populate("blogs", {
      url: 1,
      title: 1,
      author: 1,
    })
    .exec()
    .catch((err) => response.status(404).json({ error: err.message }));
  response.status(200).json(users);
});
module.exports = usersRouter;
