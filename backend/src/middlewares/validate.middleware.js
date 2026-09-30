const { validationResult } = require('express-validator');
const { ValidationError } = require('../errors/AppError');

const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return next(new ValidationError('Validation failed for request data', formattedErrors));
  };
};

module.exports = validate;
