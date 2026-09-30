const db = require('../config/db');
const { NotFoundError, BadRequestError } = require('../errors/AppError');

/**
 * List products with advanced filtering, sorting, and pagination
 */
const listProducts = async ({
  page = 1,
  limit = 10,
  search,
  category,
  minPrice,
  maxPrice,
  sortBy = 'created_at',
  sortOrder = 'DESC',
  includeInactive = false
}) => {
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];
  let paramIndex = 1;

  if (!includeInactive) {
    conditions.push(`p.is_active = TRUE`);
  }

  if (search) {
    conditions.push(`(p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (category) {
    if (!isNaN(category)) {
      conditions.push(`p.category_id = $${paramIndex}`);
      params.push(parseInt(category, 10));
      paramIndex++;
    } else {
      conditions.push(`c.name ILIKE $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }
  }

  if (minPrice !== undefined && minPrice !== '') {
    conditions.push(`p.price >= $${paramIndex}`);
    params.push(parseFloat(minPrice));
    paramIndex++;
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    conditions.push(`p.price <= $${paramIndex}`);
    params.push(parseFloat(maxPrice));
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Safe sorting columns whitelist
  const allowedSortCols = {
    price: 'p.price',
    name: 'p.name',
    created_at: 'p.created_at',
    stock_quantity: 'p.stock_quantity'
  };
  const sortColumn = allowedSortCols[sortBy] || 'p.created_at';
  const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Count total matching items
  const countSql = `
    SELECT COUNT(*) AS total
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
  `;
  const countResult = await db.query(countSql, params);
  const totalItems = parseInt(countResult.rows[0].total, 10);
  const totalPages = Math.ceil(totalItems / limit);

  // Fetch paginated records
  const queryParams = [...params, limit, offset];
  const dataSql = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.image_url,
      p.is_active,
      p.created_at,
      p.updated_at,
      c.id AS category_id,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereClause}
    ORDER BY ${sortColumn} ${orderDirection}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  const result = await db.query(dataSql, queryParams);

  return {
    products: result.rows,
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
 * Get single product by ID
 */
const getProductById = async (id) => {
  const sql = `
    SELECT 
      p.id,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.image_url,
      p.is_active,
      p.created_at,
      p.updated_at,
      c.id AS category_id,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `;

  const result = await db.query(sql, [id]);
  if (result.rowCount === 0) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  return result.rows[0];
};

/**
 * Create a new product (Admin)
 */
const createProduct = async ({
  name,
  description = null,
  price,
  stock_quantity = 0,
  category_id = null,
  image_url = null
}) => {
  if (category_id) {
    const catCheck = await db.query('SELECT id FROM categories WHERE id = $1', [category_id]);
    if (catCheck.rowCount === 0) {
      throw new BadRequestError(`Category with ID ${category_id} does not exist`);
    }
  }

  const sql = `
    INSERT INTO products (name, description, price, stock_quantity, category_id, image_url, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, true)
    RETURNING *
  `;

  const result = await db.query(sql, [
    name,
    description,
    price,
    stock_quantity,
    category_id,
    image_url
  ]);

  return getProductById(result.rows[0].id);
};

/**
 * Update an existing product (Admin)
 */
const updateProduct = async (id, updateFields) => {
  // Ensure product exists
  await getProductById(id);

  if (updateFields.category_id) {
    const catCheck = await db.query('SELECT id FROM categories WHERE id = $1', [updateFields.category_id]);
    if (catCheck.rowCount === 0) {
      throw new BadRequestError(`Category with ID ${updateFields.category_id} does not exist`);
    }
  }

  const allowedFields = ['name', 'description', 'price', 'stock_quantity', 'category_id', 'image_url', 'is_active'];
  const setClauses = [];
  const params = [];
  let paramIndex = 1;

  for (const field of allowedFields) {
    if (updateFields[field] !== undefined) {
      setClauses.push(`${field} = $${paramIndex}`);
      params.push(updateFields[field]);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) {
    throw new BadRequestError('No valid fields provided for update');
  }

  setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
  params.push(id);

  const sql = `
    UPDATE products
    SET ${setClauses.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id
  `;

  await db.query(sql, params);
  return getProductById(id);
};

/**
 * Delete product by ID (Admin)
 */
const deleteProduct = async (id) => {
  // Check if product exists in any existing orders
  const orderItemCheck = await db.query(
    'SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1',
    [id]
  );

  if (orderItemCheck.rowCount > 0) {
    // Soft delete to maintain order integrity
    const result = await db.query(
      'UPDATE products SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    if (result.rowCount === 0) throw new NotFoundError(`Product with ID ${id} not found`);
    return { message: 'Product is linked to previous orders; marked as inactive (soft deleted)' };
  }

  // Hard delete if not ordered yet
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  if (result.rowCount === 0) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  return { message: 'Product deleted successfully' };
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
