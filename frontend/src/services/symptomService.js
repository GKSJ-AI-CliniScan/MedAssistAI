import api from './api';
import symptomsData from '../data/symptoms.json';

const USE_MOCK = true;

export const symptomService = {
  getSymptoms: async () => {
    try {
      const response = await api.get('/symptoms');
      return response.data;
    } catch (err) {
      console.warn('Backend symptoms endpoint unavailable, using local fallback dataset');
      return symptomsData;
    }
  },

  searchSymptoms: async (query) => {
    try {
      const response = await api.get(`/symptoms${query ? `?q=${encodeURIComponent(query)}` : ''}`);
      return response.data;
    } catch (err) {
      console.warn('Backend symptom search unavailable, using local search fallback');
      if (!query) return symptomsData;
      const lowerQuery = query.toLowerCase();
      return symptomsData.filter(s =>
        s.name.toLowerCase().includes(lowerQuery) ||
        (s.synonyms && s.synonyms.some(syn => syn.toLowerCase().includes(lowerQuery))) ||
        (s.bodyPart && s.bodyPart.toLowerCase().includes(lowerQuery)) ||
        (s.body_part && s.body_part.toLowerCase().includes(lowerQuery))
      );
    }
  }
};

export default symptomService;
