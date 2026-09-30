const productService = require('../services/product.service');

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, search, category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    const result = await productService.listProducts({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder
    });

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(parseInt(id, 10));

    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.updateProduct(parseInt(id, 10), req.body);

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(parseInt(id, 10));

    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
