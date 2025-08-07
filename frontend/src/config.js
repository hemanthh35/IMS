// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  PREDICT: `${API_BASE_URL}/predict`,
  SUMMARIZE: `${API_BASE_URL}/summarize`,
  SEARCH: `${API_BASE_URL}/search`,
  HISTORY: `${API_BASE_URL}/history`,
  HEALTH: `${API_BASE_URL}/`,
};

export default API_BASE_URL; 