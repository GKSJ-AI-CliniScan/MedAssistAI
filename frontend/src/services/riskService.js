import api from './api';

export const riskService = {
  calculateRisk: async (selectedSymptoms, severity, duration, profile) => {
    const symptomNames = (selectedSymptoms || []).map(s => (typeof s === 'string' ? s : s.name || s.id));
    const { data } = await api.post('/predictions/analyze', {
      symptoms: symptomNames,
      severity,
      duration,
      notes: ''
    });

    return data?.risk || null;
  }
};

export default riskService;

