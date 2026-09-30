const orderService = require('../services/order.service');

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const order = await orderService.createOrder(req.user.id, { shippingAddress });

    res.status(201).json({
      status: 'success',
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await orderService.listOrders(req.user, {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      status
    });

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(parseInt(id, 10), req.user);

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(parseInt(id, 10), status);

    res.status(200).json({
      status: 'success',
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  updateStatus
};
