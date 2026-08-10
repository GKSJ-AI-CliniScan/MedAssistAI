import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, User, Check, Search, Calendar, Plus,
  ShieldCheck, Video, MapPin, Trash2, RefreshCw, AlertCircle
} from 'lucide-react';
import RippleButton from '../../components/ui/RippleButton';
import { toast } from 'react-toastify';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedType, setSelectedType] = useState('Virtual Consultation');
  const [searchQuery, setSearchQuery] = useState('');
  const [patientName, setPatientName] = useState('');
  const [priority, setPriority] = useState('Normal');

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [apptsData, docsData] = await Promise.all([
        appointmentService.listMyAppointments().catch(() => []),
        doctorService.listDoctors().catch(() => []),
      ]);
      setAppointments(apptsData || []);
      setDoctors(docsData || []);
      if (docsData && docsData.length > 0) {
        setSelectedDoctor(docsData[0]);
      }
    } catch (err) {
      console.error('Error loading appointments data:', err);
      toast.error('Could not load appointments schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.warning('Please enter the patient name.');
      return;
    }
    if (!selectedTime) {
      toast.warning('Please select a time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        doctor_id: selectedDoctor?.id || null,
        doctor_name: selectedDoctor?.full_name || selectedDoctor?.name || 'Dr. Clinical Specialist',
        doctor_specialty: selectedDoctor?.specialty || 'General Physician',
        date_time: `${selectedDate} ${selectedTime}`,
        priority: priority,
        status: 'Scheduled',
        notes: `Patient: ${patientName.trim()} | Type: ${selectedType}`,
      };

      const created = await appointmentService.createAppointment(payload);
      toast.success('Appointment Scheduled Successfully!', { icon: '📅' });
      setAppointments((prev) => [created, ...prev]);
      setPatientName('');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err?.response?.data?.detail || 'Failed to schedule appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.info('Appointment cancelled.', { icon: '🗑️' });
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Failed to cancel appointment.');
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      (d.full_name || d.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.specialty || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="text-cyan-400" /> Clinical Appointments Manager
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Real-time consultation scheduling & calendar management</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none flex items-center gap-1.5 text-xs font-bold"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Schedule
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card rounded-3xl p-6 border border-white/8 space-y-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-indigo-650/0 to-transparent pointer-events-none" />

          <div>
            <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <Plus size={18} className="text-cyan-400" /> Schedule New Consultation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Provide patient information and choose doctor slot</p>
          </div>

          <form onSubmit={handleBook} className="space-y-5">
            {/* Patient Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Patient Full Name <span className="text-rose-400">*</span></label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Doctor & Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Consultation Type</label>
                <div className="flex gap-2">
                  {['Virtual Consultation', 'In-Clinic Checkup'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelectedType(t)}
                      className={`flex-1 py-2.5 rounded-xl border text-[11px] font-bold transition-all focus:outline-none flex items-center justify-center gap-1.5
                        ${selectedType === t
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          : 'bg-white/3 border-white/5 text-slate-400 hover:border-white/10'}`}
                    >
                      {t === 'Virtual Consultation' ? <Video size={13} /> : <MapPin size={13} />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300">Select Date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Choose Clinical Specialist</label>
                <div className="relative w-48">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor or specialty..."
                    className="w-full bg-white/3 border border-white/8 rounded-lg py-1.5 pl-7 pr-3 text-[10px] text-slate-300 outline-none focus:border-cyan-500/30 transition-all"
                  />
                </div>
              </div>

              {filteredDoctors.length === 0 ? (
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-center text-xs text-slate-400">
                  No registered doctors match search query. Default specialist will be assigned.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {filteredDoctors.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id;
                    const docName = doc.full_name || doc.name || 'Doctor';
                    const initials = docName.split(' ').map((n) => n[0]).join('').substring(0, 2);

                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedDoctor(doc)}
                        className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all focus:outline-none relative group
                          ${isSelected
                            ? 'bg-gradient-to-tr from-cyan-500/10 to-indigo-650/5 border-cyan-500/30 text-cyan-300'
                            : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/5'}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-200">
                          {initials}
                        </div>
                        <span className="text-[11px] font-extrabold truncate text-slate-200 mt-1">{docName}</span>
                        <span className="text-[9px] opacity-75 truncate">{doc.specialty || 'Physician'}</span>
                        {isSelected && <Check size={12} className="absolute top-3 right-3 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" /> Available Time Slot
              </label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-2 rounded-xl border text-[10px] font-extrabold tracking-wide transition-all focus:outline-none
                      ${selectedTime === slot
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                        : 'bg-white/3 border-white/5 text-slate-400 hover:border-white/10'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <RippleButton
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full py-3.5 text-xs font-bold rounded-xl mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Confirming Slot...
                </>
              ) : (
                'Schedule Consultation Slot'
              )}
            </RippleButton>
          </form>
        </motion.div>

        {/* Existing Appointments Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-6 border border-white/8 space-y-6 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-400" /> Active Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Database registered consultations</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold">
                {appointments.length} Total
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <RefreshCw size={24} className="animate-spin text-cyan-400" />
                <p className="text-xs text-slate-400">Loading scheduled slots...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/3 border border-white/5 text-center space-y-3 my-4">
                <AlertCircle size={32} className="text-slate-600 mx-auto" />
                <div>
                  <p className="text-sm font-bold text-slate-300">No Appointments Scheduled</p>
                  <p className="text-xs text-slate-550 mt-1">Book your first consultation slot using the form on the left.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-4 rounded-2xl bg-white/3 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-200">
                          {appt.doctor_name || appt.doctor || 'Doctor Consultation'}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{appt.notes || appt.doctor_specialty || 'General Health'}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border
                          ${(appt.status || 'Scheduled') === 'Confirmed' || appt.status === 'Scheduled'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                          {appt.status || 'Scheduled'}
                        </span>
                        <button
                          onClick={() => handleCancel(appt.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Cancel appointment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} className="text-cyan-400" />
                        {appt.date_time || appt.date || 'Today'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} className="text-indigo-400" />
                        {appt.priority || 'Normal Priority'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
