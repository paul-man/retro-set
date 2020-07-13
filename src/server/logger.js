const winston = require('winston'),
  Sentry = require('winston-sentry-log');
 
const options = {
  config: {
    dsn: process.env.SENTRY_DSN
  }
};
 
const logger = new winston.createLogger({
  transports: [new Sentry(options)]
});

module.exports = logger;
