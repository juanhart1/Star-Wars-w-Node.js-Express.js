const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

/**
 * require routers
 */
const apiRouter = require('../server/routes/api.js');
const favsRouter = require('../server/routes/favs.js');
const newCharRouter = require('../server/routes/characters.js');

/**
 * handle parsing request body
 */
app.use(bodyParser.json());

/**
 * handle requests for static files
 */

app.use('/assets', express.static('client/assets'));
// app.use('/assets', express.static(__dirname + '/../client/assets'));

/**
 * define route handlers
 */
app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.use('/api/characters', newCharRouter);
app.use('/api/favs', favsRouter);
app.use('/api', apiRouter);

// route handler to respond with main app
function errorHandler (error, req, res, next){
  const defaultErr = {
    log: "Express error handler caught unknown middleware error.",
    status: 400,
    message: { err: "An error occurred." },
  };
  const errorObj = Object.assign(defaultErr, error);
  console.log(`Here is the errorObj's log property => ${errorObj.log}`);
  res.status(errorObj.status).json(errorObj.message);
}

// catch-all route handler for any requests to an unknown route
app.all('*', (req, res) => {
  res.sendStatus(404);
});

app.use(errorHandler);

/**
 * configire express global error handler
 * @see https://expressjs.com/en/guide/error-handling.html#writing-error-handlers
 */
// eslint-disable-next-line no-unused-vars


/**
 * start server
 */
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;
