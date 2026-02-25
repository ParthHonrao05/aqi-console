import axios from 'axios';
import { isTokenExpired } from '../utils/jwt';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if available and valid
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check if token is expired before sending request
      if (isTokenExpired(token)) {
        // Clear expired token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
        
        return Promise.reject(new Error('Token expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout. Please check your connection.';
      } else if (error.message === 'Network Error') {
        error.message = 'Network error. Please check your internet connection.';
      } else {
        error.message = error.message || 'An unexpected error occurred';
      }
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data?.message || 'An error occurred';

    // Handle different error status codes
    switch (status) {
      case 401:
        // Unauthorized - token invalid or expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
        break;
      
      case 403:
        // Forbidden - insufficient permissions
        error.message = 'You do not have permission to perform this action.';
        break;
      
      case 404:
        error.message = 'The requested resource was not found.';
        break;
      
      case 422:
        // Validation errors
        error.message = message;
        error.validationErrors = error.response?.data?.errors;
        break;
      
      case 500:
        error.message = 'Server error. Please try again later.';
        break;
      
      default:
        error.message = message || 'An unexpected error occurred';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
};

// Users API
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  createClient: (userData) => api.post('/users', userData),
  getAllClients: () => api.get('/users/clients'),
  deleteClient: (id) => api.delete(`/users/${id}`),
  createAdmin: (data) => api.post('/users/admin', data),
  getAllAdmins: () => api.get('/users/admins'),
};

// Devices API
export const devicesAPI = {
  getAllDevices: () => api.get('/devices'),
  createDevice: (deviceData) => api.post('/devices', deviceData),
  assignDevice: (deviceId, clientId) => api.put(`/devices/${deviceId}/assign/${clientId}`),
  toggleStatus: (deviceId) => api.put(`/devices/${deviceId}/status`),
  readDevice: (deviceId) => api.post(`/devices/${deviceId}/read`),
  getDashboardStats: () => api.get("/devices/dashboard/stats"),
};

// AQI API
export const aqiAPI = {
  getAqiHistory: (deviceId) => api.get(`/aqi/${deviceId}`),
  deleteReading: (readingId) => api.delete(`/aqi/${readingId}`),
};


export default api;