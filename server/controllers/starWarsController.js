const fetch = require('node-fetch');

const { convertToPhotoUrl } = require('../utils/helpers');

const starWarsController = {};

// ADD MIDDLEWARE TO GET MORE CHARACTERS HERE
starWarsController.getMoreCharacters = (req, res, next) => {
  //send a GET request to the specified url to get 10x more characters
  fetch('https://swapi.co/api/people/?page=3')
    //use .then handler to convert JSON received into JS
    .then(charactersJSON => charactersJSON.json())
    //use .then to handle data requested
    .then(characters => {
      //store response in res.locals.newCharacters
      res.locals.newCharacters = characters.results;
      //move on to next piece of middleware
      return next();
    })
    //error handle for GET request
    .catch(error => {
      //errorObj describes error that occurred
      const errorObj = {
        log: `starWarsController.getMoreCharacters: ${error.message}`,
        message: { err: 'starWarsController.getMoreCharacters: ERROR: Check server logs for details' }
      };
      //invoke next w/ errorObj and use return keyword to end thread of execution
      return next(errorObj);
    });
};

// ADD MIDDLEWARE TO ADD CHARACTER PHOTOS HERE
starWarsController.populateCharacterPhotos = (req, res, next) => {
  //check res.locals.newCharacters to ensure that it has shit in it
  //if it doesn't, error handle
  if (!res.locals.newCharacters.length) {
    const errorObj = {
      log: `starWarsController.populateCharacterPhotos: ${error.message}`,
      message: { err: 'starWarsController.populateCharacterPhotos: ERROR: Check server logs for details' }
    };
    return next(errorObj);
  }
  //if it does, proceed
  const newCharacters = res.locals.newCharacters;
  //iterate over array of character objects
  newCharacters.forEach(character => {
    const { name } = character;
    //at each iteration, we will add a property to the character object named 'photo' and assign it the value returned from invoking convertToPhotoUrl w/ the current character's name
    character["photo"] = convertToPhotoUrl(name);
  });
  //invoke next piece of middleware
  return next();
};

// ADD REQUEST CHARACTER VALIDATION MIDDLEWARE HERE
starWarsController.validateRequestCharacter = (req, res, next) => {
  const { character } = req.body;
  const { homeworld, films } = req.body.character;
  //confirm that request body contains properties named character, homeworld, and films
  if (character && homeworld && films) {
    //if it does, move to the next piece of middleware
    return next();
  }
  const errorObj = {
    log: 'starWarsController.validateRequestCharacter: ERROR: expected /* insert missing property here */ to exist',
    message: { err: 'server POST /details: ERROR: Invalid request body' },
  };
  //if it does, error handle
  return next(errorObj);
};

// ADD GET HOMEWORLD MIDDLEWARE HERE
starWarsController.getHomeWorld = (req, res, next) => {
  //use the request body to access the 'homeworld' property, which is a url, to send a request and store the results in res.locals.homeworld
  const { homeworld } = req.body.character;
  fetch(homeworld)
    .then(homeworldJSON => homeworldJSON.json())
    .then(homeworldResponse => {
      res.locals.homeworld = homeworldResponse;
      return next();
    })
    //error handle for GET request
    .catch(error => {
      const errorObj = {
        log: `starWarsController.getHomeWorld: ${error.message}`,
        message: { err: 'starWarsController.getHomeWorld: ERROR: Check server logs for details' }
      };
      return next(errorObj);
    });
};

// ADD GET FILMS MIDDLEWARE HERE
starWarsController.getFilms = (req, res, next) => {
  //use the request's body property to access the 'film's property value
  const { films } = req.body.character;
  //create an array to store all fetch Promises
  const filmArray = [];
  //iterate over the 'films' array of urls
  films.forEach(filmUrl => {
    //create a variable to store the Promise returned from each fetch => then convert the JSON into JS
    const filmFetch = fetch(filmUrl).then(filmResponse => filmResponse.json());
    //push that Promise into the filmArray of Promises
    filmArray.push(filmFetch);
  });
  //use Promise.all to attempt to resolve those errors at once
  Promise.all(filmArray)
    .then(promiseFilms => {
      //add the array of films to res.locals at the property of 'films;
      res.locals.films = promiseFilms;
      return next();
    })
    //if any Promise is unsuccessfully resolved, error handle
    .catch(error => {
      //create error object to be passed to global error handler
      const errorObj = {
      log: `starWarsController.getFilms: ERROR: ${typeof error === 'object' ? JSON.stringify(error) : error}`,
      message: { err: 'starWarsController.getFilms: ERROR: Check server logs for details' },
    };
    //invoke next with the errorObj to pass it to the global error handler
    return next(errorObj);
  });
};

module.exports = starWarsController;
