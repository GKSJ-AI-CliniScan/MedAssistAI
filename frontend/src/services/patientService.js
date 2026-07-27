/**
 * Patient Service – Profile and Medical History
 */
import api from "./api";

export const patientService = {
  async getProfile() {
    const { data } = await api.get("/patients/me");
    return data;
  },

  async updateProfile(profileData) {
    const { data } = await api.put("/patients/me", profileData);
    return data;
  },

  async getMedicalHistory() {
    const { data } = await api.get("/patients/me/medical-history");
    return data;
  },

  async addMedicalHistory(entry) {
    const { data } = await api.post("/patients/me/medical-history", entry);
    return data;
  },

  async deleteMedicalHistory(historyId) {
    await api.delete(`/patients/me/medical-history/${historyId}`);
  },
};
