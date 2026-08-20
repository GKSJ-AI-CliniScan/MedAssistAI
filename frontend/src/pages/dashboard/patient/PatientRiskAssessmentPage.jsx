import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import SeverityPill from '../../../components/ui/SeverityPill';
import EmptyState from '../../../components/ui/EmptyState';
import { ShieldAlert, Activity, Loader2, AlertCircle, Brain, ShieldCheck, FileText, Stethoscope } from 'lucide-react';
import { getMyReports } from '../../../services/api/reports';

export default function PatientRiskAssessmentPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getMyReports();
      setReports(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load risk assessment data. Please try again later.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestAssessment = reports.length > 0 ? reports[0] : null;

  const getRiskSeverity = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'high';
      case 'medium':
      case 'moderate':
        return 'medium';
      case 'low':
      default:
        return 'low';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Risk Assessment
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Quantitative clinical risk scoring and vulnerability indexing
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/patient/symptoms')}
          className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
        >
          <Activity className="w-4 h-4" />
          <span>Run New Assessment</span>
        </Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card 
            title="Clinical Risk Score Engine" 
            subtitle="Risk Classification Tiers & Definitions"
          >
            <div className="space-y-5">
              <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
                Evaluates risk thresholds based on submitted clinical indicators and diagnostic profile history.
              </p>

              {/* Threshold Scale Reference with Explanations */}
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/80 dark:border-clinical-tealDark/15 space-y-3">
                <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">
                  Clinical Risk Tier Definitions
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white dark:bg-clinical-cardDark border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">LOW RISK</span>
                      <SeverityPill severity="low" />
                    </div>
                    <p className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                      Routine indicators. Self-care, hydration, and monitoring are generally sufficient.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-clinical-cardDark border border-amber-200 dark:border-amber-800/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">MODERATE RISK</span>
                      <SeverityPill severity="medium" />
                    </div>
                    <p className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                      Noticeable symptoms. Non-urgent review by a physician is recommended.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-clinical-cardDark border border-red-200 dark:border-red-800/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">HIGH RISK</span>
                      <SeverityPill severity="high" />
                    </div>
                    <p className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                      Significant clinical severity. Priority appointment with a specialist is strongly advised.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-clinical-cardDark border border-rose-300 dark:border-rose-700/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase">CRITICAL / EMERGENCY</span>
                      <SeverityPill severity="critical" />
                    </div>
                    <p className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                      Acute manifestations requiring immediate medical or emergency facility intervention.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/patient/symptoms')} 
                  className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                >
                  <Activity className="w-4 h-4" />
                  <span>Launch New Risk Assessment</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card title="Current Health Risk Status" subtitle="Active Monitoring Profile">
            {latestAssessment ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">Active Risk Level</span>
                    <SeverityPill severity={getRiskSeverity(latestAssessment.risk_level)} />
                  </div>
                  <div className="text-lg font-extrabold text-clinical-textLight dark:text-clinical-textDark">
                    {latestAssessment.risk_level?.toUpperCase()} RISK
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark">Evaluated Condition</span>
                  </div>
                  <div className="text-sm font-semibold text-clinical-textLight dark:text-clinical-textDark">
                    {latestAssessment.predicted_disease}
                  </div>
                  <div className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                    {new Date(latestAssessment.created_at).toLocaleDateString()}
                  </div>
                </div>

                {latestAssessment.emergency && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-red-600 dark:text-red-400 block">Emergency Status</span>
                      <span className="text-xs text-red-600/80 dark:text-red-400/80">
                        Emergency indicators detected in latest assessment
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/patient/appointments')} 
                    className="w-full gap-2 justify-center bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Consult Certified Doctor</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/patient/reports')} 
                    className="w-full gap-2 justify-center"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Full Clinical Report</span>
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState 
                icon={ShieldAlert}
                title="No assessment available"
                description="Complete a risk assessment to calculate your clinical score."
                actionLabel="Start Assessment"
                onActionClick={() => navigate('/patient/symptoms')}
                className="py-8"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
