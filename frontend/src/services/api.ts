import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

import { getAuth } from 'firebase/auth';

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // always fresh, auto-refreshes
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AnalysisResult {
  fairnessScore: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  metrics: Array<{
    name: string;
    value: number;
    threshold: number;
    status: 'Pass' | 'Fail' | 'Warning';
    description: string;
  }>;
  groupStats: Array<{
    name: string;
    totalCount: number;
    approvedCount: number;
    approvalRate: number;
  }>;
  warnings: string[];
  summary: string;
  recommendations: string[];
}

export interface DashboardSummary {
  totalUploads: number;
  totalAudits: number;
  avgFairnessScore: number;
  latestFairnessScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
}

export interface RecentReport {
  fileName: string;
  date: string;
  score: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  protectedAttribute: string;
}

export interface TrendData {
  labels: string[];
  scores: number[];
  auditCounts: number[];
}

export interface Distribution {
  severityBreakdown: Record<string, number>;
  avgScoreByAttribute: Record<string, number>;
}

export interface Recommendation {
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reportName: string;
  action: string;
  reasoning: string;
  date: string;
  reportId: number;
}

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

export const dashboardService = {
  getSummary: () => api.get<DashboardSummary>('/dashboard/summary'),
  getRecentReports: () => api.get<RecentReport[]>('/dashboard/recent'),
  getTrends: () => api.get<TrendData>('/dashboard/trends'),
  getDistribution: () => api.get<Distribution>('/dashboard/distribution'),
};

export const reportService = {
  getAll: () => api.get<any[]>('/reports'),
  getById: (id: number) => api.get<any>(`/reports/${id}`),
  delete: (id: number) => api.delete(`/reports/${id}`),
  getLatest: () => api.get<any>('/reports/latest'),
  export: (id: number) => api.get(`/reports/export/${id}`, { responseType: 'blob' }),
};

export const recommendationService = {
  getAll: () => api.get<Recommendation[]>('/recommendations'),
};

