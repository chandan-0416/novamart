const db = require('../config/db');
const ROLES = require('../constants/roles');
const ORDER_STATUS = require('../constants/orderStatus');
const {
  NotFoundError,
  BadRequestError,
  ForbiddenError
} = require('../errors/AppError');

/**
 * Create order from user's active cart with atomic database transaction
 */
const createOrder = async (userId, { shippingAddress }) => {
  return await db.withTransaction(async (client) => {
    // 1. Fetch all items in user's cart
    const cartRes = await client.query(
      `SELECT c.product_id, c.quantity
       FROM cart_items c
       WHERE c.user_id = $1`,
      [userId]
    );

    if (cartRes.rowCount === 0) {
      throw new BadRequestError('Cannot place order: Cart is empty');
    }

    const cartItems = cartRes.rows;
    const productIds = cartItems.map((item) => item.product_id);

    // 2. Fetch products with row locks (FOR UPDATE) to prevent race condition overselling
    const placeholders = productIds.map((_, i) => `$${i + 1}`).join(',');
    const productsRes = await client.query(
      `SELECT id, name, price, stock_quantity, is_active
       FROM products
       WHERE id IN (${placeholders})
       FOR UPDATE`,
      productIds
    );

    const productMap = new Map();
    productsRes.rows.forEach((p) => productMap.set(p.id, p));

    // 3. Validate stock and compute totals
    let totalAmount = 0;
    const orderItemsToInsert = [];

    for (const item of cartItems) {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new NotFoundError(`Product ID ${item.product_id} no longer exists`);
      }

      if (!product.is_active) {
        throw new BadRequestError(`Product "${product.name}" is currently unavailable`);
      }

      if (product.stock_quantity < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}, requested: ${item.quantity}`
        );
      }

      const unitPrice = parseFloat(product.price);
      const subtotal = parseFloat((unitPrice * item.quantity).toFixed(2));
      totalAmount += subtotal;

      orderItemsToInsert.push({
        productId: product.id,
        productName: product.name,
        unitPrice,
        quantity: item.quantity,
        subtotal
      });
    }

    totalAmount = parseFloat(totalAmount.toFixed(2));

    // 4. Create the Order
    const orderInsertRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, total_amount, status, shipping_address, payment_status, created_at`,
      [userId, totalAmount, ORDER_STATUS.PENDING, shippingAddress, 'paid']
    );

    const order = orderInsertRes.rows[0];

    // 5. Insert Order Items and decrement product stock
    for (const item of orderItemsToInsert) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.productId, item.productName, item.unitPrice, item.quantity, item.subtotal]
      );

      await client.query(
        `UPDATE products
         SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [item.quantity, item.productId]
      );
    }

    // 6. Clear user cart
    await client.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

    return {
      ...order,
      items: orderItemsToInsert
    };
  });
};

/**
 * Get order details by ID
 */
const getOrderById = async (orderId, requestingUser) => {
  // Fetch order
  const orderRes = await db.query(
    `SELECT 
       o.id,
       o.user_id,
       u.name AS user_name,
       u.email AS user_email,
       o.total_amount,
       o.status,
       o.shipping_address,
       o.payment_status,
       o.created_at,
       o.updated_at
     FROM orders o
     JOIN users u ON o.user_id = u.id
     WHERE o.id = $1`,
    [orderId]
  );

  if (orderRes.rowCount === 0) {
    throw new NotFoundError(`Order with ID ${orderId} not found`);
  }

  const order = orderRes.rows[0];

  // Role check: customer can only view their own order
  if (requestingUser.role !== ROLES.ADMIN && order.user_id !== requestingUser.id) {
    throw new ForbiddenError('You do not have permission to view this order');
  }

  // Fetch order items with product images if available
  const itemsRes = await db.query(
    `SELECT 
       oi.id,
       oi.product_id,
       oi.product_name,
       oi.unit_price,
       oi.quantity,
       oi.subtotal,
       p.image_url
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1
     ORDER BY oi.id ASC`,
    [orderId]
  );

  return {
    ...order,
    items: itemsRes.rows
  };
};

/**
 * List orders with pagination and status filter
 */
const listOrders = async (requestingUser, { page = 1, limit = 10, status }) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  // Non-admins can only see their own orders
  if (requestingUser.role !== ROLES.ADMIN) {
    conditions.push(`o.user_id = $${paramIndex}`);
    params.push(requestingUser.id);
    paramIndex++;
  }

  if (status) {
    conditions.push(`o.status = $${paramIndex}`);
    params.push(status);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total orders
  const countSql = `SELECT COUNT(*) AS total FROM orders o ${whereClause}`;
  const countRes = await db.query(countSql, params);
  const totalItems = parseInt(countRes.rows[0].total, 10);
  const totalPages = Math.ceil(totalItems / limit);

  // Fetch orders
  const queryParams = [...params, limit, offset];
  const dataSql = `
    SELECT 
      o.id,
      o.user_id,
      u.name AS user_name,
      u.email AS user_email,
      o.total_amount,
      o.status,
      o.shipping_address,
      o.payment_status,
      o.created_at,
      o.updated_at,
      (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) AS total_items_count
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ${whereClause}
    ORDER BY o.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const ordersRes = await db.query(dataSql, queryParams);

  return {
    orders: ordersRes.rows,
    pagination: {
      totalItems,
      totalPages,
      currentPage: parseInt(page, 10),
      limit: parseInt(limit, 10),
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Update order status (Admin)
 */
const updateOrderStatus = async (orderId, newStatus) => {
  if (!Object.values(ORDER_STATUS).includes(newStatus)) {
    throw new BadRequestError(`Invalid order status: ${newStatus}`);
  }

  const result = await db.query(
    `UPDATE orders
     SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [newStatus, orderId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError(`Order with ID ${orderId} not found`);
  }

  return result.rows[0];
};

module.exports = {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus
};
