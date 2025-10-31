import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL; // set in .env

const API = axios.create({
  baseURL: BASE_URL, // e.g., https://your-backend.vercel.app/api
  headers: { "Content-Type": "application/json" },
});

// Auth token helper
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common['Authorization'];
  }
};

export default API;
