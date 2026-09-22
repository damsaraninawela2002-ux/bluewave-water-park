import API from './api';

export const reviewService = {
  /**
   * Fetch all or latest reviews with optional limit
   */
  async getReviews(limit = null) {
    const params = limit ? { limit } : {};
    const res = await API.get('/reviews', { params });
    return res.data;
  },

  /**
   * Get aggregate rating summary, star breakdown and total reviews
   */
  async getReviewSummary() {
    const res = await API.get('/reviews/summary');
    return res.data;
  },

  /**
   * Submit a verified customer review
   */
  async createReview(reviewData) {
    const res = await API.post('/reviews', reviewData);
    return res.data;
  },

  /**
   * Delete a review (Admin or Review author)
   */
  async deleteReview(id) {
    const res = await API.delete(`/reviews/${id}`);
    return res.data;
  },
};

export default reviewService;
