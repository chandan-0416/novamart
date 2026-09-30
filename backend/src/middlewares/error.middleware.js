const logger = require('../config/logger');
const { AppError } = require('../errors/AppError');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize standard errors or Postgres specific errors to AppError
  if (!(error instanceof AppError)) {
    // Check PostgreSQL unique violation error code
    if (error.code === '23505') {
      const field = error.detail ? error.detail.match(/\((.*?)\)/)?.[1] || 'field' : 'field';
      error = new AppError(`A record with this ${field} already exists`, 409);
    } else if (error.code === '23503') {
      error = new AppError(`Referenced record does not exist`, 400);
    } else if (error.code === '22P02') {
      error = new AppError(`Invalid data input syntax`, 400);
    } else {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new AppError(message, statusCode);
    }
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';

  // Log error details
  if (statusCode >= 500) {
    logger.error('CRITICAL SERVER ERROR: %s\nStack: %s', err.message, err.stack);
  } else {
    logger.warn('Client Error [%d]: %s', statusCode, error.message);
  }

  res.status(statusCode).json({
    status,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404);
  next(err);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
