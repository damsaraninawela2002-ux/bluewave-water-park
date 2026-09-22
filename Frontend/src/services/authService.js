import API from './api';

export const authService = {
  async register(name, email, password) {
    const res = await API.post('/auth/register', { name, email, password });
    return res.data;
  },

  async login(email, password) {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },

  async getMe() {
    const res = await API.get('/auth/me');
    return res.data;
  },
};
