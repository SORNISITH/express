const loginRouter = require("express").Router();
const logoutRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const config = require("../utils/config");
const { checkUserPassword, checkId_currentUser } = require("./authorization");
const logger = require("../utils/logger");
const tokenAge = 3 * 24 * 60 * 60;
const createToken = (id, username) => {
  return jwt.sign({ id, username }, config.SECRET, {
    expiresIn: tokenAge,
  });
};

loginRouter.post("/", checkUserPassword, async (request, response, next) => {
  const { username } = request.body;
  const user = await User.findOne({ username });
  const token = createToken(user._id, username.username);
  logger.info("-> login success!");
  response.cookie("jwt", token, {
    httpOnly: true, // If you want the cookie accessible in JavaScript
    secure: false, // Set to true if you're using HTTPS
    sameSite: "None", // Adjust this based on your use case ('Strict', 'Lax', or 'None')
    age: tokenAge * 1000,
  });
  response.status(200).send({
    status: "login success!",
    userid: user._id,
    username: user.username,
  });
});

logoutRouter.post("/", checkId_currentUser, async (request, response, next) => {
  const id = response.locals.user?._id;
  const username = response.locals.user?.username;
  if (id == undefined) {
    response.status(200).send({ status: "no current user login!" });
  } else {
    logger.info(`-> name: ${username}  id: ${id} -> logout done!`);
    response.cookie("jwt", "", { age: 1 });
    response.status(200).send({ status: "logout success!" });
    //response.redirect("/");
  }
});
module.exports = { loginRouter, logoutRouter };
