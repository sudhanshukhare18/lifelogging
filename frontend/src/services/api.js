import axios from 'axios';

// Use direct backend URL with enhanced CORS handling
const API_BASE = 'https://automatic-space-bassoon-69457jw9p5qgf4qv9-8000.app.github.dev/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced request interceptor for CORS
api.interceptors.request.use((config) => {
  console.log('Making API request to:', config.url);
  
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add CORS headers for preflight
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  
  return config;
});

// Enhanced response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API response success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API response error:', error.response?.status, error.config?.url, error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    
    // Handle CORS errors specifically
    if (error.message.includes('CORS') || error.message.includes('Network Error')) {
      console.error('CORS/Network error detected. Check backend CORS configuration.');
    }
    
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
  register: (userData) => api.post('/register/', userData),
};

// Memory API endpoints
export const memoryAPI = {
  getMemories: (params = {}) => api.get('/memories/', { params }),
  getMemory: (id) => api.get(`/memories/${id}/`),
  createMemory: (data) => api.post('/memories/', data),
  updateMemory: (id, data) => api.patch(`/memories/${id}/`, data),
  deleteMemory: (id) => api.delete(`/memories/${id}/`),
  semanticSearch: (query) => api.get('/memories/semantic_search/', { params: { q: query } }),
  getEmotionStats: () => api.get('/memories/emotion_stats/'),
  analyzeEmotion: (text) => api.post('/ai/analyze-emotion/', { text }),
  getUserStats: () => api.get('/user/stats/'),
};

export default api;