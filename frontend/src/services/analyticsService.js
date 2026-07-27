import api from './api';

const USE_MOCK = true;

export const analyticsService = {
  getAnalyticsData: async () => {
    if (!USE_MOCK) {
      return api.get('/analytics/summary');
    }

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Curated mock datasets matching Recharts expected structure
    const diseaseStatistics = [
      { name: 'Influenza', value: 45, percentage: 30, color: '#6366f1' },
      { name: 'Gastroenteritis', value: 35, percentage: 23, color: '#10b981' },
      { name: 'COVID-19', value: 30, percentage: 20, color: '#06b6d4' },
      { name: 'Dehydration', value: 25, percentage: 17, color: '#f59e0b' },
      { name: 'Hypertensive Crisis', value: 15, percentage: 10, color: '#f43f5e' }
    ];

    const symptomTrendAnalysis = [
      { month: 'Jan', Headache: 40, Cough: 65, Fatigue: 45, Nausea: 15 },
      { month: 'Feb', Headache: 48, Cough: 75, Fatigue: 52, Nausea: 18 },
      { month: 'Mar', Headache: 55, Cough: 60, Fatigue: 40, Nausea: 25 },
      { month: 'Apr', Headache: 38, Cough: 45, Fatigue: 35, Nausea: 30 },
      { month: 'May', Headache: 42, Cough: 50, Fatigue: 48, Nausea: 22 },
      { month: 'Jun', Headache: 50, Cough: 55, Fatigue: 60, Nausea: 28 },
      { month: 'Jul', Headache: 58, Cough: 68, Fatigue: 70, Nausea: 35 }
    ];

    const riskDistribution = [
      { name: 'Low Risk', value: 120, color: '#10b981' },
      { name: 'Medium Risk', value: 85, color: '#f59e0b' },
      { name: 'High Risk', value: 32, color: '#f43f5e' }
    ];

    const systemActivity = [
      { week: 'Wk 1', assessments: 40, healthAvg: 82 },
      { week: 'Wk 2', assessments: 55, healthAvg: 85 },
      { week: 'Wk 3', assessments: 48, healthAvg: 80 },
      { week: 'Wk 4', assessments: 70, healthAvg: 84 },
      { week: 'Wk 5', assessments: 85, healthAvg: 88 },
      { week: 'Wk 6', assessments: 110, healthAvg: 89 }
    ];

    return {
      diseaseStatistics,
      symptomTrendAnalysis,
      riskDistribution,
      systemActivity,
      summary: {
        totalAssessments: 348,
        averageHealthScore: 84,
        criticalAlertsResolved: 29,
        activePatients: 194
      }
    };
  }
};

export default analyticsService;
