import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../utils/constants";
import { getAuthHeaders, logout } from "../utils/auth";
import { getByLabelText } from "@testing-library/dom";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth headers automatically
api.interceptors.request.use(
  (config) => {
    // Add auth headers to every request if token exists
    const authHeaders = getAuthHeaders();
    config.headers = { ...config.headers, ...authHeaders };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on 401 Unauthorized
    if (error.response?.status === 401) {
      logout();
      return Promise.reject(new Error("Session expired. Please login again."));
    }

    // Handle network errors
    if (!error.response) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },
};

// Characters API calls
export const charactersAPI = {
  getRandomPair: async () => {
    const response = await api.get(API_ENDPOINTS.RANDOM_PAIR);
    return response.data;
  },

  getLeaderboard: async () => {
    const response = await api.get(API_ENDPOINTS.LEADERBOARD);
    return response.data;
  },
};

// Voting API calls
export const votingAPI = {
  castvote: async (winnerId) => {
    const response = await api.post(`${API_ENDPOINTS.VOTE}/${winnerId}`);
    return response.data;
  },
};

// Export default api instance for custom calls
export default api;
