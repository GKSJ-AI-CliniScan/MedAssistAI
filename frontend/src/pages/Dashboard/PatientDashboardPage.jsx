import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope, CalendarDays, FileText, User, HeartPulse, ShieldAlert,
  Sparkles, History, Pill, Bell, ArrowRight, Activity, Clock, CheckCircle2,
  AlertCircle, Building2, MapPin, Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import appointmentService from '../../services/appointmentService';
import { downloadHealthSummaryPdf } from '../../utils/documentGenerator';
import RippleButton from '../../components/ui/RippleButton';

export const PatientDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientProfile = (() => {
    try {
      const saved = localStorage.getItem('medassist_patient_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const displayName = user?.full_name || user?.name || patientProfile?.name || 'Patient';
  const firstName = displayName.split(' ')[0];
  const bloodGroup = patientProfile?.bloodGroup || 'O+';
  const conditions = patientProfile?.conditions || 'None Recorded';
  const medications = patientProfile?.medications || 'None Active';

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const data = await appointmentService.listMyAppointments();
        setAppointments(data || []);
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  const upcomingAppt = appointments.length > 0 ? appointments[0] : null;

  const quickActions = [
    { label: 'Symptom Analysis', path: '/symptom-analysis', icon: Stethoscope, color: 'cyan', desc: 'AI-driven multi-symptom triage' },
    { label: 'Find a Doctor', path: '/appointments', icon: User, color: 'indigo', desc: 'Search certified specialists' },
    { label: 'Hospitals Directory', path: '/hospitals', icon: Building2, color: 'purple', desc: 'Browse hospitals across AP' },
    { label: 'Book Appointment', path: '/appointments', icon: CalendarDays, color: 'violet', desc: 'Schedule hospital visit' },
    { label: 'Medical History', path: '/medical-history', icon: History, color: 'emerald', desc: 'Past records & diagnoses' },
    { label: 'Health Reports', path: '/reports', icon: FileText, color: 'amber', desc: 'Download clinical PDF summaries' },
    { label: 'My Appointments', path: '/my-appointments', icon: Clock, color: 'teal', desc: 'Manage scheduled visits' },
    { label: 'Notifications', path: '/notifications', icon: Bell, color: 'rose', desc: 'Clinical alerts & reminders' },
    { label: 'Patient Profile', path: '/patient-profile', icon: User, color: 'sky', desc: 'Manage health background' }
  ];

  return (
    <div className="space-y-6 pb-14">
      {/* ── Welcome Banner ── */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-indigo-650/5 to-transparent pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <div className="space-y-3 max-w-2xl z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest">
            <Sparkles size={11} className="animate-pulse" /> Patient Health Portal Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Monitor your personal vitals, analyze multiple symptoms with AI diagnostic models, and schedule direct consultations with accredited hospital specialists.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-2">
            <RippleButton
              variant="primary"
              className="px-5 py-2.5 text-xs font-bold gap-2"
              onClick={() => navigate('/symptom-analysis')}
            >
              <Stethoscope size={14} /> Start Symptom Analysis
            </RippleButton>
            <RippleButton
              variant="outline"
              className="px-5 py-2.5 text-xs font-bold gap-2"
              onClick={() => navigate('/appointments')}
            >
              <CalendarDays size={14} /> Book Doctor Appointment
            </RippleButton>
            <button
              onClick={() => {
                downloadHealthSummaryPdf({
                  name: displayName,
                  bloodGroup,
                  conditions,
                  medications,
                  age: patientProfile?.age || 28,
                  gender: patientProfile?.gender || 'Female',
                  city: patientProfile?.city || 'Andhra Pradesh',
                  emergencyContact: patientProfile?.emergencyContact || 'Family Contact'
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Download Complete Health Record PDF"
            >
              <FileText size={14} /> Download Health Record (PDF)
            </button>
          </div>
        </div>

        <div className="shrink-0 p-5 rounded-2xl bg-white/3 border border-white/8 z-10 text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Health Status</span>
          <div className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 size={18} /> Optimal
          </div>
          <span className="text-[10px] text-slate-500 block">Last checked: Today</span>
        </div>
      </div>

      {/* ── Health Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Blood Group */}
        <div className="glass-card rounded-2xl p-4.5 border border-cyan-500/20 bg-cyan-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">Blood Group</span>
            <HeartPulse size={16} className="text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{bloodGroup}</p>
          <p className="text-[10px] text-slate-400">Universal compatibility profile</p>
        </div>

        {/* Card 2: Recent Symptoms */}
        <div className="glass-card rounded-2xl p-4.5 border border-indigo-500/20 bg-indigo-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider">Recent Symptoms</span>
            <Activity size={16} className="text-indigo-400" />
          </div>
          <p className="text-sm font-bold text-white line-clamp-1">Headache, Mild Fatigue</p>
          <p className="text-[10px] text-slate-400">Analyzed 2 days ago</p>
        </div>

        {/* Card 3: Upcoming Appointment */}
        <div className="glass-card rounded-2xl p-4.5 border border-purple-500/20 bg-purple-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider">Upcoming Visit</span>
            <CalendarDays size={16} className="text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white truncate">
            {upcomingAppt ? upcomingAppt.doctor_name || 'Dr. Consultation' : 'None Scheduled'}
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {upcomingAppt ? upcomingAppt.date_time || 'Scheduled' : 'Book with specialist'}
          </p>
        </div>

        {/* Card 4: Recent Diagnosis */}
        <div className="glass-card rounded-2xl p-4.5 border border-amber-500/20 bg-amber-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Conditions</span>
            <ShieldAlert size={16} className="text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white line-clamp-1">{conditions}</p>
          <p className="text-[10px] text-slate-400">Documented in profile</p>
        </div>

        {/* Card 5: Current Medications */}
        <div className="glass-card rounded-2xl p-4.5 border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">Medications</span>
            <Pill size={16} className="text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white line-clamp-1">{medications}</p>
          <p className="text-[10px] text-slate-400">Active prescriptions</p>
        </div>
      </div>

      {/* ── Upcoming Appointment & Quick Actions Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Clinical Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-cyan-400" /> Patient Quick Actions
            </h2>
            <span className="text-xs text-slate-500">Access key clinical services</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.label}
                  whileHover={{ y: -3 }}
                  onClick={() => navigate(action.path)}
                  className="glass-card rounded-2xl p-4.5 border border-white/8 hover:border-cyan-500/30 bg-white/3 hover:bg-white/5 cursor-pointer transition-all flex items-start gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-extrabold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{action.desc}</p>
                  </div>
                  <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all mt-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Upcoming Appointment Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock size={16} className="text-purple-400" /> Active Appointment
            </h2>
            <button
              onClick={() => navigate('/my-appointments')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              View All
            </button>
          </div>

          {upcomingAppt ? (
            <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-slate-900/40 to-slate-950/80 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                    {upcomingAppt.status || 'Confirmed'}
                  </span>
                  <h3 className="text-base font-black text-white mt-2">{upcomingAppt.doctor_name || 'Dr. Consultation'}</h3>
                  <p className="text-xs text-cyan-400 font-semibold">{upcomingAppt.doctor_specialty || 'General Physician'}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-glow-secondary">
                  <Stethoscope size={18} />
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Building2 size={13} className="text-cyan-400 shrink-0" />
                  <span className="truncate">{upcomingAppt.notes?.includes('Hospital:') ? upcomingAppt.notes.split('Hospital:')[1].split('|')[0].trim() : 'Apollo Care Hospital, Visakhapatnam'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-purple-400 shrink-0" />
                  <span>{upcomingAppt.date_time || 'Schedule Confirmed'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => navigate('/my-appointments')}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 transition-all"
                >
                  Manage Booking
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                <CalendarDays size={22} />
              </div>
              <h3 className="text-xs font-bold text-slate-200">No Active Appointments</h3>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Schedule a consultation with top specialists in Visakhapatnam.
              </p>
              <RippleButton
                variant="primary"
                className="w-full py-2.5 text-xs font-bold"
                onClick={() => navigate('/appointments')}
              >
                Schedule Appointment
              </RippleButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
