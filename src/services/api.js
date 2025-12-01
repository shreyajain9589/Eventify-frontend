import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL; // set in .env

const API = axios.create({
  baseURL: BASE_URL, // e.g., http://localhost:5000/api
  headers: { "Content-Type": "application/json" },
});

// Response interceptor to handle new backend format
API.interceptors.response.use(
  (response) => {
    // If response has the new format { success, data, message }, extract data
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      // Return data directly for backward compatibility
      return {
        ...response,
        data: response.data.data || response.data
      };
    }
    return response;
  },
  (error) => {
    // Handle error responses with new format
    if (error.response?.data?.error) {
      const errorData = error.response.data.error;
      // Create a more user-friendly error message
      const message = errorData.details 
        ? `${errorData.message}: ${errorData.details.map(d => d.message).join(', ')}`
        : errorData.message;
      
      error.message = message;
    }
    return Promise.reject(error);
  }
);

// Auth token helper
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
