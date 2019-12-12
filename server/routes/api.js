/* eslint-disable function-paren-newline */
const express = require('express');

const { getCharacters, getFavs, addFav, removeFav } = require('../controllers/fileController');

const router = express.Router();

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
router.get("/", getCharacters, getFavs, (req, res, next) => {
  // const { characters, favs } = res.locals;
  const charactersToBeSent = res.locals;
  res.status(200).json(charactersToBeSent);
});

module.exports = router;
