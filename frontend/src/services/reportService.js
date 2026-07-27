import api from './api';

const USE_MOCK = true;

export const reportService = {
  generateReport: async (sessionData, profile) => {
    if (!USE_MOCK) {
      return api.post('/reports/generate', { sessionData, profile });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const reportId = `rep_${Date.now()}`;
    const reportDate = new Date().toISOString().split('T')[0];

    const report = {
      id: reportId,
      date: reportDate,
      patientName: profile?.name || 'John Doe',
      patientDetails: {
        age: profile?.age || 32,
        gender: profile?.gender || 'Male',
        bloodType: profile?.bloodType || 'O+'
      },
      symptoms: sessionData.selectedSymptoms || [],
      severity: sessionData.severity || 'mild',
      duration: `${sessionData.duration} days`,
      predictions: sessionData.predictionResult || [],
      riskAssessment: sessionData.riskResult || { riskLevel: 'Low', riskScore: 20, healthScore: 86 },
      recommendations: sessionData.recommendations || {}
    };

    // Save to report history in localstorage
    const history = JSON.parse(localStorage.getItem('medassist_reports') || '[]');
    history.unshift(report);
    localStorage.setItem('medassist_reports', JSON.stringify(history));

    return report;
  },

  getReports: async () => {
    if (!USE_MOCK) {
      return api.get('/reports');
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    return JSON.parse(localStorage.getItem('medassist_reports') || '[]');
  },

  getReportById: async (id) => {
    if (!USE_MOCK) {
      return api.get(`/reports/${id}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    const history = JSON.parse(localStorage.getItem('medassist_reports') || '[]');
    return history.find(r => r.id === id) || null;
  },

  deleteReport: async (id) => {
    if (!USE_MOCK) {
      return api.delete(`/reports/${id}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    const history = JSON.parse(localStorage.getItem('medassist_reports') || '[]');
    const updated = history.filter(r => r.id !== id);
    localStorage.setItem('medassist_reports', JSON.stringify(updated));
    return { success: true };
  }
};

export default reportService;
