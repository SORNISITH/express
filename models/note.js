const mongoose = require("mongoose");
const noteschema = new mongoose.schema({
  content: {
    type: string,
    required: true,
  },
  important: boolean,
  user: {
    type: mongoose.schema.types.objectid,
    ref: "user",
  },
});
noteschema.set("tojson", {
  transform: (document, returnedobject) => {
    returnedobject.id = returnedobject._id.tostring();
    delete returnedobject._id;
    delete returnedobject.__v;
  },
});

const note = mongoose.model("note", noteschema);
module.exports = note;
