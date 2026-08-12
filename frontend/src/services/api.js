/**
 * MedAssist AI – Axios API Client
 * Central API service layer connecting all React pages to FastAPI backend.
 */
import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000/api`;
const BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor: Attach JWT token ─────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medassist_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: Auto-refresh on 401 ────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("medassist_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem("medassist_access_token", data.access_token);
        localStorage.setItem("medassist_refresh_token", data.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
