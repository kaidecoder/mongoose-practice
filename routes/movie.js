const express = require("express");
const router = express.Router();

const Movies = require("../models/movie");

//GET all movies, limit 50
router.get("/", async (req, res) => {
  let movies = await Movies.find().limit(50)
  res.render("movies", { movies: movies });
});

module.exports = router;
