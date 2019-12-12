/* eslint-disable function-paren-newline */
const express = require('express');

const { getMoreCharacters, populateCharacterPhotos, validateRequestCharacter, getHomeWorld, getFilms } = require('../controllers/starWarsController');

const router = express.Router();

// ADD GET MORE CHARACTERS ROUTE HANDLER HERE
router.get('/', getMoreCharacters, populateCharacterPhotos, (req, res, next) => {
  const { newCharacters } = res.locals;
  //create a variable to store the new characters
    //this required a little debugging => instead of sending the array of character objects, I was supposed to send an object w/ a key of 'newCharacters' & a value of the array of character objects back to the client as a json object
  const newCharactersToSendBack = { newCharacters: newCharacters };
  //respond to HTTP request to this route with status of 200 & a json object containing the newCharacters added
  res.status(200).json(newCharactersToSendBack);
});

// ADD GET CHARACTER DETAILS ROUTE HANDLER HERE
router.post('/details', validateRequestCharacter, getHomeWorld, getFilms, (req, res, next) => {
  const homeWorldAndFilms = res.locals;
  res.status(200).json(homeWorldAndFilms);
});

module.exports = router;
