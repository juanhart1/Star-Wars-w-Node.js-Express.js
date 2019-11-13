/* eslint-disable function-paren-newline */
const express = require('express');

const { getCharacters, getFavs, addFav, removeFav } = require('../controllers/fileController');

const router = express.Router();

// ADD STORE FAVORITE ROUTE HANDLER HERE
router.post("/:id", getFavs, addFav, (req, res, next) => {
  const favs = res.locals;
  res.status(200).json(favs);
});

// ADD REMOVE FAVORITE ROUTE HANDLER HERE
router.delete("/:id", getFavs, removeFav, (req, res, next) => {
  const favs = res.locals;
  res.status(200).json(favs);
});

module.exports = router;
