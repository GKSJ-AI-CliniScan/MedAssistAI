import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { FileText, Loader2, AlertCircle, Download, Brain, Calendar, ShieldCheck, User, Search } from 'lucide-react';
import { getAllPatients } from '../../../services/api/patient';
import { getPatientReports, downloadReport } from '../../../services/api/reports';

export default function AdminReportsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingReports, setLoadingReports] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients(0, 100);
      const list = Array.isArray(data) ? data : [];
      setPatients(list);
      if (list.length > 0) {
        handlePatientSelect(list[0]);
      }
      setError(null);
    } catch (err) {
      setError('Unable to load patient directory.');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientReports = async (patientId) => {
    try {
      setLoadingReports(true);
      const data = await getPatientReports(patientId);
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load clinical reports for selected patient.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    fetchPatientReports(patient.id);
  };

  const handleDownload = async (reportId) => {
    try {
      setDownloading(reportId);
      const blob = await downloadReport(reportId);
      
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
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'medium':
      case 'moderate':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800';
      case 'low':
      default:
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800';
    }
  };

  const filteredPatients = patients.filter(p => {
    const name = p.user?.fullname || p.fullname || '';
    const email = p.user?.email || p.email || '';
    const q = patientSearch.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
          Patient Clinical Reports
        </h1>
        <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
          Centralized diagnostic dossier, clinical prediction findings & certified export registry
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchPatients} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Patient Selector */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Patient Registry" subtitle="Select patient to view clinical records">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-clinical-mutedLight dark:text-clinical-mutedDark" />
                <input
                  type="text"
                  placeholder="Filter patients..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark focus:outline-none focus:border-[#06B6D4]"
                />
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#06B6D4]" />
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                  No patients found.
                </div>
              ) : (
                <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                  {filteredPatients.map((patient) => {
                    const patName = patient.user?.fullname || patient.fullname || `Patient #${patient.id}`;
                    const patEmail = patient.user?.email || patient.email || 'N/A';
                    const isSelected = selectedPatient?.id === patient.id;

                    return (
                      <button
                        key={patient.id}
                        onClick={() => handlePatientSelect(patient)}
                        className={`w-full p-3 rounded-xl border text-left transition-all space-y-0.5 ${
                          isSelected
                            ? 'bg-[#06B6D4]/15 border-[#06B6D4] text-[#06B6D4] shadow-sm'
                            : 'bg-clinical-bgLight dark:bg-clinical-bgDarkSec border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 text-clinical-textLight dark:text-clinical-textDark'
                        }`}
                      >
                        <div className="text-xs font-bold truncate">
                          {patName}
                        </div>
                        <div className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark truncate">
                          {patEmail}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Reports Dossier */}
        <div className="lg:col-span-8 space-y-6">
          <Card 
            title="Diagnostic Reports Dossier" 
            subtitle={selectedPatient ? `Archived Clinical Records for ${selectedPatient.user?.fullname || selectedPatient.fullname}` : 'Select a patient'}
          >
            <div className="space-y-4">
              {!selectedPatient ? (
                <EmptyState 
                  icon={FileText}
                  title="No patient selected"
                  description="Select a patient from the left directory to inspect their diagnostic evaluations."
                  className="py-12"
                />
              ) : loadingReports ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
                </div>
              ) : reports.length === 0 ? (
                <EmptyState 
                  icon={FileText}
                  title="No diagnostic reports available"
                  description="This patient has not yet completed any AI symptom assessments."
                  className="py-12"
                />
              ) : (
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {reports.map((report) => (
                    <div 
                      key={report.id} 
                      className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Brain className="w-4 h-4 text-[#06B6D4]" />
                            <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                              {report.predicted_disease}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRiskColor(report.risk_level)}`}>
                              {report.risk_level} Risk
                            </span>
                            {report.emergency && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-300">
                                Emergency
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark flex-wrap">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#06B6D4]" />
                              <span>{new Date(report.created_at).toLocaleString()}</span>
                            </div>
                            <div>
                              Confidence: <strong className="text-clinical-textLight dark:text-clinical-textDark">{report.confidence?.toFixed(1)}%</strong>
                            </div>
                            <div>
                              Severity: <strong className="text-clinical-textLight dark:text-clinical-textDark">{report.severity_score || 0}/100 ({report.severity_level || 'Moderate'})</strong>
                            </div>
                          </div>

                          {report.recommendations && (
                            <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark bg-white/60 dark:bg-black/20 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                              Recommendations: {report.recommendations}
                            </p>
                          )}
                        </div>

                        <Button 
                          variant="outline" 
                          size="small"
                          onClick={() => handleDownload(report.id)}
                          disabled={downloading === report.id}
                          className="gap-1.5 shrink-0 text-xs"
                        >
                          {downloading === report.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>Download TXT</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
