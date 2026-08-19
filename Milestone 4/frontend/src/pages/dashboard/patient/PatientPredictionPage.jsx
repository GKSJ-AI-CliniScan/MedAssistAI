import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import EmptyState from '../../../components/ui/EmptyState';
import { 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Clock, 
  Calendar,
  Stethoscope,
  FileText,
  ShieldAlert,
  ArrowRight,
  Activity
} from 'lucide-react';
import { getMyReports } from '../../../services/api/reports';

export default function PatientPredictionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(location.state?.prediction || null);
  const [symptoms, setSymptoms] = useState(location.state?.symptoms || []);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(!location.state?.prediction);

  useEffect(() => {
    if (location.state?.prediction) {
      setPrediction(location.state.prediction);
      setSymptoms(location.state.symptoms || []);
      setShowHistory(false);
    }
    fetchPredictionHistory();
  }, [location]);

  const fetchPredictionHistory = async () => {
    try {
      setLoading(true);
      const reports = await getMyReports();
      const list = Array.isArray(reports) ? reports : [];
      setHistory(list);
      
      // If no current prediction from location state, but reports exist, show the latest report by default
      if (!location.state?.prediction && list.length > 0) {
        // Leave showHistory = true so user sees history list or can toggle
      }
      setError(null);
    } catch (err) {
      setError('Unable to load prediction history. Please try again later.');
      console.error('Error fetching prediction history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistoryItem = (report) => {
    let parsedSymptoms = [];
    if (report.symptoms_submitted) {
      try {
        parsedSymptoms = typeof report.symptoms_submitted === 'string' 
          ? JSON.parse(report.symptoms_submitted) 
          : report.symptoms_submitted;
      } catch {
        parsedSymptoms = [report.symptoms_submitted];
      }
    }
    setPrediction({
      predicted_disease: report.predicted_disease,
      confidence: report.confidence,
      risk_level: report.risk_level,
      severity_level: report.severity_level,
      severity_score: report.severity_score,
      emergency: report.emergency,
      recommendation: report.recommendations,
      health_risk_report: `Assessment for ${report.predicted_disease}. Clinical risk scored as ${report.risk_level} with ${report.severity_level || 'standard'} severity (${report.severity_score || 0}/100).`,
    });
    setSymptoms(Array.isArray(parsedSymptoms) ? parsedSymptoms : []);
    setShowHistory(false);
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
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800';
      default:
        return 'text-clinical-textLight dark:text-clinical-textDark bg-clinical-bgLight dark:bg-clinical-bgDarkSec border-slate-200 dark:border-clinical-tealDark/20';
    }
  };

  const getSeverityColor = (severityLevel) => {
    switch (severityLevel?.toLowerCase()) {
      case 'severe':
      case 'critical':
        return 'text-red-600 dark:text-red-400';
      case 'moderate':
      case 'medium':
        return 'text-amber-600 dark:text-amber-400';
      case 'mild':
      case 'low':
        return 'text-emerald-600 dark:text-emerald-400';
      default:
        return 'text-clinical-textLight dark:text-clinical-textDark';
    }
  };

  // View: History List
  if (showHistory || !prediction) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
              Disease Prediction History
            </h1>
            <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
              Ensemble machine learning diagnostic records & longitudinal evaluations
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              size="small" 
              onClick={() => navigate('/patient/symptoms')} 
              className="gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Run New Assessment</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <Button variant="primary" size="small" onClick={fetchPredictionHistory} className="mt-2">
                Retry
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
          </div>
        ) : (
          <Card title="Clinical Prediction Logs" subtitle="Past AI-powered diagnostic screenings">
            {history.length === 0 ? (
              <EmptyState 
                icon={Brain}
                title="No prediction history available"
                description="Launch the symptom checker to run your first multi-class disease evaluation."
                actionLabel="Launch Symptom Checker"
                onActionClick={() => navigate('/patient/symptoms')}
                className="py-12"
              />
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {history.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-2"
                    onClick={() => handleViewHistoryItem(report)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {report.predicted_disease}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRiskColor(report.risk_level)}`}>
                            {report.risk_level} Risk
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{new Date(report.created_at).toLocaleString()}</span>
                          </div>
                          <div>
                            Confidence: <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark">{report.confidence?.toFixed(1)}%</span>
                          </div>
                          <div>
                            Severity: <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark">{report.severity_score || 0}/100</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" size="small" className="text-xs">
                        View Findings
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    );
  }

  // View: Active Prediction Results
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Disease Prediction Findings
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Tri-model ensemble diagnostic inference report
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="small" onClick={() => setShowHistory(true)} className="text-xs">
            Past Assessments ({history.length})
          </Button>
          <Button 
            variant="primary" 
            size="small" 
            onClick={() => navigate('/patient/symptoms')}
            className="gap-1.5 text-xs bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
          >
            <Brain className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Condition Banner */}
          <Card 
            title="Primary Diagnostic Evaluation" 
            subtitle="AI Confidence & Probabilistic Finding"
            variant="ai"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-[#06B6D4]/30">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#06B6D4]/20 text-[#06B6D4] mt-0.5">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#06B6D4] block">
                      Probable Clinical Condition
                    </span>
                    <h2 className="text-xl font-extrabold text-clinical-textLight dark:text-clinical-textDark">
                      {prediction.predicted_disease}
                    </h2>
                    <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5 block">
                      AI Diagnostic Confidence: <strong className="text-[#06B6D4]">{prediction.confidence?.toFixed(1)}%</strong>
                    </span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getRiskColor(prediction.risk_level)}`}>
                  {prediction.risk_level} Risk
                </span>
              </div>

              {/* Emergency Alert if applicable */}
              {prediction.emergency && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 block">
                      High-Priority Emergency Indicators Detected
                    </span>
                    <span className="text-xs text-red-700 dark:text-red-300 leading-relaxed block mt-0.5">
                      Your submitted clinical indicators suggest conditions requiring urgent medical intervention. Please contact emergency health services or consult a physician immediately.
                    </span>
                  </div>
                </div>
              )}

              {/* Severity & Score Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">
                    Severity Tier
                  </span>
                  <span className={`text-base font-bold mt-1 block ${getSeverityColor(prediction.severity_level)}`}>
                    {prediction.severity_level || 'Moderate'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">
                    Severity Index
                  </span>
                  <span className="text-base font-bold text-clinical-textLight dark:text-clinical-textDark mt-1 block">
                    {prediction.severity_score || 0} / 100
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase font-bold text-clinical-mutedLight dark:text-clinical-mutedDark block">
                    Urgency
                  </span>
                  <span className="text-base font-bold text-[#06B6D4] mt-1 block">
                    {prediction.emergency ? 'Urgent' : 'Routine Care'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recommendations Card */}
          <Card title="Medical Recommendations" subtitle="Evidence-based self-care and clinician guidance">
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">
                  <Sparkles className="w-4 h-4 text-[#06B6D4]" />
                  <span>Clinical Directives</span>
                </div>
                <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                  {prediction.recommendation || 'Consult with a certified general physician or specialist to confirm differential diagnoses.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Symptoms Evaluated */}
          {symptoms.length > 0 && (
            <Card title="Clinical Symptoms Analyzed" subtitle={`${symptoms.length} symptoms evaluated in this inference`}>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 text-xs font-semibold"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Sidebar: Next Steps & Doctor Booking */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Next Steps" subtitle="Take clinical action">
            <div className="space-y-3">
              <Button 
                variant="primary" 
                onClick={() => navigate('/patient/appointments')} 
                className="w-full gap-2 justify-center bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Consult Approved Doctor</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => navigate('/patient/reports')} 
                className="w-full gap-2 justify-center"
              >
                <FileText className="w-4 h-4" />
                <span>Download Report Archive</span>
              </Button>

              <Button 
                variant="outline" 
                onClick={() => navigate('/patient/symptoms')} 
                className="w-full gap-2 justify-center"
              >
                <Activity className="w-4 h-4" />
                <span>Retake Symptom Checker</span>
              </Button>
            </div>
          </Card>

          <Card title="Model Architecture" subtitle="Ensemble Classification">
            <div className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark space-y-2">
              <p className="leading-relaxed">
                Powered by a soft-voting ensemble comprising <strong>RandomForest</strong>, <strong>XGBoost</strong>, and <strong>LightGBM</strong> trained on over 190,000 multi-symptom clinical cases across 773 disease classes.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
