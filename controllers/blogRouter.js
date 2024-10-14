const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const {
  checkAuth,
  checkId_currentUser,
} = require("../controllers/authorization");
const config = require("../utils/config");
//   Schema
//   url: String,
//   title: String,
//   author: String,
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
//   likes: Number,
blogRouter.get("/", checkAuth, async (request, response, next) => {
  const result = await Blog.find({})
    .populate("user", {
      username: 1,
    })
    .catch((e) => next(e));
  response.status(200).json(result);
});
blogRouter.put("/:id", async (request, response, next) => {
  const blog = await Blog.findById(request.params.id).catch((e) => next(e));
  if (!blog) {
    return;
  } else if (blog) {
    await blog.updateOne({ likes: blog.likes + 1 });
    response.status(201).json(blog);
  }
});
//TODO
blogRouter.post("/", checkId_currentUser, async (request, response, next) => {
  const id = await response.locals.user._id;
  const { url, title, author } = request.body;
  const obj = {
    url: url ?? "no link provided",
    title: title ?? "no title",
    author: author ?? "anonymouse",
    user: id,
  };
  const saveBlog = new Blog(obj);
  await saveBlog.save().catch((e) => next(e));
  //append blog in user
  const user = await User.findById(id).catch((err) => next(err));
  user.blogs = await user.blogs.concat(saveBlog._id);
  await user.save();
  response.status(201).json(obj);
});
module.exports = blogRouter;
