const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");
const { addEventListener } = require("nodemon");
const getToken = async (request) => {
  const authorization = await request.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};
const checkAuth = async (request, response, next) => {
  // const token = await getToken(request);
  const token = request.cookies.jwt;
  if (token) {
    jwt.verify(token, config.SECRET, async (err, decodeToken) => {
      if (err) {
        response.status(404).json({ error: "auth fail" });
      } else {
        next();
      }
    });
  } else {
    response.status(404).json({ error: "please login first!" });
  }
};

const checkUserpwd = async (request, response, next) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const checkPwd =
    user === null ? false : await bcrypt.compare(password, user.password);
  if (!(user && checkPwd)) {
    return response.status(401).json({
      code: "",
      error: "invalid username or password",
      description: "Unauthorized access (general case)",
    });
  } else if (user && checkPwd) {
    next();
  }
};

const checkId_currentUser = async (request, response, next) => {
  const token = request.cookies.jwt;
  if (token) {
    jwt.verify(token, config.SECRET, async (err, decodeToken) => {
      if (err) {
        response.status(404).json({ error: "auth failed" });
      } else {
        const user = await User.findById(decodeToken._id);
        response.locals.user = user;
        next();
      }
    });
  } else {
    response.locals.user = null;
    response.status(404).json({ error: "please login first!" });
    next();
  }
};
module.exports = {
  getToken,
  checkAuth,
  checkUserpwd,
  checkId_currentUser,
};
