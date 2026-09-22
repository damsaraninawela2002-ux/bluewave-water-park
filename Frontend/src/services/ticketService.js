import API from './api';

export const ticketService = {
  async getAll() {
    const res = await API.get('/tickets');
    return res.data;
  },

  async getById(id) {
    const res = await API.get(`/tickets/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await API.post('/tickets', data);
    return res.data;
  },

  async update(id, data) {
    const res = await API.put(`/tickets/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await API.delete(`/tickets/${id}`);
    return res.data;
  },
};
