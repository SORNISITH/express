const jwt = require("jsonwebtoken");
const notesRouter = require("express").Router();
const Note = require("../models/note.js");
const User = require("../models/user.js");
const config = require("../utils/config");
const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};
notesRouter.get("/", async (request, response, next) => {
  const note = await Note.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(note);
});

notesRouter.get("/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.post("/", async (request, response, next) => {
  const token = getTokenFrom(request);
  if (!token) return response.status(401).json({ error: "unauthorized acess" });
  const body = request.body;
  const decodedToken = () => {
    try {
      const x = jwt.verify(token, config.SECRET);
      return x;
    } catch (e) {
      next(e);
      return false;
    }
  };
  const tokenId = decodedToken();
  if (tokenId === false) {
    return;
  }
  const user = await User.findById(tokenId.id);
  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user.id,
  });
  const saveNote = await note.save();
  user.notes = user.notes.concat(saveNote._id);
  await user.save();
  response.status(201).json(saveNote);
});

notesRouter.delete("/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});
module.exports = notesRouter;
