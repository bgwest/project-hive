const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', //! development note: 'info' here means this logger will listen to error, warn, and info errors
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: `${new Date().toDateString().replace(/ /g, '-')}.log`, level: 'verbose' }),
    new winston.transports.Console({ format: winston.format.simple(), level: 'info' }),
  ],
});

logger.INFO = 'info';
logger.ERROR = 'error';
logger.VERBOSE = 'verbose';

module.exports = logger;
