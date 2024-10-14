const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  url: String,
  title: String,
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: Number,
});

blogSchema.set("toJSON", {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.toString();
    delete returnObj._id;
    delete returnObj.__v;
  },
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
