/* eslint-disable no-unused-vars */
const express = require("express");
const { ConnectionStates } = require("mongoose");
const MovieModel = require("../models/movies");
const router = express.Router();

router.get("/", async function (req, res) {
  const allMovies = await MovieModel.find({}).populate("viewers");
  res.status(201).json(allMovies);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  const movie = await MovieModel.find({ id: id });
  res.status(201).json(movie);
});

router.post("/new", async function (req, res) {
  try {
    const newMovie = new MovieModel({
      title: req.body.title,
      release_date: req.body.release_date,
      desc: req.body.desc,
      genres: req.body.genres,
    });
    const createdMovie = await newMovie.save();
    res.status(201).json(createdMovie);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Error while adding the movie", error})
  }
})

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
    console.log(error)
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
