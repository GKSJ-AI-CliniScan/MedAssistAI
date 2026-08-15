import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import EmptyState from '../../../components/ui/EmptyState';
import { Users, Calendar, Stethoscope, FileText, Pill, Clock, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getMyAppointments } from '../../../services/api/appointments';
import { getAllPatients } from '../../../services/api/patient';

export default function DoctorOverviewPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, patientsData] = await Promise.all([
        getMyAppointments().catch(() => []),
        getAllPatients(0, 10).catch(() => [])
      ]);
      setAppointments(appointmentsData || []);
      setPatients(patientsData || []);
      setError(null);
    } catch (err) {
      setError('Unable to load dashboard data. Please try again later.');
      console.error('Error fetching dashboard data:', err);
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
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#071821] via-[#0B2430] to-clinical-green text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-clinical-tealDark/20 text-clinical-tealDark border border-clinical-tealDark/30">
              Clinician Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Doctor Overview</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Welcome to the clinician panel. Access your assigned patients, manage appointment schedules, check lab reports, and issue digital prescriptions.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Button 
            variant="primary" 
            size="medium"
            onClick={() => navigate('/doctor/appointments')}
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>View Appointments</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchDashboardData} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200/80 dark:border-clinical-tealDark/15 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark uppercase">Assigned Patients</span>
            <div className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark mt-1">{patients.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-clinical-mint dark:bg-clinical-tealDark/20 text-clinical-green dark:text-clinical-tealDark">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200/80 dark:border-clinical-tealDark/15 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark uppercase">Today's Schedule</span>
            <div className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark mt-1">{appointments.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200/80 dark:border-clinical-tealDark/15 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark uppercase">Lab Reviews</span>
            <div className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark mt-1">Reports Desk</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-clinical-cardDark border border-slate-200/80 dark:border-clinical-tealDark/15 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-clinical-mutedLight dark:text-clinical-mutedDark uppercase">Issued Scripts</span>
            <div className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark mt-1">Digital Rx Desk</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-clinical-violet dark:text-clinical-violetDark">
            <Pill className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card title="Clinical Portal Overview" subtitle="Access your assigned patients, schedules, and medical actions.">
            <div className="space-y-4">
              <p className="text-sm text-clinical-textLight dark:text-clinical-textDark leading-relaxed">
                Welcome to the clinician panel. Access your queue of patient files, manage appointment schedules, check lab/diagnosis reports, and issue medical prescriptions.
              </p>
              
              <div className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200/60 dark:border-clinical-tealDark/15 space-y-3">
                <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark block">Quick Clinician Actions</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button variant="outline" size="small" onClick={() => navigate('/doctor/patients')} className="w-full justify-start gap-2">
                    <Users className="w-4 h-4 text-clinical-green dark:text-clinical-tealDark" />
                    <span>Patient Files</span>
                  </Button>
                  <Button variant="outline" size="small" onClick={() => navigate('/doctor/history')} className="w-full justify-start gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>Patient History</span>
                  </Button>
                  <Button variant="outline" size="small" onClick={() => navigate('/doctor/prescriptions')} className="w-full justify-start gap-2">
                    <Pill className="w-4 h-4 text-purple-500" />
                    <span>Prescriptions</span>
                  </Button>
                </div>
              </div>

              <div>
                <Button variant="primary" onClick={() => navigate('/doctor/appointments')} className="gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span>View Appointments</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card title="Patient Risk Triage" subtitle="Urgent Consultation Queue">
            {appointments.filter(a => a.status === 'pending' || a.status === 'scheduled').length > 0 ? (
              <div className="space-y-2">
                {appointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="p-3 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-clinical-textLight dark:text-clinical-textDark">
                        {appointment.reason || 'Consultation'}
                      </span>
                      <span className="text-[10px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={ShieldAlert}
                title="No patients in urgent triage"
                description="Assigned patient risk assessments will appear here when escalations are logged."
                className="py-6 border-0 shadow-none bg-transparent"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
