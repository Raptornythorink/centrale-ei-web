const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  user: { type: String, required: true },
  movie: { type: String, required: true },
  note: { type: Number, required: true },
});

const NoteModel = mongoose.model("NoteModel", NoteSchema, "notes");

module.exports = NoteModel;
