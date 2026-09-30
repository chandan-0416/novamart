const morgan = require('morgan');
const logger = require('../config/logger');

const stream = {
  write: (message) => logger.http ? logger.http(message.trim()) : logger.info(message.trim())
};

const morganMiddleware = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
  { stream, skip: () => process.env.NODE_ENV === 'test' }
);

module.exports = morganMiddleware;
