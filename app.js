const express = require("express");
const { MONGODB_URI } = require("./utils/config.js");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan"); // for handle every request nad resonse
const logger = require("./utils/logger.js");
const mongoose = require("mongoose");
const notesRouter = require("./controllers/notesRouter.js");
const usersRouter = require("./controllers/usersRouter.js");
const { loginRouter, logoutRouter } = require("./controllers/login.js");
const blogRouter = require("./controllers/blogRouter.js");
const middleware = require("./utils/middleware");
mongoose.set("strictQuery", false);
logger.info("connecting to mongoDB");
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info("conneted to mongodb");
  })
  .catch((e) => {
    logger.error("error connecting to mongdb", e.message);
  });

app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);
app.use("/api/blog", blogRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use(middleware.autoHandleError);
app.use(middleware.unknownEndpoint);

module.exports = app;
