import axiosClient from './axiosClient';

export const productApi = {
  getProducts: async (params = {}) => {
    const res = await axiosClient.get('/products', { params });
    return res.data;
  },
  getProductById: async (id) => {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
  },
  createProduct: async (productData) => {
    const res = await axiosClient.post('/products', productData);
    return res.data;
  },
  updateProduct: async (id, productData) => {
    const res = await axiosClient.put(`/products/${id}`, productData);
    return res.data;
  },
  deleteProduct: async (id) => {
    const res = await axiosClient.delete(`/products/${id}`);
    return res.data;
  },
};
