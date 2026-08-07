import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getAnalyticsSummary, getDiseaseDistribution } from '../../services/api/analytics';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [diseases, setDiseases] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [s, d] = await Promise.all([getAnalyticsSummary(), getDiseaseDistribution()]);
      setSummary(s);
      setDiseases(d);
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to load analytics.';
      setError(typeof msg === 'string' ? msg : 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <Button size="small" variant="outline" onClick={loadData} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {loading ? (
        <Card><p className="text-slate-400 text-sm py-4">Loading live system analytics...</p></Card>
      ) : (
        <>
          {/* System Overview */}
          {summary?.overview && (
            <Card title="System Overview" subtitle="Live database metrics">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(summary.overview).map(([key, val]) => (
                  <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1 capitalize">
                      {key.replace(/total_/g, '').replace(/_/g, ' ')}
                    </p>
                    <p className="text-xl font-bold text-teal-700">{String(val)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Level Breakdown */}
            {summary?.reports_by_risk_level && (
              <Card title="Reports by Risk Level" subtitle="Live patient risk distributions">
                <div className="space-y-3">
                  {Object.keys(summary.reports_by_risk_level).length > 0 ? (
                    Object.entries(summary.reports_by_risk_level).map(([level, count]) => {
                      const total = summary.overview?.total_reports || 1;
                      const pct = Math.round((count / total) * 100);
                      const badgeColors = {
                        Low: 'bg-green-100 text-green-800',
                        Medium: 'bg-yellow-100 text-yellow-800',
                        High: 'bg-orange-100 text-orange-800',
                        Critical: 'bg-red-100 text-red-800',
                      };
                      return (
                        <div key={level} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                          <span className={`px-2 py-0.5 rounded font-medium ${badgeColors[level] || 'bg-slate-200 text-slate-700'}`}>
                            {level}
                          </span>
                          <span className="font-semibold text-slate-700">{count} reports ({pct}%)</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 py-2">No reports recorded yet.</p>
                  )}
                </div>
              </Card>
            )}

            {/* Appointment Status Breakdown */}
            {summary?.appointments_by_status && (
              <Card title="Appointments Status" subtitle="Live clinical scheduling status">
                <div className="space-y-3">
                  {Object.keys(summary.appointments_by_status).length > 0 ? (
                    Object.entries(summary.appointments_by_status).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded border border-slate-100">
                        <span className="font-medium text-slate-700">{status}</span>
                        <span className="font-semibold text-teal-700">{count} appointments</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-2">No appointments scheduled yet.</p>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Disease Distribution */}
          {diseases && (
            <Card title="Disease Distribution" subtitle="Top predicted diseases from actual patient reports">
              <div className="space-y-4">
                {(() => {
                  const list = diseases.top_predicted_diseases || diseases.top_diseases || [];
                  const total = summary?.overview?.total_reports || list.reduce((acc, item) => acc + item.count, 0) || 1;

                  if (Array.isArray(list) && list.length > 0) {
                    return list.map((d, i) => {
                      const pct = Math.round((d.count / total) * 100);
                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-slate-700 truncate max-w-xs">{d.disease}</span>
                            <span className="text-slate-500 font-medium">{d.count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="h-2 bg-teal-600 rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(pct, 5)}%` }}
                            />
                          </div>
                        </div>
                      );
                    });
                  }
                  return (
                    <p className="text-xs text-slate-400 py-2">No disease predictions recorded yet.</p>
                  );
                })()}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
