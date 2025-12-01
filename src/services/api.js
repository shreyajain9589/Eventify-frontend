import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor: unwrap { success, data, message }
API.interceptors.response.use(
  (response) => {
    // If API returns { success, booking }
    if (
      response.data &&
      typeof response.data === "object" &&
      response.data.success === true
    ) {
      return response; // <-- Do NOT modify data
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Auth token helper
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
