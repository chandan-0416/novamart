import axiosClient from './axiosClient';

export const cartApi = {
  getCart: async () => {
    const res = await axiosClient.get('/cart');
    return res.data;
  },
  addToCart: async (productId, quantity = 1) => {
    const res = await axiosClient.post('/cart', { productId, quantity });
    return res.data;
  },
  updateCartItem: async (productId, quantity) => {
    const res = await axiosClient.put(`/cart/${productId}`, { quantity });
    return res.data;
  },
  removeCartItem: async (productId) => {
    const res = await axiosClient.delete(`/cart/${productId}`);
    return res.data;
  },
  clearCart: async () => {
    const res = await axiosClient.delete('/cart');
    return res.data;
  },
};
