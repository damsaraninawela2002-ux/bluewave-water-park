import API from './api';

export const attractionService = {
  /**
   * Backward-compatible unpaginated fetch (for public pages: Home, Attractions catalog)
   */
  async getAll(category) {
    const params = category && category !== 'All' ? { category } : {};
    const res = await API.get('/attractions', { params });
    return res.data;
  },

  /**
   * Paginated, filtered, searchable fetch for administrative management
   */
  async list({
    page = 1,
    limit = 12,
    search = '',
    category = 'All',
    status = 'all',
    sort = '-createdAt',
    includeInactive = true,
  } = {}) {
    const params = {
      page,
      limit,
      includeInactive,
    };
    if (search && search.trim()) params.search = search.trim();
    if (category && category !== 'All') params.category = category;
    if (status && status !== 'all') params.status = status;
    if (sort) params.sort = sort;

    const res = await API.get('/attractions', { params });
    return res.data;
  },

  async getById(id) {
    const res = await API.get(`/attractions/${id}`);
    return res.data;
  },

  async create(data) {
    const res = await API.post('/attractions', data);
    return res.data;
  },

  async update(id, data) {
    const res = await API.put(`/attractions/${id}`, data);
    return res.data;
  },

  async patch(id, data) {
    const res = await API.patch(`/attractions/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await API.delete(`/attractions/${id}`);
    return res.data;
  },
};

export default attractionService;
