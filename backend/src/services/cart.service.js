const db = require('../config/db');
const { NotFoundError, BadRequestError } = require('../errors/AppError');

/**
 * Get user's cart with aggregated total
 */
const getCart = async (userId) => {
  const sql = `
    SELECT 
      c.id AS cart_item_id,
      c.quantity,
      c.created_at,
      p.id AS product_id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.image_url,
      p.is_active,
      ROUND((c.quantity * p.price)::numeric, 2) AS subtotal
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1
    ORDER BY c.created_at ASC
  `;

  const result = await db.query(sql, [userId]);
  const items = result.rows;

  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    totalItems,
    totalAmount: parseFloat(totalAmount.toFixed(2))
  };
};

/**
 * Add product to cart or increment quantity
 */
const addToCart = async (userId, productId, quantity = 1) => {
  // Check product existence and stock
  const productResult = await db.query(
    'SELECT id, name, price, stock_quantity, is_active FROM products WHERE id = $1',
    [productId]
  );

  if (productResult.rowCount === 0) {
    throw new NotFoundError(`Product with ID ${productId} not found`);
  }

  const product = productResult.rows[0];

  if (!product.is_active) {
    throw new BadRequestError(`Product "${product.name}" is no longer available`);
  }

  // Check current quantity in cart
  const cartCheck = await db.query(
    'SELECT quantity FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  const currentQty = cartCheck.rowCount > 0 ? cartCheck.rows[0].quantity : 0;
  const newQty = currentQty + quantity;

  if (newQty > product.stock_quantity) {
    throw new BadRequestError(
      `Cannot add ${quantity} item(s). Only ${product.stock_quantity} in stock (you already have ${currentQty} in cart).`
    );
  }

  // Upsert into cart_items
  const upsertSql = `
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET 
      quantity = cart_items.quantity + EXCLUDED.quantity,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id, user_id, product_id, quantity
  `;

  await db.query(upsertSql, [userId, productId, quantity]);

  return getCart(userId);
};

/**
 * Update quantity of a specific cart item
 */
const updateCartItemQuantity = async (userId, productId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(userId, productId);
  }

  // Check product stock
  const productResult = await db.query(
    'SELECT stock_quantity FROM products WHERE id = $1',
    [productId]
  );

  if (productResult.rowCount === 0) {
    throw new NotFoundError(`Product with ID ${productId} not found`);
  }

  const stock = productResult.rows[0].stock_quantity;
  if (quantity > stock) {
    throw new BadRequestError(`Requested quantity (${quantity}) exceeds available stock (${stock})`);
  }

  const result = await db.query(
    `UPDATE cart_items
     SET quantity = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2 AND product_id = $3
     RETURNING id`,
    [quantity, userId, productId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Item not found in cart');
  }

  return getCart(userId);
};

/**
 * Remove an item from cart
 */
const removeFromCart = async (userId, productId) => {
  const result = await db.query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING id',
    [userId, productId]
  );

  if (result.rowCount === 0) {
    throw new NotFoundError('Item not found in cart');
  }

  return getCart(userId);
};

/**
 * Clear user cart
 */
const clearCart = async (userId) => {
  await db.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
  return { message: 'Cart cleared successfully' };
};

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};
