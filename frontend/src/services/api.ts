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
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  analyze: (file: File, mapping: { targetColumn: string, protectedColumn: string, groupA: string, groupB: string, approvalValue: string }) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetColumn', mapping.targetColumn);
    formData.append('protectedColumn', mapping.protectedColumn);
    formData.append('groupA', mapping.groupA);
    formData.append('groupB', mapping.groupB);
    formData.append('approvalValue', mapping.approvalValue);
    
    return api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHistory: () => api.get('/analyze/history'),
};

