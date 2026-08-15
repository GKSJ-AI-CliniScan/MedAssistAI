/**
 * MedAssist AI – Axios API Client
 * Central API service layer connecting all React pages to FastAPI backend.
 */
import axios from "axios";

const PROD_API_URL = "https://medassistai-1-weid.onrender.com/api";
const LOCAL_API_URL = "http://localhost:8000/api";

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.')
  );

  // If deployed on Vercel or any live domain, always prioritize the live Render backend
  if (!isLocalHost) {
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
    }
    return PROD_API_URL;
  }

  // If running locally, use envUrl if defined, otherwise localhost:8000
  const url = envUrl || LOCAL_API_URL;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const BASE_URL = getBaseUrl();

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

// ── Response Interceptor: Safe error handling without session destruction ──
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh') ||
      originalRequest?.url?.includes('/auth/google') ||
      originalRequest?.url?.includes('/auth/microsoft') ||
      originalRequest?.url?.includes('/auth/me');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("medassist_refresh_token");
        if (refreshToken && !refreshToken.startsWith('demo') && !refreshToken.startsWith('medassist')) {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          localStorage.setItem("medassist_access_token", data.access_token);
          localStorage.setItem("medassist_refresh_token", data.refresh_token);
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return api(originalRequest);
        }
      } catch (e) {
        // Suppress session clearing so offline or cold-start backends do not log user out
      }
    }
    return Promise.reject(error);
  }
);

export default api;
