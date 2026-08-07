import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.medassist.ai/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication tokens (placeholder for future implementation)
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medassist_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle common errors (e.g. 401 Unauthorized, 500 Server Error)
    return Promise.reject(error);
  }
);

export default client;
