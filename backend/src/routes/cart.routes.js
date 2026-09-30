const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator
} = require('../validators/cart.validator');

// All cart routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's shopping cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 */
router.get('/', cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add product to cart or increment quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added/updated in cart
 */
router.post('/', validate(addToCartValidator), cartController.addToCart);

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update quantity of an item in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put('/:productId', validate(updateCartItemValidator), cartController.updateCartItem);

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/:productId', validate(removeCartItemValidator), cartController.removeCartItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart emptied
 */
router.delete('/', cartController.clearCart);

module.exports = router;
