import axios from 'axios';
import { AuthResponse, FaceDetectionResult, DetectionHistory, UserStats, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Face Detection API
export const faceAPI = {
  detectFromUrl: async (imageUrl: string): Promise<FaceDetectionResult> => {
    const response = await api.post('/faces/detect', { imageUrl });
    return response.data;
  },

  uploadImage: async (file: File): Promise<FaceDetectionResult> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/faces/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getHistory: async (page: number = 1, limit: number = 10): Promise<DetectionHistory> => {
    const response = await api.get(`/faces/history?page=${page}&limit=${limit}`);
    return response.data;
  },

  getStats: async (): Promise<UserStats> => {
    const response = await api.get('/faces/stats');
    return response.data;
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default api; 