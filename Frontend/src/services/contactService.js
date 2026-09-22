import API from './api';

export const contactService = {
  /**
   * Public: Submit a contact message inquiry
   */
  async submitContact(data) {
    const res = await API.post('/contact', data);
    return res.data;
  },

  /**
   * Admin: Fetch all customer contact messages
   */
  async getAllMessages() {
    const res = await API.get('/contact');
    return res.data;
  },

  /**
   * Admin: Get unread messages count for sidebar badge
   */
  async getUnreadCount() {
    const res = await API.get('/contact/unread-count');
    return res.data;
  },

  /**
   * Admin: Mark a message as read
   */
  async markAsRead(id) {
    const res = await API.patch(`/contact/${id}/read`);
    return res.data;
  },

  /**
   * Admin: Delete a contact message
   */
  async deleteMessage(id) {
    const res = await API.delete(`/contact/${id}`);
    return res.data;
  },
};

export default contactService;
