import API from './api';

export const adminService = {
  async getDashboardData() {
    const res = await API.get('/admin/dashboard');
    return res.data;
  },

  async getAdminStats() {
    const res = await API.get('/admin/stats');
    return res.data;
  },
};

export default adminService;
