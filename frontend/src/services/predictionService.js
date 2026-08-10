import api from './api';

export const predictionService = {
  predictDisease: async (symptomsList, generalSeverity, durationDays, additionalNotes) => {
    // Extract symptom names if symptomsList is array of objects
    const symptomNames = symptomsList.map(s => (typeof s === 'string' ? s : s.name || s.id));
    
    const { data } = await api.post('/predictions/analyze', {
      symptoms: symptomNames,
      severity: generalSeverity,
      duration: durationDays,
      notes: additionalNotes || ''
    });

    return data;
  },

  getPredictionHistory: async () => {
    const { data } = await api.get('/predictions/history');
    return data;
  },

  getPredictionDetail: async (id) => {
    const { data } = await api.get(`/predictions/${id}`);
    return data;
  }
};

export default predictionService;

