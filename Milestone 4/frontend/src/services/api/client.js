import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication tokens
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
    // Handle common errors
    if (error.response) {
      const status = error.response.status;
      
      // Handle 401 Unauthorized - likely token expired or invalid
      if (status === 401) {
        // Clear invalid token
        localStorage.removeItem('medassist_token');
        localStorage.removeItem('medassist_user');
        
        // Don't redirect here, let components handle their own auth state
        // Just enhance the error message
        error.userMessage = 'Session expired. Please log in again.';
      }
      
      // Handle 403 Forbidden
      if (status === 403) {
        error.userMessage = 'You do not have permission to access this feature.';
      }
      
      // Handle 404 Not Found
      if (status === 404) {
        error.userMessage = 'The requested resource was not found.';
      }
      
      // Handle 500 Server Error
      if (status >= 500) {
        error.userMessage = 'Server error. Please try again later.';
      }
    } else if (error.request) {
      // Network error
      error.userMessage = 'Network error. Please check your connection.';
    }
    
    return Promise.reject(error);
  }
);

export default client;
