const { body, param, query } = require('express-validator');

const createProductValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 255 }).withMessage('Product name must not exceed 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be a positive number greater than 0'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('category_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Category ID must be a valid integer'),
  body('image_url')
    .optional({ nullable: true })
    .trim()
    .isURL().withMessage('Image URL must be a valid URL')
];

const updateProductValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Product ID must be a valid positive integer'),
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty')
    .isLength({ max: 255 }).withMessage('Product name must not exceed 255 characters'),
  body('description')
    .optional()
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Price must be a positive number greater than 0'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('category_id')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage('Category ID must be a valid integer'),
  body('image_url')
    .optional({ nullable: true })
    .trim()
    .isURL().withMessage('Image URL must be a valid URL'),
  body('is_active')
    .optional()
    .isBoolean().withMessage('is_active must be a boolean')
];

const getProductByIdValidator = [
  param('id')
    .isInt({ min: 1 }).withMessage('Product ID must be a valid positive integer')
];

const listProductsQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be an integer >= 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim(),
  query('category')
    .optional()
    .trim(),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('minPrice must be >= 0'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('maxPrice must be >= 0'),
  query('sortBy')
    .optional()
    .isIn(['price', 'name', 'created_at', 'stock_quantity']).withMessage('sortBy must be one of: price, name, created_at, stock_quantity'),
  query('sortOrder')
    .optional()
    .toUpperCase()
    .isIn(['ASC', 'DESC']).withMessage('sortOrder must be ASC or DESC')
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  getProductByIdValidator,
  listProductsQueryValidator
};
