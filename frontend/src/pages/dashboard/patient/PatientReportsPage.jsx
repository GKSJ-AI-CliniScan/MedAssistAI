import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { FileText, ShieldCheck, Loader2, AlertCircle, Download, Calendar, Brain } from 'lucide-react';
import { getMyReports, downloadReport } from '../../../services/api/reports';

export default function PatientReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(data || []);
      setError(null);
    } catch (err) {
      setError('Unable to load reports. Please try again later.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId) => {
    try {
      setDownloading(reportId);
      const blob = await downloadReport(reportId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `MedAssistAI_Report_${reportId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading report:', err);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'medium':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      default:
        return 'text-clinical-textLight dark:text-clinical-textDark bg-clinical-bgLight dark:bg-clinical-bgDarkSec border-slate-200 dark:border-clinical-tealDark/20';
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
      <div>
        <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
          Medical Reports
        </h1>
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
          Verified lab tests, diagnostic summaries & AI evaluations
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchReports} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card 
        title="Patient Diagnostic History & Reports" 
        subtitle="Secure Clinical Document Repository"
      >
        <div className="space-y-4">
          {reports.length === 0 ? (
            <>
              <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
                Access, download, and review your historical medical reports, diagnostic summaries, and clinician notes.
              </p>

              <EmptyState 
                icon={FileText}
                title="No medical reports available"
                description="Your diagnostic summaries and lab evaluation reports will appear here once issued by your physician or after completing a symptom analysis."
                actionLabel="Start Symptom Checker"
                onActionClick={() => window.location.href = '/patient/symptoms'}
                className="py-8"
              />
            </>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-clinical-green/30 dark:hover:border-clinical-greenDark/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-clinical-green dark:text-clinical-greenDark" />
                        <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                          {report.predicted_disease}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getRiskColor(report.risk_level)}`}>
                          {report.risk_level}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(report.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          Confidence: {report.confidence?.toFixed(1)}%
                        </div>
                      </div>

                      {report.emergency && (
                        <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Emergency indicators detected</span>
                        </div>
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      size="small"
                      onClick={() => handleDownload(report.id)}
                      disabled={downloading === report.id}
                      className="gap-1.5"
                    >
                      {downloading === report.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
            <ShieldCheck className="w-4 h-4 text-clinical-green dark:text-clinical-greenDark" />
            <span>Protected application data</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
