const cartService = require('../services/cart.service');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json({
      status: 'success',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const cart = await cartService.addToCart(req.user.id, parseInt(productId, 10), parseInt(quantity, 10));
    res.status(200).json({
      status: 'success',
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(req.user.id, parseInt(productId, 10), parseInt(quantity, 10));
    res.status(200).json({
      status: 'success',
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeFromCart(req.user.id, parseInt(productId, 10));
    res.status(200).json({
      status: 'success',
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const result = await cartService.clearCart(req.user.id);
    res.status(200).json({
      status: 'success',
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
