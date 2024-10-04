const mongoose = require("mongoose");
const { MONGODB_URI } = require("../utils/config.js");
mongoose.set("strictQuery", false);

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log("connected db nz");
}
async function disconnectDB() {
  await mongoose.connection.close();
  console.log("closed db nz");
}
const noteSchema = new mongoose.Schema({
  number: Number,
  test: String,
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Note = mongoose.model("note", noteSchema);
module.exports = { Note, connectDB, disconnectDB };
