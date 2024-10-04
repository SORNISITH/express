const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const DB = require("./models/mongoModel");
const { unknownEndpoint, errorhandle } = require("./utils/middleware");
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

app.get("/notes", async (req, res) => {
  await DB.connectDB();
  const result = await DB.Note.find({});
  res.json(result);
  await DB.disconnectDB();
});
app.get("/notes/:id", async (req, res, next) => {
  await DB.connectDB();
  DB.Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .finally(() => {
      DB.disconnectDB();
    })
    .catch((error) => next(error));
});

app.delete("/notes/:id", async (req, res, next) => {
  await DB.connectDB();
  DB.Note.findByIdAndDelete(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .finally(() => {
      DB.disconnectDB();
    })
    .catch((error) => next(error));
});

app.put("/notes/:id", async (req, res, next) => {
  const objNote = {
    content: "hello world",
    important: true,
  };
  await DB.connectDB();
  await DB.Note.findByIdAndUpdate(req.params.id, objNote, { new: false })
    .then((updatednote) => {
      res.json(updatednote);
    })
    .catch((err) => next(err));
  DB.disconnectDB();
});

app.post("/notes", async (req, res) => {
  const body = req.body;
  await DB.connectDB();
  const note = new DB.Note({
    number: 0,
    test: "nz",
    content: "my db is good ",
    important: true,
  });

  await note.save().then((result) => {
    res.json(result);
  });
  await DB.disconnectDB();
});

app.use(errorhandle);

module.exports = app;
