const express = require("express");
const MovieModel = require("../models/movies");
const UserModel = require("../models/user");
const NoteModel = require("../models/notation");
const router = express.Router();

router.get("/get/:movieId/:userId", async function (req, res) {
  const movieId = req.params.id;
  const userId = req.params.id;
  try {
    const note = await MovieModel.find({ movie: movieId, user: userId });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Note not found" });
  }
});

router.get("/users/:userId", async function (req, res) {
  const userId = req.params.id;
  try {
    await UserModel.find({ _id: userId });
    const allRatedMovies = await NoteModel.find({ user: userId });
    res.status(201).json(allRatedMovies);
  } catch {
    res.status(500).json({ message: "User not found" });
  }
});

router.get("/movies/:movieId", async function (req, res) {
  const movieId = req.params.id;
  try {
    await MovieModel.find({ id: movieId });
    const allRates = await NoteModel.find({ movie: movieId });
    res.status(201).json(allRates);
  } catch {
    res.status(500).json({ message: "Movie not found" });
  }
});

router.put("/new/:movieId/:userId/:note", async function (req, res) {
  try {
    const newNote = await NoteModel.findOneAndUpdate(
      {
        user: req.params.userId,
        movie: req.params.movieId,
      },
      {
        user: req.params.userId,
        movie: req.params.movieId,
        note: req.params.note,
      },
      { new: true, upsert: true }
    );
    res.status(201).json(newNote);
  } catch {
    res.status(500).json({ message: "Could not add the note" });
  }
});

module.exports = router;
