/**
 * Report Service
 * Central service layer connecting frontend to backend PDF report generation and download.
 * Gracefully handles demo sessions where backend is unreachable.
 */
import api from './api';
import { authService } from './authService';

export const reportService = {
  /**
   * Get all reports for the authenticated patient.
   * Returns empty array in demo mode instead of hitting the backend.
   */
  getReports: async () => {
    if (authService.isDemoSession()) {
      return [];
    }
    const { data } = await api.get('/reports/');
    return data;
  },

  /**
   * Generate a PDF report from a prediction ID.
   * @param {number|string} predictionId
   */
  generateReport: async (predictionId) => {
    if (authService.isDemoSession()) {
      throw new Error('Report generation requires a live backend connection. Please ensure the server is running.');
    }
    const { data } = await api.post(`/reports/generate/${predictionId}`);
    return data;
  },

  /**
   * Download a PDF report file as a Blob and trigger browser save file dialog.
   * @param {number|string} reportId
   * @param {string} fileName
   */
  downloadReportFile: async (reportId, fileName = 'Medical_Report.pdf') => {
    if (authService.isDemoSession()) {
      throw new Error('Report download requires a live backend connection. Please ensure the server is running.');
    }
    const response = await api.get(`/reports/${reportId}/download`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

export default reportService;
