import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getMyReports, downloadReportText } from '../../services/api/reports';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function parseSymptoms(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.join(', ') : raw;
  } catch {
    return raw;
  }
}

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadText, setDownloadText] = useState(null);

  useEffect(() => {
    getMyReports()
      .then((data) => setReports(data))
      .catch((err) => {
        const msg = err?.response?.data?.detail || 'Failed to load reports.';
        setError(typeof msg === 'string' ? msg : 'Failed to load reports.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (id) => {
    setDownloadingId(id);
    setDownloadText(null);
    try {
      const data = await downloadReportText(id);
      setDownloadText(data.report_text);
    } catch {
      setDownloadText('Failed to download report.');
    } finally {
      setDownloadingId(null);
    }
  };

  const riskBadge = (level) => {
    const colors = {
      Low: 'bg-green-100 text-green-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      High: 'bg-orange-100 text-orange-700',
      Critical: 'bg-red-100 text-red-700',
    };
    return (
      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${colors[level] || 'bg-slate-100 text-slate-600'}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>

      {downloadText && (
        <Card title="Report Download">
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-slate-500">Printable report text</p>
            <button
              onClick={() => setDownloadText(null)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <pre className="text-xs bg-slate-50 border border-slate-200 rounded p-4 whitespace-pre-wrap overflow-auto max-h-80">
            {downloadText}
          </pre>
        </Card>
      )}

      <Card title="Diagnostic & Patient Reports" subtitle="Medical Document Archive">
        {loading ? (
          <p className="text-slate-400 text-sm py-4">Loading reports...</p>
        ) : error ? (
          <p className="text-red-600 text-sm py-4">{error}</p>
        ) : reports.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">
            No reports found. Run the Symptom Checker to generate your first report.
          </p>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 text-sm">{report.predicted_disease}</p>
                  {riskBadge(report.risk_level)}
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap gap-4">
                  <span>Severity: {report.severity_level} (Score: {report.severity_score})</span>
                  <span>Date: {formatDate(report.created_at)}</span>
                  {report.confidence != null && (
                    <span>Confidence: {report.confidence.toFixed(1)}%</span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Symptoms: {parseSymptoms(report.symptoms_submitted)}
                </p>
                {report.recommendations && (
                  <p className="text-xs text-slate-600">{report.recommendations}</p>
                )}
                {report.doctor_notes && (
                  <p className="text-xs text-teal-700 italic">Doctor notes: {report.doctor_notes}</p>
                )}
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => handleDownload(report.id)}
                  disabled={downloadingId === report.id}
                >
                  {downloadingId === report.id ? 'Downloading...' : 'Download Report'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
