'use strict';

// development note: needed to include this twice...

const express = require('express');
const cors = require('cors');
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

// GLOBAL MIDDLEWARE
// app.use(cors({ origin: process.env.CORS_ORIGINS }));

// app.use((req, res, next) => {
//   console.log(req);
//   res.header('Access-Control-Allow-Origin', '*');
//   // res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGINS);
//   // res.header('x-Trigger', 'CORS');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   // res.header('Access-Control-Allow-Credentials', 'true');
//   // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//   next();
// });

app.use(cors({
  credential: true,
}));

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
