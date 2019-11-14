const fs = require('fs');
const path = require('path');

const fileController = {};

fileController.getCharacters = (req, res, next) => {
  const { results } = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/characters.json'), 'UTF-8'));
  if (!results) {
    return next({
      log: 'fileController.getCharacters: ERROR: Error getting characters data from characters.json file',
      message: { err: 'Error occurred in fileController.getCharacters. Check server logs for more details.' },
    });
  }
  res.locals.characters = results;
  next();
};

// ADD MIDDLEWARE TO GET FAVORITE CHARACTERS HERE
fileController.getFavs = (req, res, next) => {
  //use fs module to read the data living in the favs.json file
  fs.readFile(path.join(__dirname, "../data/favs.json"), "utf8", (err, fileContents) => {
    //if any errors occur, invoke the express global error handler
    if (err) {
      //create error object based on information provided in instructions
      const errorObj = {
        log: `fileController.getFavs: ERROR: /* the error from the file system */`,
        message: { err: 'fileController.getFavs: ERROR: Check server logs for details' },
      };
      //invoke next w/ the erroObj we put together => use return keyword to end thread of execution
      return next(errorObj);
    } else {
      //parse the JSON content from the file => JSON to JS
      fileContents = JSON.parse(fileContents);
      //store all observed favorites @ res.locals.favs
      res.locals.favs = fileContents;
      //then move on to next piece of middleware => use return keyword to end thread of execution
      return next();
    }
  });
};

// ADD MIDDLEWARE TO ADD A FAVORITE CHARACTER HERE
fileController.addFav = (req, res, next) => {
  //ensure that the res.locals has a property named 'favs' and that it is assigned to an object
  if (res.locals.favs === undefined || typeof res.locals.favs !== 'object') {
    //if either are untrue, invoke error handler function
    const errorObj = {
      log: 'fileController.addFavs: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.addFavs: ERROR: Check server logs for details' },
    };
    return next(errorObj);
  }
  //once vetted that information is present, we will need to grab the 'id' of the character that we want to make a favorite => store the id in a variable
  const { id } = req.params;
  //check res.locals.favs to see if it has a property matching the 'id' we just attained
  //if it doesn't, do something else
  if (!res.locals.favs.hasOwnProperty( id )) {
    res.locals.favs[id] = true;
    //use fs module to add new favorites saved in res.locals.favs back into the 'favs.json' file
    fs.writeFile(path.join(__dirname, "../data/favs.json"), JSON.stringify(res.locals.favs, null, 2), (err) => {
      //if an error occurs after the validation check, invoke the global error handler
      if (err) {
        const errorObj = {
          log: `fileController.addFav: ERROR: /* the error from the file system / other calls */`,
          message: { err: 'fileController.addFav: ERROR: Check server logs for details' },
        };
        return next(errorObj);
      } else {
        console.log(`Favs have been updated!`);
        return next();
      }
    })
    //if it does, do something
  } else {
    return next();
  }
};


// ADD MIDDLEWARE TO REMOVE A CHARACTER FROM FAVORITES HERE
fileController.removeFav = (req, res, next) => {
  //ensure that the res.locals has a property named 'favs' and that it is assigned to an object
  if (res.locals.favs === undefined || typeof res.locals.favs !== 'object') {
    //if either are untrue, invoke error handler function
    const errorObj = {
      log: 'fileController.removeFav: ERROR: Invalid or unfound required data on res.locals object - Expected res.locals.favs to be an object.',
      message: { err: 'fileController.removeFav: ERROR: Check server logs for details' },
    };
    return next(errorObj);
  } else {
    //access the 'id' of the character we are looking to remove from the request params & store it in a variable
    const { id }  = req.params;
    //check to see if res.locals.favs has a property matching the newly stored 'id'
    if (res.locals.favs[id]) {
      //if it does have it, we will need to delete this property from res.locals.favs
      delete res.locals.favs[id];
      //use fs.writeFile to write the newly modified res.locals.favs object to the favs.json file
      //error handle if any errors occur during that process
      fs.writeFile(path.join(__dirname, "../data/favs.json"), JSON.stringify(res.locals.favs, null, 2), (err) => {
        //if an error occurs after the validation check, invoke the global error handler
        if (err) {
          const errorObj = {
            log: `fileController.removeFav: ERROR: /* the error from the file system / other calls */`,
            message: { err: 'fileController.removeFav: ERROR: Check server logs for details' },
          };
          return next(errorObj);
        } else {
          console.log(`Fav has been deleted!`);
          return next();
        }
      })
      //if it doesn't have it, simply move along
    } else {
      return next();
    }
  }
};

// Extention 1: ADD MIDDLEWARE TO GET CHARACTER NICKNAMES HERE


// Extention 1: ADD MIDDLEWARE TO SET A CHARACTER'S NICKNAME HERE


// Extention 1: ADD MIDDLEWARE TO REMOVE A CHARACTER'S NICKNAME HERE


module.exports = fileController;
