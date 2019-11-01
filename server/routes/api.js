/* eslint-disable function-paren-newline */
const express = require('express');

const fileController = require('../controllers/fileController');

const router = express.Router();

// ADD STARTER DATA REQUEST ROUTE HANDLER HERE
router.get("/", fileController.getCharacters, (req, res, next) => {
  const characters = { characters: res.locals.characters };
  res.status(200).json(characters);
});

module.exports = router;
