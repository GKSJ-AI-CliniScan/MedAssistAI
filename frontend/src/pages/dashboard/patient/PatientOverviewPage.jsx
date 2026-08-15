import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import { 
  Activity, 
  Brain, 
  ShieldAlert, 
  FileText, 
  Calendar, 
  Pill, 
  ArrowRight, 
  HeartPulse, 
  Clock, 
  Stethoscope, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getMyReports } from '../../../services/api/reports';
import { getMyAppointments } from '../../../services/api/appointments';
import { getMyPrescriptions } from '../../../services/api/prescriptions';

export default function PatientOverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [repData, aptData, rxData] = await Promise.all([
        getMyReports().catch(() => []),
        getMyAppointments().catch(() => []),
        getMyPrescriptions().catch(() => []),
      ]);
      setReports(Array.isArray(repData) ? repData : []);
      setAppointments(Array.isArray(aptData) ? aptData : []);
      setPrescriptions(Array.isArray(rxData) ? rxData : []);
    } catch (err) {
      console.error('Error fetching patient dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const latestReport = reports.length > 0 ? reports[0] : null;
  const upcomingApt = appointments.find(a => (a.status || '').toLowerCase() === 'confirmed' || (a.status || '').toLowerCase() === 'pending');
  const activeRxCount = prescriptions.filter(p => (p.status || 'active').toLowerCase() === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#2563EB] via-cyan-700 to-[#061426] text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
              MedAssist AI • Patient Portal
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs text-cyan-100 max-w-xl">
            Access your AI health predictions, active clinical prescriptions, doctor consultations, and certified medical reports.
          </p>
        </div>
        <div className="relative z-10 shrink-0 flex flex-wrap gap-2">
          <Button 
            variant="ai" 
            size="medium"
            onClick={() => navigate('/patient/symptoms')}
            className="gap-2 shadow-lg bg-gradient-to-r from-emerald-500 to-[#06B6D4] text-white border-0"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Symptom Checker</span>
          </Button>
          <Button 
            variant="outline" 
            size="medium"
            onClick={() => navigate('/patient/appointments')}
            className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </Button>
        </div>
      </div>

      {/* Key Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/patient/reports')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Diagnostic Reports</span>
            <FileText className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : reports.length}
          </div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">
            {reports.length > 0 ? 'AI evaluations archived' : 'No evaluations yet'}
          </span>
        </div>

        <div 
          onClick={() => navigate('/patient/appointments')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Appointments</span>
            <Calendar className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : appointments.length}
          </div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">
            {upcomingApt ? `Next: ${upcomingApt.status}` : 'No upcoming visits'}
          </span>
        </div>

        <div 
          onClick={() => navigate('/patient/prescriptions')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Active Medications</span>
            <Pill className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : activeRxCount}
          </div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">
            {activeRxCount > 0 ? 'Prescribed regimens' : 'No active prescriptions'}
          </span>
        </div>

        <div 
          onClick={() => navigate('/patient/risk')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Health Status</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-clinical-textLight dark:text-clinical-textDark truncate">
            {latestReport ? `${latestReport.risk_level || 'Evaluated'} Risk` : 'Ready'}
          </div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">
            {latestReport ? `Confidence: ${latestReport.confidence?.toFixed(1)}%` : 'Perform assessment'}
          </span>
        </div>
      </div>

      {/* Primary Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Actions & Modules */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Navigator */}
          <Card title="Clinical Modules" subtitle="Direct patient workflows">
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/patient/symptoms')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec hover:bg-cyan-50 dark:hover:bg-cyan-950/20 text-left transition-colors border border-slate-200/60 dark:border-clinical-tealDark/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#06B6D4]/10 text-[#06B6D4]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">Symptom Checker</span>
                    <span className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark">AI multi-symptom diagnosis</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
              </button>

              <button 
                onClick={() => navigate('/patient/appointments')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec hover:bg-blue-50 dark:hover:bg-blue-950/20 text-left transition-colors border border-slate-200/60 dark:border-clinical-tealDark/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">Physician Appointments</span>
                    <span className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark">Consult certified doctors</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
              </button>

              <button 
                onClick={() => navigate('/patient/prescriptions')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-left transition-colors border border-slate-200/60 dark:border-clinical-tealDark/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">Medications & Regimens</span>
                    <span className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark">Dosage & instructions</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
              </button>

              <button 
                onClick={() => navigate('/patient/reports')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec hover:bg-purple-50 dark:hover:bg-purple-950/20 text-left transition-colors border border-slate-200/60 dark:border-clinical-tealDark/20"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-600">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">Diagnostic Reports</span>
                    <span className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark">Download printable records</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Latest Clinical Activity & Intelligence */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Latest AI Assessment Result */}
          <Card 
            title="Latest Diagnostic Assessment" 
            subtitle="AI prediction engine findings"
          >
            {latestReport ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-[#06B6D4]" />
                      <span className="text-base font-bold text-clinical-textLight dark:text-clinical-textDark">
                        {latestReport.predicted_disease}
                      </span>
                    </div>
                    <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                      Analyzed on {new Date(latestReport.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      latestReport.risk_level === 'High' || latestReport.risk_level === 'Critical'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}>
                      {latestReport.risk_level} Risk
                    </span>
                    <span className="text-xs font-semibold text-[#06B6D4] block mt-1">
                      {latestReport.confidence?.toFixed(1)}% Confidence
                    </span>
                  </div>
                </div>

                {latestReport.recommendations && (
                  <div className="p-3.5 rounded-xl bg-white/60 dark:bg-black/20 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark block mb-1">
                      Clinical Recommendations:
                    </span>
                    <p className="text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
                      {latestReport.recommendations}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <Button 
                    variant="outline" 
                    size="small" 
                    onClick={() => navigate('/patient/reports')}
                    className="gap-2 text-xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Full Clinical Report</span>
                  </Button>
                  <Button 
                    variant="primary" 
                    size="small" 
                    onClick={() => navigate('/patient/appointments')}
                    className="gap-2 text-xs bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Consult Doctor Regarding This</span>
                  </Button>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Brain}
                title="No diagnostic assessments yet"
                description="Use the symptom checker to run your first AI medical assessment."
                actionLabel="Start Symptom Checker"
                onActionClick={() => navigate('/patient/symptoms')}
                className="py-8"
              />
            )}
          </Card>

          {/* Upcoming Consultation Snapshot */}
          <Card title="Next Consultation" subtitle="Physician appointment schedule">
            {upcomingApt ? (
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-[#06B6D4]" />
                    <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                      {upcomingApt.doctor?.user?.fullname || `Doctor #${upcomingApt.doctor_id}`}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] font-semibold">
                      {upcomingApt.doctor?.specialization || 'General Medicine'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                    <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                    <span>{new Date(upcomingApt.appointment_date).toLocaleString()}</span>
                    <span>•</span>
                    <span>Reason: {upcomingApt.reason || 'Consultation'}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="small"
                  onClick={() => navigate('/patient/appointments')}
                >
                  Manage
                </Button>
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming consultations"
                description="Book a consultation with certified doctors across Cardiology, Neurology, Pediatrics, and more."
                actionLabel="Book Appointment"
                onActionClick={() => navigate('/patient/appointments')}
                className="py-6"
              />
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
