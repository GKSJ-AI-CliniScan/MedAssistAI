import api from './api';

const USE_MOCK = true;

export const userService = {
  getProfile: async () => {
    if (!USE_MOCK) {
      return api.get('/user/profile');
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return JSON.parse(localStorage.getItem('medassist_profile'));
  },

  updateProfile: async (profileData) => {
    if (!USE_MOCK) {
      return api.put('/user/profile', profileData);
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
    return profileData;
  },

  getHistory: async () => {
    if (!USE_MOCK) {
      return api.get('/user/history');
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
    return JSON.parse(localStorage.getItem('medassist_history'));
  },

  addHistory: async (historyItem) => {
    if (!USE_MOCK) {
      return api.post('/user/history', historyItem);
    }
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ...historyItem, id: `h_${Date.now()}` };
  },

  deleteHistory: async (id) => {
    if (!USE_MOCK) {
      return api.delete(`/user/history/${id}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true };
  }
};

export default userService;
