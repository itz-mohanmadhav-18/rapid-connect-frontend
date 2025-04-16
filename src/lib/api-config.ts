// Base API configuration
const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || 'An unknown error occurred');
  }
  return response.json();
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth-token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth-token');
};

export default {
  API_URL,
  handleApiResponse,
  getAuthToken,
  setAuthToken,
  removeAuthToken
};