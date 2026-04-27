import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Add a request interceptor to handle auth tokens later
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const biasService = {
  analyze: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHistory: () => api.get('/analyze/history'),
};
