/**
 * Symptom & Prediction Services
 */
import api from "./api";

// ── Symptoms ─────────────────────────────────────────────────────────
export const symptomService = {
  async getAll(query = "", bodyPart = "") {
    const params = {};
    if (query) params.q = query;
    if (bodyPart) params.body_part = bodyPart;
    const { data } = await api.get("/symptoms/", { params });
    return data;
  },

  async getBodyParts() {
    const { data } = await api.get("/symptoms/body-parts");
    return data;
  },
};

// ── Predictions ───────────────────────────────────────────────────────
export const predictionService = {
  async analyze(symptoms, severity = "mild", duration = 3, notes = "") {
    const { data } = await api.post("/predictions/analyze", {
      symptoms,
      severity,
      duration,
      notes,
    });
    return data;
  },

  async getHistory() {
    const { data } = await api.get("/predictions/history");
    return data;
  },

  async getDetail(predictionId) {
    const { data } = await api.get(`/predictions/${predictionId}`);
    return data;
  },
};

// ── Dashboard ─────────────────────────────────────────────────────────
export const dashboardService = {
  async getStats() {
    const { data } = await api.get("/dashboard/stats");
    return data;
  },

  async getAnalytics() {
    const { data } = await api.get("/dashboard/analytics");
    return data;
  },
};

// ── Reports ───────────────────────────────────────────────────────────
export const reportService = {
  async generate(predictionId) {
    const { data } = await api.post(`/reports/generate/${predictionId}`);
    return data;
  },

  async list() {
    const { data } = await api.get("/reports/");
    return data;
  },

  async download(reportId) {
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MedAssist_Report_${reportId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

// ── Notifications ─────────────────────────────────────────────────────
export const notificationService = {
  async getAll() {
    const { data } = await api.get("/notifications/");
    return data;
  },

  async getUnreadCount() {
    const { data } = await api.get("/notifications/unread-count");
    return data.count;
  },

  async markRead(notificationId) {
    await api.put(`/notifications/${notificationId}/read`);
  },

  async markAllRead() {
    await api.put("/notifications/mark-all-read");
  },
};
