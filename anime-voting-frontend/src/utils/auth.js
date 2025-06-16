import { STORAGE_KEYS } from "./constants";

// Token Management
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// User Management
export const getUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userStr || userStr === "undefined" || userStr === "null") {
    return null;
  }
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

// Token Validation
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode JWT payload (basic check)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
};

// Authentication Headers
export const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Logout Helper
export const logout = () => {
  removeToken();
  // Redirect to login page
  window.location.href = "/login";
};
