const { body } = require('express-validator');
const ROLES = require('../constants/roles');

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn([ROLES.ADMIN, ROLES.CUSTOMER]).withMessage(`Role must be either '${ROLES.ADMIN}' or '${ROLES.CUSTOMER}'`)
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];

module.exports = {
  registerValidator,
  loginValidator,
  refreshTokenValidator
};
