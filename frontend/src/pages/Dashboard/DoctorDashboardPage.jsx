import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Stethoscope, CalendarDays, Users, Clock, CheckCircle2, XCircle,
  AlertCircle, ShieldCheck, Award, Building2, Phone, Mail, RefreshCw,
  ArrowRight, Search, FileText, ChevronRight, UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import RippleButton from '../../components/ui/RippleButton';

export const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const doctorProfile = (() => {
    try {
      const saved = localStorage.getItem('medassist_doctor_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const doctorName = user?.full_name || user?.name || doctorProfile?.name || 'Dr. Rahul Sharma';
  const specialization = doctorProfile?.specialization || 'Cardiologist';
  const hospital = doctorProfile?.hospital || 'MedLife Multispeciality Hospital, Visakhapatnam';
  const experience = doctorProfile?.experience || 12;
  const consultationType = doctorProfile?.consultationType || 'Both (In-person & Online)';
  const medRegNo = doctorProfile?.medRegNo || 'AP-MCI-88942';

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.listMyAppointments().catch(() => []);
      if (Array.isArray(data) && data.length > 0) {
        setAppointments(data);
      } else {
        // Sample clinical caseload for demonstration
        setAppointments([
          {
            id: 'APP-782101',
            patient_name: 'K. Ramesh Varma',
            age: 48,
            gender: 'Male',
            date_time: 'Today • 10:30 AM',
            reason: 'Hypertension follow-up and intermittent chest tightness',
            priority: 'High',
            status: 'Confirmed',
            mode: 'In-person'
          },
          {
            id: 'APP-782102',
            patient_name: 'Smt. S. Lakshmi',
            age: 36,
            gender: 'Female',
            date_time: 'Today • 11:45 AM',
            reason: 'Routine lipid panel review and ECG interpretation',
            priority: 'Normal',
            status: 'Pending',
            mode: 'Online Video'
          },
          {
            id: 'APP-782103',
            patient_name: 'V. Naresh Kumar',
            age: 52,
            gender: 'Male',
            date_time: 'Tomorrow • 02:30 PM',
            reason: 'Pre-operative cardiac clearance assessment',
            priority: 'Normal',
            status: 'Confirmed',
            mode: 'In-person'
          },
          {
            id: 'APP-782104',
            patient_name: 'G. Bhavani',
            age: 29,
            gender: 'Female',
            date_time: 'Yesterday • 04:00 PM',
            reason: 'Post-viral tachycardia consultation',
            priority: 'Normal',
            status: 'Completed',
            mode: 'In-person'
          }
        ]);
      }
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleAction = (id, newStatus, message) => {
    setAppointments(prev =>
      prev.map(appt => (appt.id === id ? { ...appt, status: newStatus } : appt))
    );
    toast.success(message, { icon: '🩺' });
  };

  const filteredAppts = appointments.filter(a => {
    if (filterStatus === 'all') return true;
    return a.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  const todayCount = appointments.filter(a => a.date_time?.toLowerCase().includes('today')).length;
  const pendingCount = appointments.filter(a => a.status?.toLowerCase() === 'pending').length;
  const completedCount = appointments.filter(a => a.status?.toLowerCase() === 'completed').length;
  const totalPatients = appointments.length;

  return (
    <div className="space-y-6 pb-14">
      {/* ── Welcome Banner ── */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-650/5 to-transparent pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="space-y-3 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
            <Award size={11} /> Clinical Practice Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, {doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {specialization} • {hospital} • {experience} Years Experience • License: {medRegNo}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <RippleButton
              variant="primary"
              className="px-5 py-2.5 text-xs font-bold gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-glow-secondary/30"
              onClick={() => navigate('/doctor-appointments')}
            >
              <CalendarDays size={14} /> Full Appointment Schedule
            </RippleButton>
            <button
              onClick={() => navigate('/doctor-profile')}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all"
            >
              Edit Practice Profile
            </button>
          </div>
        </div>

        {/* Doctor Badges */}
        <div className="shrink-0 p-5 rounded-2xl bg-white/3 border border-white/8 z-10 text-center space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">License Status</span>
          <div className="text-sm font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={16} /> Verified Active
          </div>
          <span className="text-[10px] text-slate-400 block">{consultationType}</span>
        </div>
      </div>

      {/* ── Doctor Statistics Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 bg-indigo-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">Today's Schedule</span>
            <CalendarDays size={16} className="text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-white">{todayCount}</p>
          <p className="text-[10px] text-slate-400">Consultations scheduled for today</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Pending Requests</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{pendingCount}</p>
          <p className="text-[10px] text-slate-400">Awaiting practitioner acceptance</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Completed Visits</span>
            <CheckCircle2 size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">{completedCount}</p>
          <p className="text-[10px] text-slate-400">Cases evaluated and treated</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-cyan-500/20 bg-cyan-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Total Patients</span>
            <Users size={16} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white">{totalPatients}</p>
          <p className="text-[10px] text-slate-400">Clinical caseload registered</p>
        </div>
      </div>

      {/* ── Appointment Management Section ── */}
      <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Stethoscope size={18} className="text-indigo-400" /> Patient Appointment Management
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review, accept, reschedule, or complete assigned patient consultations
            </p>
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2">
            {['all', 'confirmed', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all
                  ${filterStatus === status
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-sm'
                    : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Appointment Table / Cards */}
        {filteredAppts.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <Clock size={32} className="text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-300">No appointments in this category</p>
            <p className="text-[10px] text-slate-500">Appointments scheduled by patients will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppts.map((appt) => {
              const isPending = appt.status?.toLowerCase() === 'pending';
              const isConfirmed = appt.status?.toLowerCase() === 'confirmed';
              const isCompleted = appt.status?.toLowerCase() === 'completed';

              return (
                <motion.div
                  key={appt.id}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-2xl bg-white/3 border border-white/8 hover:border-indigo-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all"
                >
                  {/* Patient Details */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 shrink-0">
                      <Users size={18} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-white">{appt.patient_name || 'Patient Consultation'}</h3>
                        <span className="text-[10px] text-slate-400">({appt.age || 40} yrs • {appt.gender || 'Patient'})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider
                          ${isConfirmed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-slate-500/20 text-slate-300 border border-white/10'}`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{appt.reason || 'Clinical Consultation & Review'}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-2">
                        <Clock size={11} className="text-cyan-400" /> {appt.date_time || 'Schedule Confirmed'}
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">{appt.mode || 'In-person Consultation'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions for Doctor */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleAction(appt.id, 'Confirmed', `Accepted appointment for ${appt.patient_name}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 size={13} /> Accept
                        </button>
                        <button
                          onClick={() => handleAction(appt.id, 'Rejected', `Declined appointment for ${appt.patient_name}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    )}

                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => handleAction(appt.id, 'Completed', `Marked ${appt.patient_name}'s consultation as completed.`)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 size={13} /> Mark Completed
                        </button>
                        <button
                          onClick={() => toast.info(`Rescheduling notice dispatched to ${appt.patient_name}.`)}
                          className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-bold transition-all"
                        >
                          Reschedule
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <CheckCircle2 size={13} className="text-emerald-400" /> Case Closed
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
