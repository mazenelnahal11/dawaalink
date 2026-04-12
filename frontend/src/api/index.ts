import axios from "axios";
import { getAuthToken, logout } from "../store/AuthStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Inject JWT on every request (Pharmacy-ID is now derived server-side from the JWT principal)
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) logout();
    return Promise.reject(error);
  }
);
