const { body, param } = require('express-validator');

const addToCartValidator = [
  body('productId')
    .notEmpty().withMessage('productId is required')
    .isInt({ min: 1 }).withMessage('productId must be a valid positive integer'),
  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('quantity must be a positive integer >= 1')
];

const updateCartItemValidator = [
  param('productId')
    .isInt({ min: 1 }).withMessage('productId must be a valid positive integer'),
  body('quantity')
    .notEmpty().withMessage('quantity is required')
    .isInt({ min: 0 }).withMessage('quantity must be an integer >= 0')
];

const removeCartItemValidator = [
  param('productId')
    .isInt({ min: 1 }).withMessage('productId must be a valid positive integer')
];

module.exports = {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator
};
