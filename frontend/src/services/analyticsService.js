import api from './api';

export const analyticsService = {
  getAnalyticsData: async () => {
    const { data } = await api.get('/dashboard/analytics');
    return data;
  }
};

export default analyticsService;

