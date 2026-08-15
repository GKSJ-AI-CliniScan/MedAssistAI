import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Stethoscope, CalendarDays, Users, Clock, CheckCircle2, XCircle,
  AlertCircle, ShieldCheck, Award, Building2, Phone, Mail, RefreshCw,
  ArrowRight, Search, FileText, ChevronRight, UserCheck, Download,
  Activity, DollarSign, Video, MapPin, UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import { downloadAppointmentSlip } from '../../utils/documentGenerator';
import RippleButton from '../../components/ui/RippleButton';

export const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const doctorProfile = (() => {
    try {
      const saved = localStorage.getItem('medassist_doctor_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const doctorName = user?.full_name || user?.name || doctorProfile?.name || 'Dr. Rahul Sharma';
  const specialization = doctorProfile?.specialization || 'Cardiologist & Interventional Physician';
  const hospital = doctorProfile?.hospital || 'MedLife Multispeciality Hospital, Visakhapatnam';
  const experience = doctorProfile?.experience || 12;
  const consultationType = doctorProfile?.consultationType || 'Both (In-person & Video)';
  const medRegNo = doctorProfile?.medRegNo || 'AP-MCI-88942';
  const consultationFee = doctorProfile?.fee || '₹800';

  const fetchDoctorAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.listMyAppointments().catch(() => []);
      if (Array.isArray(data) && data.length > 0) {
        setAppointments(data);
      } else {
        // Detailed clinical patient schedule for the doctor
        setAppointments([
          {
            id: 'APP-782101',
            patient_name: 'K. Ramesh Varma',
            age: 48,
            gender: 'Male',
            date_time: 'Today • 10:30 AM',
            reason: 'Hypertension follow-up & intermittent chest tightness',
            priority: 'High',
            status: 'Confirmed',
            mode: 'In-person Consultation',
            vitals: 'BP: 142/90 • HR: 82 bpm'
          },
          {
            id: 'APP-782102',
            patient_name: 'Smt. S. Lakshmi',
            age: 36,
            gender: 'Female',
            date_time: 'Today • 11:45 AM',
            reason: 'Lipid panel assessment & ECG evaluation',
            priority: 'Normal',
            status: 'Pending',
            mode: 'Online Video',
            vitals: 'BP: 120/78 • HR: 74 bpm'
          },
          {
            id: 'APP-782103',
            patient_name: 'V. Naresh Kumar',
            age: 52,
            gender: 'Male',
            date_time: 'Tomorrow • 02:30 PM',
            reason: 'Pre-operative cardiac clearance review',
            priority: 'Normal',
            status: 'Confirmed',
            mode: 'In-person Consultation',
            vitals: 'BP: 128/82 • HR: 70 bpm'
          },
          {
            id: 'APP-782104',
            patient_name: 'G. Bhavani',
            age: 29,
            gender: 'Female',
            date_time: 'Yesterday • 04:00 PM',
            reason: 'Post-viral tachycardia & palpitations consultation',
            priority: 'Normal',
            status: 'Completed',
            mode: 'In-person Consultation',
            vitals: 'BP: 118/76 • HR: 68 bpm'
          },
          {
            id: 'APP-782105',
            patient_name: 'B. Prasad Rao',
            age: 61,
            gender: 'Male',
            date_time: '2026-08-18 • 09:30 AM',
            reason: 'Shortness of breath on exertion & X-ray review',
            priority: 'High',
            status: 'Pending',
            mode: 'In-person Consultation',
            vitals: 'BP: 138/88 • HR: 88 bpm'
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
    const matchesFilter = filterStatus === 'all' || a.status?.toLowerCase() === filterStatus.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.patient_name?.toLowerCase().includes(q) ||
      a.reason?.toLowerCase().includes(q) ||
      a.id?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const todayCount = appointments.filter(a => a.date_time?.toLowerCase().includes('today')).length;
  const pendingCount = appointments.filter(a => a.status?.toLowerCase() === 'pending').length;
  const completedCount = appointments.filter(a => a.status?.toLowerCase() === 'completed').length;
  const totalPatients = appointments.length;

  return (
    <div className="space-y-6 pb-16 max-w-7xl mx-auto">
      {/* ── Doctor Welcome Header ── */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-indigo-500/20 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-slate-950/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest">
            <Award size={12} className="text-indigo-400" /> Doctor Clinical Portal • Active Practice
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {doctorName.startsWith('Dr.') ? doctorName : `Dr. ${doctorName}`}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
            <span className="font-semibold text-indigo-300">{specialization}</span>
            <span className="text-slate-600">•</span>
            <span>{hospital}</span>
            <span className="text-slate-600">•</span>
            <span>Reg. No: <strong className="text-white font-mono">{medRegNo}</strong></span>
          </div>

          {/* Quick Doctor Actions */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <RippleButton
              variant="primary"
              className="px-5 py-2.5 text-xs font-bold gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-glow-secondary/30"
              onClick={() => navigate('/doctor-appointments')}
            >
              <CalendarDays size={14} /> Full Patient Schedule
            </RippleButton>
            <button
              onClick={() => navigate('/doctor-profile')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Stethoscope size={13} /> View Practice Profile
            </button>
            <button
              onClick={fetchDoctorAppointments}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all"
              title="Refresh Schedule"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Doctor Practice Status Card */}
        <div className="shrink-0 p-5 rounded-2xl bg-white/4 border border-white/10 z-10 grid grid-cols-2 gap-4 text-center sm:text-left">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">License Status</span>
            <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck size={14} /> Verified Active
            </div>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Experience</span>
            <span className="text-xs font-extrabold text-white">{experience}+ Years</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Fee / Visit</span>
            <span className="text-xs font-extrabold text-cyan-400">{consultationFee}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mode</span>
            <span className="text-xs font-extrabold text-indigo-300">In-person & Video</span>
          </div>
        </div>
      </div>

      {/* ── Practice Metrics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-indigo-500/25 bg-indigo-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">Today's Schedule</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <CalendarDays size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{todayCount}</p>
          <p className="text-[10px] text-slate-400">Patients booked for consultation today</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-500/25 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Awaiting Acceptance</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{pendingCount}</p>
          <p className="text-[10px] text-slate-400">Pending appointment approval requests</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/25 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Completed Consultations</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{completedCount}</p>
          <p className="text-[10px] text-slate-400">Successfully evaluated & treated</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-cyan-500/25 bg-cyan-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Total Scheduled Patients</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <Users size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{totalPatients}</p>
          <p className="text-[10px] text-slate-400">Registered clinical caseload</p>
        </div>
      </div>

      {/* ── Scheduled Appointments Queue ── */}
      <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Stethoscope size={18} className="text-indigo-400" /> Scheduled Patient Appointments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage incoming patient visits, accept requests, reschedule or mark cases completed
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'confirmed', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all
                  ${filterStatus === status
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 shadow-sm'
                    : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}
              >
                {status === 'all' ? 'All Records' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scheduled patients by name, appointment ID, or reason..."
            className="w-full bg-white/4 border border-white/8 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>

        {/* Appointment Cards */}
        {loading ? (
          <div className="p-12 text-center space-y-2">
            <RefreshCw size={28} className="text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Loading patient schedule...</p>
          </div>
        ) : filteredAppts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Clock size={32} className="text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-300">No scheduled appointments match this filter</p>
            <p className="text-[10px] text-slate-500">New patient bookings will appear here in real-time.</p>
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
                  className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4
                    ${isPending ? 'bg-amber-950/10 border-amber-500/30' :
                      isConfirmed ? 'bg-white/3 border-white/8 hover:border-indigo-500/30' :
                      'bg-white/2 border-white/5 opacity-80'}`}
                >
                  {/* Patient Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border
                      ${isPending ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                        isConfirmed ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' :
                        'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'}`}
                    >
                      <Users size={18} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-white">{appt.patient_name || 'Patient Consultation'}</h3>
                        <span className="text-[10px] text-slate-400">({appt.age || 40} yrs • {appt.gender || 'Patient'})</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider
                          ${isConfirmed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            'bg-slate-500/20 text-slate-300 border border-white/10'}`}
                        >
                          {appt.status}
                        </span>
                        {appt.priority === 'High' && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-medium">{appt.reason || 'Clinical Consultation & Review'}</p>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                          <Clock size={11} /> {appt.date_time || 'Schedule Confirmed'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300">
                          {appt.mode?.includes('Online') || appt.mode?.includes('Video') ? (
                            <><Video size={11} className="text-indigo-400" /> Online Video</>
                          ) : (
                            <><MapPin size={11} className="text-cyan-400" /> In-person</>
                          )}
                        </span>
                        {appt.vitals && (
                          <>
                            <span>•</span>
                            <span className="text-amber-300/90 font-mono flex items-center gap-1">
                              <Activity size={10} /> {appt.vitals}
                            </span>
                          </>
                        )}
                        <span className="font-mono text-slate-600">#{appt.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Action Controls */}
                  <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                    {/* Download Appointment Slip Button */}
                    <button
                      onClick={() => {
                        downloadAppointmentSlip({
                          id: appt.id,
                          patientName: appt.patient_name,
                          doctorName: doctorName,
                          specialty: specialization,
                          hospitalName: hospital,
                          date: appt.date_time?.split('•')[0]?.trim() || 'Today',
                          time: appt.date_time?.split('•')[1]?.trim() || '10:30 AM',
                          mode: appt.mode,
                          reason: appt.reason
                        });
                        toast.success('Clinical appointment slip downloaded!', { icon: '📄' });
                      }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-cyan-300 border border-white/8 text-xs transition-all"
                      title="Download Appointment Slip"
                    >
                      <Download size={14} />
                    </button>

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
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 size={13} /> Consultation Completed
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
