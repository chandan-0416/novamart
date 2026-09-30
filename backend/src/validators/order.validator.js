const { body, param, query } = require('express-validator');
const ORDER_STATUS = require('../constants/orderStatus');

const createOrderValidator = [
  body('shippingAddress')
    .trim()
    .notEmpty().withMessage('shippingAddress is required')
    .isLength({ min: 5, max: 500 }).withMessage('shippingAddress must be between 5 and 500 characters')
];

const getOrderByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Order ID must be a valid positive integer')
];

const listOrdersQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(Object.values(ORDER_STATUS)).withMessage(`Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`)
];

module.exports = {
  createOrderValidator,
  getOrderByIdValidator,
  listOrdersQueryValidator
};
