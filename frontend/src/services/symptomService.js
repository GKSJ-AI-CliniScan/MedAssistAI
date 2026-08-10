import api from './api';

export const symptomService = {
  getSymptoms: async () => {
    const response = await api.get('/symptoms');
    return response.data;
  },

  searchSymptoms: async (query) => {
    const response = await api.get(`/symptoms${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    return response.data;
  }
};

export default symptomService;

