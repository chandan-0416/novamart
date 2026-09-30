import axiosClient from './axiosClient';

export const authApi = {
  register: async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    return res.data;
  },
  login: async (credentials) => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },
  logout: async (refreshToken) => {
    const res = await axiosClient.post('/auth/logout', { refreshToken });
    return res.data;
  },
  getMe: async () => {
    const res = await axiosClient.get('/auth/me');
    return res.data;
  },
};
