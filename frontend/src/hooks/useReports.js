import { useState, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import reportService from '../services/reportService';

export const useReports = () => {
  const { profile, symptomSession, addNotification } = useUser();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getReports();
      setReports(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await reportService.generateReport(symptomSession, profile);
      addNotification(
        'Health Report Generated',
        `Report for ${profile.name} was successfully created.`,
        'success'
      );
      await fetchReports();
      return report;
    } catch (err) {
      setError(err.message || 'Failed to generate report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await reportService.deleteReport(id);
      addNotification('Report Deleted', 'The health report was deleted.', 'info');
      await fetchReports();
    } catch (err) {
      setError(err.message || 'Failed to delete report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    removeReport
  };
};

export default useReports;
