import API from './api';

export const bookingService = {
  async createBooking(ticketType, visitDate, quantity) {
    // Support object or discrete arguments, prioritizing target schema field ticketType
    const payload = typeof ticketType === 'object' && ticketType !== null
      ? ticketType
      : {
          ticketType,
          visitDate,
          quantity: Number(quantity),
        };
    const res = await API.post('/bookings', payload);
    return res.data;
  },

  async getMyBookings() {
    const res = await API.get('/bookings/my');
    return res.data;
  },

  async getAllBookings() {
    const res = await API.get('/bookings');
    return res.data;
  },

  async updateBookingStatus(id, bookingStatus) {
    const res = await API.patch(`/bookings/${id}/status`, {
      bookingStatus,
      status: bookingStatus,
    });
    return res.data;
  },

  async cancelBooking(id) {
    const res = await API.patch(`/bookings/${id}/cancel`);
    return res.data;
  },

  async getAdminStats() {
    const res = await API.get('/admin/stats');
    return res.data;
  },

  async getPublicStats() {
    const res = await API.get('/public/stats');
    return res.data;
  },
};
