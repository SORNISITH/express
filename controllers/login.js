const loginRouter = require("express").Router();
const logoutRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const config = require("../utils/config");
const { checkUserpwd } = require("./authorization");

const tokenAge = 3 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, config.SECRET, {
    expiresIn: tokenAge,
  });
};

loginRouter.post("/", checkUserpwd, async (request, response, next) => {
  const { username } = request.body;
  const user = await User.findOne({ username });
  const token = createToken(user._id, username.username);
  response.cookie("jwt", token, { httpOnly: true, age: tokenAge * 1000 });
  response.status(200).send({ status: "login success!" });
});

logoutRouter.post("/", async (request, response, next) => {
  response.cookie("jwt", "", { age: 1 });
  response.status(200).send({ status: "logout success!" });
  //response.redirect("/");
});
module.exports = { loginRouter, logoutRouter };
