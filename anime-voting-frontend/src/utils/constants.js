// API Configuration
export const API_BASE_URL = "https://localhost:7015/api";

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: "/Auth/login",
  REGISTER: "/Auth/register",

  // Characters
  RANDOM_PAIR: "/Characters/pair",
  LEADERBOARD: "/Characters/leaderboard",

  // Voting
  VOTE: "/Votes", // Will append /{winnerId}
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "anime_voting_token",
  USER: "anime_voting_user",
};

// App Configuration
export const APP_CONFIG = {
  TOKEN_EXPIRY_HOURS: 24,
  LEADERBOARD_SIZE: 10,
  VOTING_COOLDOWN_MS: 1000,
};
