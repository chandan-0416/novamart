const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const validate = require('../middlewares/validate.middleware');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');
const {
  createOrderValidator,
  getOrderByIdValidator,
  listOrdersQueryValidator
} = require('../validators/order.validator');

// All order routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order checkout and management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place an order from active cart items (atomic transaction)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [shippingAddress]
 *             properties:
 *               shippingAddress:
 *                 type: string
 *                 example: 123 Tech Park Ave, Suite 400, New York, NY 10001
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty or insufficient stock
 */
router.post('/', validate(createOrderValidator), orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders (Customer sees own, Admin sees all)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Paginated order list
 */
router.get('/', validate(listOrdersQueryValidator), orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       403:
 *         description: Forbidden (Not order owner or admin)
 *       404:
 *         description: Order not found
 */
router.get('/:id', validate(getOrderByIdValidator), orderController.getOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *                 example: processing
 *     responses:
 *       200:
 *         description: Order status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/:id/status',
  authorize(ROLES.ADMIN),
  validate(getOrderByIdValidator),
  orderController.updateStatus
);

module.exports = router;
