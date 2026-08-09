import axios from 'axios';

/**
 * ============================================================
 * MedAssist AI — Centralized API client (Axios)
 * ============================================================
 *
 * All backend calls go through this file. To connect your FastAPI
 * backend, you only need to:
 *
 *  1. Set VITE_API_URL in your .env file (or rely on the Vite
 *     dev proxy which forwards "/api" -> http://localhost:8000).
 *  2. Adjust the endpoint paths below to match your FastAPI
 *     route definitions if they differ.
 *
 * JWT auth tokens are stored in localStorage under "medassist_token"
 * and automatically attached to every request via the request
 * interceptor. On 401 responses the token is cleared and the user
 * is redirected to /login.
 * ============================================================
 */

const TOKEN_KEY = 'medassist_token';
const USER_KEY = 'medassist_user';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ---- Request interceptor: attach JWT to every request ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- Response interceptor: unwrap data, normalize errors ----
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = {
      message:
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      status: error.response?.status || 0,
      data: error.response?.data || null,
    };
    // Auto-logout on 401
    if (normalized.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(normalized);
  },
);

export default api;

// ============================================================
// Auth endpoints  (POST /auth/*, GET /auth/me)
// ============================================================
export const authApi = {
  /** POST /auth/login — body: { email, password } -> { access_token, user } */
  login: (payload) => api.post("/auth/login", {
    username: payload.email,
    password: payload.password,
  }),
  /** POST /auth/register — body: user fields -> { access_token, user } */
  register: (payload) => api.post('/auth/register', payload),
  /** POST /auth/google — body: { token/credential } -> { access_token, user } */
  googleLogin: (payload) => api.post('/auth/google', payload),
  /** POST /auth/forgot-password — body: { email } */
  forgotPassword: (payload) => api.post('/auth/forgot-password', payload),
  /** POST /auth/reset-password — body: { token, password } */
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  /** GET /auth/me -> { user } (requires JWT) */
  me: () => api.get('/auth/me'),
  /** POST /auth/logout (requires JWT) */
  logout: () => api.post('/auth/logout'),
};

// ============================================================
// Dashboard / profile  (GET/PUT /users/*, GET /dashboard)
// ============================================================
export const userApi = {
  /** GET /users/me -> user profile object */
  getProfile: () => api.get('/users/me'),
  /** PUT /users/me — update profile fields */
  updateProfile: (payload) => api.put('/users/me', payload),
  /** PUT /users/me/settings — notification/security preferences */
  updateSettings: (payload) => api.put('/users/me/settings', payload),
  /** GET /users/me/health-score -> { score, trend } */
  getHealthScore: () => api.get('/users/me/health-score'),
  /** GET /dashboard -> aggregated dashboard data */
  getDashboard: () => api.get('/dashboard'),
};

// ============================================================
// Symptoms & predictions  (GET/POST /symptoms/*, /predictions/*)
// ============================================================
export const symptomApi = {
  /** GET /symptoms/categories -> string[] | { categories: string[] } */
  getCategories: () => api.get('/symptoms/categories'),
  /** GET /symptoms -> all symptoms (optionally filtered by ?category=) */
  getAllSymptoms: (params) => api.get('/symptoms', { params }),
  /** GET /symptoms/search?q=... -> symptom[] */
  searchSymptoms: (query) => api.get('/symptoms/search', { params: { q: query } }),
  /** POST /predictions/analyze — body: { symptoms, duration, severity } -> prediction result */
  predict: (payload) => api.post('/predictions/analyze', payload),
  /** GET /predictions/:id -> single prediction result */
  getPrediction: (id) => api.get(`/predictions/${id}`),
  /** GET /predictions -> prediction history list */
  getPredictionHistory: (params) => api.get('/predictions', { params }),
  /** GET /predictions/:id/pdf -> Blob (PDF download) */
  downloadReport: (id) =>
  api.get(`/reports/${id}/download`, {
    responseType: "blob",
  }),
};

// ============================================================
// Reports  (GET/DELETE /reports/*)
// ============================================================
export const reportApi = {
  /** GET /reports -> report[] (supports query params for filtering) */
  list: (params) => api.get('/reports', { params }),
  /** GET /reports/:id -> single report */
  get: (id) => api.get(`/reports/${id}`),
  /** GET /reports/:id/download -> Blob (PDF download) */
  download: (id) => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
  /** DELETE /reports/:id */
  delete: (id) => api.delete(`/reports/${id}`),
};

// ============================================================
// Notifications  (GET/PUT /notifications/*)
// ============================================================
export const notificationApi = {
  /** GET /notifications -> notification[] */
  list: () => api.get('/notifications'),
  /** PUT /notifications/:id/read */
  markRead: (id) => api.put(`/notifications/${id}/read`),
  /** PUT /notifications/read-all */
  markAllRead: () => api.put('/notifications/read-all'),
};

// ---- Helper: trigger browser download from a blob response ----
export function downloadBlob(blob, filename) {

  const pdfBlob = new Blob([blob], {
    type: "application/pdf",
  });

  const url = window.URL.createObjectURL(pdfBlob);

  const a = document.createElement("a");

  a.href = url;

  a.download = filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  window.URL.revokeObjectURL(url);
}
