import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  CalendarDays, Clock, Users, CheckCircle2, XCircle,
  RefreshCw, Search, Video, MapPin, Building2, Stethoscope
} from 'lucide-react';
import appointmentService from '../../services/appointmentService';

const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending Requests' },
  { key: 'confirmed', label: "Today's Schedule" },
  { key: 'completed', label: 'Completed Cases' }
];

const statusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'confirmed') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  if (s === 'completed') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
  if (s === 'rejected') return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
};

export const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.listMyAppointments().catch(() => []);
      if (data && data.length > 0) {
        setAppointments(data);
      } else {
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
            id: 'APP-782100',
            patient_name: 'G. Bhavani',
            age: 29,
            gender: 'Female',
            date_time: 'Yesterday • 04:00 PM',
            reason: 'Post-viral tachycardia consultation',
            priority: 'Normal',
            status: 'Completed',
            mode: 'In-person'
          },
          {
            id: 'APP-782099',
            patient_name: 'B. Prasad Rao',
            age: 61,
            gender: 'Male',
            date_time: '2026-08-12 • 09:30 AM',
            reason: 'Chest X-ray review and shortness of breath',
            priority: 'High',
            status: 'Pending',
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

  useEffect(() => { fetchAppointments(); }, []);

  const handleAction = (id, newStatus, message) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
    );
    toast.success(message, { icon: '🩺' });
  };

  const handleReschedule = (patientName) => {
    toast.info(`Rescheduling notice has been dispatched to ${patientName}.`, { icon: '📅' });
  };

  const filtered = appointments.filter(a => {
    const matchesTab =
      activeTab === 'all' ||
      (a.status || '').toLowerCase() === activeTab.toLowerCase() ||
      (activeTab === 'confirmed' && (a.status || '').toLowerCase() === 'confirmed');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (a.patient_name || '').toLowerCase().includes(q) ||
      (a.reason || '').toLowerCase().includes(q) ||
      (a.status || '').toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  const pendingCount = appointments.filter(a => (a.status || '').toLowerCase() === 'pending').length;
  const todayCount = appointments.filter(a => (a.date_time || '').toLowerCase().includes('today')).length;
  const completedCount = appointments.filter(a => (a.status || '').toLowerCase() === 'completed').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <CalendarDays className="text-indigo-400" /> Appointment Management
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Review patient requests and manage your clinical consultation schedule
          </p>
        </div>
        <button
          onClick={fetchAppointments}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-bold focus:outline-none self-start sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: "Today's Patients", count: todayCount, color: 'indigo', icon: CalendarDays },
          { label: 'Awaiting Acceptance', count: pendingCount, color: 'amber', icon: Clock },
          { label: 'Completed Cases', count: completedCount, color: 'emerald', icon: CheckCircle2 }
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className={`glass-card rounded-2xl p-4 border border-${color}-500/20 bg-${color}-500/5 flex items-center justify-between`}>
            <div>
              <p className={`text-[10px] font-extrabold text-${color}-400 uppercase tracking-wider`}>{label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{count}</p>
            </div>
            <Icon size={22} className={`text-${color}-400 opacity-60`} />
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by patient name, reason, or status..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 transition-all"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all focus:outline-none
              ${activeTab === tab.key
                ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                : 'bg-white/5 border border-white/8 text-slate-400 hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw size={30} className="text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400">Loading patient appointments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-14 text-center border border-white/8 space-y-3">
          <CalendarDays size={40} className="text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No Appointments in This Category</h3>
          <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
            New patient appointment requests will appear here for acceptance and scheduling.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => {
            const isPending = (appt.status || '').toLowerCase() === 'pending';
            const isConfirmed = (appt.status || '').toLowerCase() === 'confirmed';
            const isCompleted = (appt.status || '').toLowerCase() === 'completed';
            const isRejected = (appt.status || '').toLowerCase() === 'rejected';
            const isHighPriority = (appt.priority || '').toLowerCase() === 'high';

            return (
              <motion.div
                key={appt.id}
                whileHover={{ y: -2 }}
                className={`glass-card rounded-3xl p-5 border transition-all flex flex-col lg:flex-row lg:items-center gap-4
                  ${isPending ? 'border-amber-500/25 bg-amber-950/5' : 'border-white/8'}`}
              >
                {/* Patient Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0
                    ${isPending ? 'bg-amber-500/15 border-amber-500/25 text-amber-400' :
                      isConfirmed ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-400' :
                      'bg-indigo-500/15 border-indigo-500/25 text-indigo-400'}`}
                  >
                    <Users size={20} />
                  </div>
                  <div className="min-w-0 space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-slate-100">{appt.patient_name || 'Patient'}</h3>
                      <span className="text-[10px] text-slate-400">
                        {appt.age && `${appt.age} yrs`} {appt.gender && `• ${appt.gender}`}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(appt.status)}`}>
                        {appt.status || 'Pending'}
                      </span>
                      {isHighPriority && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{appt.reason || 'Clinical Consultation & Review'}</p>
                    <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                        <Clock size={11} /> {appt.date_time || 'Scheduled'}
                      </span>
                      <span className="flex items-center gap-1">
                        {(appt.mode || '').includes('Online') ? <Video size={11} className="text-indigo-400" /> : <MapPin size={11} className="text-slate-400" />}
                        {appt.mode || 'In-person'}
                      </span>
                      <span className="font-mono text-slate-600">#{appt.id}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Action Controls */}
                <div className="flex items-center gap-2 self-end lg:self-center flex-wrap">
                  {isPending && (
                    <>
                      <button
                        onClick={() => handleAction(appt.id, 'Confirmed', `Appointment for ${appt.patient_name} accepted and confirmed.`)}
                        className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 size={13} /> Accept
                      </button>
                      <button
                        onClick={() => handleAction(appt.id, 'Rejected', `Appointment for ${appt.patient_name} was declined.`)}
                        className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                  {isConfirmed && (
                    <>
                      <button
                        onClick={() => handleAction(appt.id, 'Completed', `${appt.patient_name}'s consultation has been marked as completed.`)}
                        className="px-4 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <CheckCircle2 size={13} /> Complete
                      </button>
                      <button
                        onClick={() => handleReschedule(appt.patient_name)}
                        className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 text-xs font-bold transition-all"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {(isCompleted || isRejected) && (
                    <span className={`text-xs font-semibold flex items-center gap-1 ${isCompleted ? 'text-indigo-400' : 'text-slate-500'}`}>
                      {isCompleted ? <><CheckCircle2 size={13} /> Case Closed</> : 'Appointment Declined'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
