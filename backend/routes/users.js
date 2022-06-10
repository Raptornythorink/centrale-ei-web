const express = require("express");
const MovieModel = require("../models/movies");
const UserModel = require("../models/user");
const router = express.Router();

router.get("/", function (req, res) {
  UserModel.find({}).then(function (users) {
    res.json({ users: users });
  });
});

router.get("/:id", async function (req, res) {
  const userId = req.params.id;
  const allMoviesUser = await MovieModel.find({ _id: userId });
  res.status(201).json(allMoviesUser);
});

router.get("/:id/recommended", async function (req, res) {
  const userId = req.params.id;
  const user= await UserModel.find({_id: userId});
  const recoMovies=user[0].recommendedMovies;
  res.status(201).json(recoMovies)
})

router.post("/new", function (req, res) {
  const newUser = new UserModel({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    recommendedMovies: req.body.recommendedMovies,
  });

  newUser
    .save()
    .then(function (newDocument) {
      res.status(201).json(newDocument);
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === 11000) {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: "Error while creating the user" });
      }
    });
});

router.delete("/:userId", function (req, res) {
  UserModel.deleteOne({ _id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: "User successfully deleted" });
    })
    .catch(function () {
      res.status(500).json({ message: "Error while deleting the user" });
    });
});

router.get("/:id/movies", async function (req, res) {
  const userId = req.params.id;
  const user = await UserModel.findOne({
    _id: userId,
  }).populate("watchedMovies");
  res.status(201).json(user.watchedMovies);
});

module.exports = router;
