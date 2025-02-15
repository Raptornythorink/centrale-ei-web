/* eslint-disable no-unused-vars */
const express = require("express");
const { ConnectionStates } = require("mongoose");
const MovieModel = require("../models/movies");
const router = express.Router();

router.get("/", async function (req, res) {
  const allMovies = await MovieModel.find({}).populate("viewers");
  res.status(201).json(allMovies);
});

router.get("/get/:movieId", async function (req, res) {
  const movie = await MovieModel.find({ id: req.params.movieId });
  res.status(201).json(movie);
});

router.post("/new:viewers", async function (req, res) {
  try {
    const newMovie = new MovieModel({
      title: req.body.title,
      desc: req.body.desc,
      url: req.body.url,
      viewers: req.body.viewers,
    });
    const createdMovie = await newMovie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error while adding the movie" });
  }
});

router.put("/:id:viewers", async function (req, res) {
  try {
    const id = req.params.id;
    let doc = await MovieModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not find the movie" });
  }
});

module.exports = router;
