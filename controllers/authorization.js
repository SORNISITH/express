const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const User = require("../models/user");
const logger = require("../utils/logger");
const getToken = async (request) => {
  const authorization = await request.get("Authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

const checkUserPassword = async (request, response, next) => {
  logger.info("-> Checking_Password...");
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const checkPwd =
    user === null ? false : await bcrypt.compare(password, user.password);
  if (!(user && checkPwd)) {
    logger.error("-> Password...incorrect!");
    return response.status(401).json({
      code: "",
      error: "invalid username or password",
      description: "Unauthorized access (general case)",
    });
  } else if (user && checkPwd) {
    logger.info(`-> id: ${user._id} : name: ${user.username} login : sucess!`);
    next();
  }
};
const checkAuth = async (request, response, next) => {
  logger.info("-> checking_auth....");
  // const token = await getToken(request);
  const token = request.cookies.jwt;
  if (token) {
    jwt.verify(token, config.SECRET, async (err, decodeToken) => {
      if (err) {
        logger.info("-> auth....scucess!");
        response.status(404).json({ error: "auth fail" });
      } else {
        next();
      }
    });
  } else {
    logger.error("-> checking_auth fail");
    response.status(404).json({ error: "please login first!" });
  }
};
const checkId_currentUser = async (request, response, next) => {
  logger.info("-> checking_current_user....");
  const token = request.cookies.jwt;
  if (token) {
    jwt.verify(token, config.SECRET, async (err, decodeToken) => {
      if (err) {
        response.status(404).json({ error: "auth failed" });
      } else if (decodeToken) {
        let user = await User.findById(decodeToken.id);
        //logger.info(user);
        logger.info("-> checking_current_user : scucess!");
        // pass data to next request
        // @username
        // @_id
        response.locals.user = user;
        next();
      }
    });
  } else {
    logger.error("-> check_currentuser : no current user");
    response.locals.user = null;
    response.status(404).json({ error: "please login first!" });
  }
};
module.exports = {
  getToken,
  checkAuth,
  checkUserPassword,
  checkId_currentUser,
};
