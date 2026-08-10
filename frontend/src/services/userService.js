import api from './api';

export const userService = {
  getProfile: async () => {
    const { data } = await api.get('/patients/me');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/patients/me', profileData);
    return data;
  },

  getHistory: async () => {
    const { data } = await api.get('/patients/me/medical-history');
    return data;
  },

  addHistory: async (historyItem) => {
    const { data } = await api.post('/patients/me/medical-history', historyItem);
    return data;
  },

  deleteHistory: async (id) => {
    const { data } = await api.delete(`/patients/me/medical-history/${id}`);
    return data;
  }
};

export default userService;

