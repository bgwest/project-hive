'use strict';

// development note: needed to include this twice...

const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger');
const loggerMiddleware = require('./logger-middleware');
const errorMiddleware = require('./error-middleware');

const authAccountRoutes = require('../routes/auth-router');
const armRoutes = require('../routes/arm-route');
// const imageRoutes = require('../routes/image-router');

const app = express();

//-------------------------------------------------------------------------------------------------
// ROUTES
//-------------------------------------------------------------------------------------------------

// middleware
app.use(loggerMiddleware);
app.use(authAccountRoutes);
app.use(armRoutes);
// app.use(imageRoutes);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - catch-all/default route (route was not found)');
  return response.sendStatus(404);
});

// more middleware
app.use(errorMiddleware);

const server = module.exports = {};
let internalServer = null;

server.start = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      return internalServer = app.listen(process.env.PORT, () => { // eslint-disable-line
        logger.log(logger.INFO, `Server is on at PORT: ${process.env.PORT}`);
      });
    });
};

server.stop = () => {
  return mongoose.disconnect()
    .then(() => {
      return internalServer.close(() => {
        logger.log(logger.INFO, 'The server is OFF.');
      });
    });
};
