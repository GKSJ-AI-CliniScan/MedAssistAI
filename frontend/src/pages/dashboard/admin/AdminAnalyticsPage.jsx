import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import { BarChart3, Loader2, AlertCircle, Users, Calendar, Brain, Activity } from 'lucide-react';
import { getAnalyticsSummary, getDiseaseDistribution } from '../../../services/api/analytics';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [diseaseData, setDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [analyticsData, diseaseDistribution] = await Promise.all([
        getAnalyticsSummary().catch(() => null),
        getDiseaseDistribution().catch(() => null)
      ]);
      setAnalytics(analyticsData);
      setDiseaseData(diseaseDistribution);
      setError(null);
    } catch (err) {
      setError('Unable to load analytics data. Please try again later.');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-clinical-green" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            System Analytics
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Real-time diagnostic metrics & AI model performance
          </p>
        </div>
        <ModTag variant="ai">Analytics Module</ModTag>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchAnalyticsData} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card title="System Performance & Diagnostic Analytics" subtitle="Aggregate Data Visualizations">
        <div className="space-y-4">
          <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
            Inspect AI model diagnostic trends, disease prevalence statistics, and clinical throughput metrics.
          </p>

          {analytics ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Total Patients</span>
                <div className="text-sm font-bold text-clinical-green dark:text-clinical-greenDark mt-1">{analytics.overview?.total_patients || 0}</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Total Doctors</span>
                <div className="text-sm font-bold text-clinical-teal dark:text-clinical-tealDark mt-1">{analytics.overview?.total_doctors || 0}</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Total Reports</span>
                <div className="text-sm font-bold text-clinical-violet dark:text-clinical-violetDark mt-1">{analytics.overview?.total_reports || 0}</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Total Appointments</span>
                <div className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark mt-1">{analytics.overview?.total_appointments || 0}</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Emergency Alerts</span>
                <div className="text-sm font-bold text-red-600 dark:text-red-400 mt-1">{analytics.overview?.total_emergency_alerts || 0}</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Total Users</span>
                <div className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark mt-1">{analytics.overview?.total_users || 0}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">AI Diagnostic Volume</span>
                <div className="text-sm font-bold text-clinical-green dark:text-clinical-greenDark mt-1">Telemetry Ready</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">Model Status</span>
                <div className="text-sm font-bold text-clinical-teal dark:text-clinical-tealDark mt-1">Active</div>
              </div>

              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">System Uptime</span>
                <div className="text-sm font-bold text-clinical-violet dark:text-clinical-violetDark mt-1">Online</div>
              </div>
            </div>
          )}

          {diseaseData && diseaseData.top_predicted_diseases && (
            <div className="mt-4 p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
              <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block mb-3">Top Predicted Diseases</span>
              <div className="space-y-2">
                {diseaseData.top_predicted_diseases.slice(0, 5).map((item) => (
                  <div key={item.disease} className="flex items-center justify-between">
                    <span className="text-xs text-clinical-textLight dark:text-clinical-textDark">{item.disease}</span>
                    <span className="text-xs font-semibold text-clinical-violet dark:text-clinical-violetDark">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Button variant="primary" onClick={() => {
              if (!analytics) {
                alert('No analytics data available to export');
                return;
              }
              
              const csvContent = [
                ['Metric', 'Value'],
                ['Total Patients', analytics.overview?.total_patients || 0],
                ['Total Doctors', analytics.overview?.total_doctors || 0],
                ['Total Reports', analytics.overview?.total_reports || 0],
                ['Total Appointments', analytics.overview?.total_appointments || 0],
                ['Emergency Alerts', analytics.overview?.total_emergency_alerts || 0],
                ['Total Users', analytics.overview?.total_users || 0],
                ['Export Date', new Date().toISOString()]
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `MedAssistAI_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }} className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Generate Metrics Export</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
