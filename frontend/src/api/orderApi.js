import axiosClient from './axiosClient';

export const orderApi = {
  createOrder: async (orderData) => {
    const res = await axiosClient.post('/orders', orderData);
    return res.data;
  },
  getOrders: async (params = {}) => {
    const res = await axiosClient.get('/orders', { params });
    return res.data;
  },
  getOrderById: async (id) => {
    const res = await axiosClient.get(`/orders/${id}`);
    return res.data;
  },
  updateOrderStatus: async (id, status) => {
    const res = await axiosClient.patch(`/orders/${id}/status`, { status });
    return res.data;
  },
};
