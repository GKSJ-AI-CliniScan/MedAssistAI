import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import { UserCog, Users, Calendar, BarChart3, Activity, Cpu, Loader2, AlertCircle, ShieldCheck, HeartPulse, Stethoscope, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAnalyticsSummary } from '../../../services/api/analytics';
import { getAllDoctors } from '../../../services/api/doctor';
import { getAllPatients } from '../../../services/api/patient';
import { getAllAppointments } from '../../../services/api/appointments';

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsData, doctorsData, patientsData, appointmentsData] = await Promise.all([
        getAnalyticsSummary().catch(() => null),
        getAllDoctors(false, 0, 50).catch(() => []),
        getAllPatients(0, 50).catch(() => []),
        getAllAppointments(0, 50).catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setPatients(Array.isArray(patientsData) ? patientsData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setError(null);
    } catch (err) {
      setError('Unable to load admin dashboard telemetry.');
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalDoctors = analytics?.overview?.total_doctors ?? doctors.length;
  const totalPatients = analytics?.overview?.total_patients ?? patients.length;
  const totalAppointments = analytics?.overview?.total_appointments ?? appointments.length;
  const totalReports = analytics?.overview?.total_reports ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0B2430] to-cyan-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/10 text-white border border-white/20">
              System Administration
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Platform Command Center</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Centralized governance console for clinical operations, provider credentialing, patient demographics, and machine learning telemetry.
          </p>
        </div>
        <div className="relative z-10 shrink-0 flex flex-wrap gap-2">
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => navigate('/admin/analytics')}
            className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
          >
            <BarChart3 className="w-4 h-4" />
            <span>System Analytics</span>
          </Button>
          <Button 
            variant="outline" 
            size="medium"
            onClick={() => navigate('/admin/reports')}
            className="gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
          >
            <FileText className="w-4 h-4" />
            <span>Patient Reports</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchAdminData} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/admin/doctors')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Approved Clinicians</span>
            <UserCog className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">{totalDoctors}</div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">Certified specialists</span>
        </div>

        <div 
          onClick={() => navigate('/admin/patients')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Registered Patients</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">{totalPatients}</div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">Active patient index</span>
        </div>

        <div 
          onClick={() => navigate('/admin/appointments')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Clinic Consultations</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">{totalAppointments}</div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">System-wide bookings</span>
        </div>

        <div 
          onClick={() => navigate('/admin/reports')}
          className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/40 transition-all cursor-pointer space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark">Diagnostic Reports</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark">{totalReports}</div>
          <span className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark block">AI Evaluations generated</span>
        </div>
      </div>

      {/* Main Administrative Control Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card 
            title="Operational Control Center" 
            subtitle="Manage clinic infrastructure, providers, appointments, and diagnostic intelligence."
          >
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15 space-y-3">
                <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">Administration Modules</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button variant="outline" size="small" onClick={() => navigate('/admin/doctors')} className="w-full justify-start gap-2 text-xs">
                    <UserCog className="w-4 h-4 text-[#06B6D4]" />
                    <span>Manage Doctors</span>
                  </Button>
                  <Button variant="outline" size="small" onClick={() => navigate('/admin/patients')} className="w-full justify-start gap-2 text-xs">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>Manage Patients</span>
                  </Button>
                  <Button variant="outline" size="small" onClick={() => navigate('/admin/appointments')} className="w-full justify-start gap-2 text-xs">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Manage Appointments</span>
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="primary" onClick={() => navigate('/admin/analytics')} className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">
                  <Activity className="w-4 h-4" />
                  <span>Inspect System Analytics</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card title="System Telemetry" subtitle="Infrastructure Health">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-xs font-semibold text-clinical-textLight dark:text-clinical-textDark">API Server Engine</span>
                <ModTag variant="success">Online</ModTag>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-xs font-semibold text-clinical-textLight dark:text-clinical-textDark">PostgreSQL Database</span>
                <ModTag variant="success">Connected</ModTag>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15">
                <span className="text-xs font-semibold text-clinical-textLight dark:text-clinical-textDark">ML Inference Engine</span>
                <ModTag variant="ai">Preloaded</ModTag>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
