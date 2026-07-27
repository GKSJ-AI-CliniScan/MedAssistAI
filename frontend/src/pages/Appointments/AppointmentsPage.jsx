import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Clock, User, Check, Search, Calendar, Plus, ShieldCheck, Video, MapPin, X } from 'lucide-react';
import RippleButton from '../../components/ui/RippleButton';
import { toast } from 'react-toastify';

const mockDoctors = [
  { id: 'd1', name: 'Dr. Sarah Connor', specialty: 'Cardiologist', rating: '4.9', avatar: 'SC', available: 'Mon, Wed, Fri' },
  { id: 'd2', name: 'Dr. James Carter', specialty: 'Neurologist', rating: '4.8', avatar: 'JC', available: 'Tue, Thu' },
  { id: 'd3', name: 'Dr. Emily Stone', specialty: 'Endocrinologist', rating: '4.7', avatar: 'ES', available: 'Mon, Tue, Thu' },
  { id: 'd4', name: 'Dr. Robert Chen', specialty: 'Pediatrician', rating: '4.9', avatar: 'RC', available: 'Wed, Fri' }
];

const mockAppointments = [
  { id: 'a1', patient: 'Liam Nelson', doctor: 'Dr. Sarah Connor', time: '10:00 AM', date: '2026-07-20', type: 'Virtual Consultation', status: 'Confirmed' },
  { id: 'a2', patient: 'Emma Watson', doctor: 'Dr. Emily Stone', time: '02:30 PM', date: '2026-07-21', type: 'In-Clinic Checkup', status: 'Pending' },
  { id: 'a3', patient: 'Olivia Smith', doctor: 'Dr. Robert Chen', time: '09:15 AM', date: '2026-07-22', type: 'Virtual Consultation', status: 'Confirmed' }
];

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDoctor, setSelectedDoctor] = useState(mockDoctors[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('2026-07-20');
  const [selectedType, setSelectedType] = useState('Virtual Consultation');
  const [searchQuery, setSearchQuery] = useState('');
  const [patientName, setPatientName] = useState('');

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleBook = (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.warning('Please enter patient name.');
      return;
    }
    if (!selectedTime) {
      toast.warning('Please select a time slot.');
      return;
    }
    const newAppointment = {
      id: `a_${Date.now()}`,
      patient: patientName,
      doctor: selectedDoctor.name,
      time: selectedTime,
      date: selectedDate,
      type: selectedType,
      status: 'Confirmed'
    };
    setAppointments([newAppointment, ...appointments]);
    setPatientName('');
    setSelectedTime('');
    toast.success('Appointment Scheduled Successfully!', { icon: '📅' });
  };

  const filteredDoctors = mockDoctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <CalendarDays className="text-cyan-400" /> Schedule Appointments
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Clinical consultation scheduling manager</p>
        </div>
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
              <Plus size={18} className="text-cyan-400" /> New Appointment Booking
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Fill patient details and select slot below</p>
          </div>

          <form onSubmit={handleBook} className="space-y-5">
            {/* Patient Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-350">Patient Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="Enter full name of patient..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Doctor & Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-350">Consultation Type</label>
                <div className="flex gap-2">
                  {['Virtual Consultation', 'In-Clinic Checkup'].map(t => (
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
                <label className="text-xs font-semibold text-slate-350">Select Appointment Date</label>
                <div className="relative">
                  <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-200 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Doctor Picker */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-350">Choose Clinical Doctor</label>
                <div className="relative w-48">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-550" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search specialty..."
                    className="w-full bg-white/3 border border-white/8 rounded-lg py-1.5 pl-7 pr-3 text-[10px] text-slate-300 outline-none focus:border-cyan-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {filteredDoctors.map(doc => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-3 rounded-2xl border text-left flex flex-col gap-1 transition-all focus:outline-none relative group
                      ${selectedDoctor.id === doc.id
                        ? 'bg-gradient-to-tr from-cyan-500/10 to-indigo-650/5 border-cyan-500/30 text-cyan-300'
                        : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/5'}`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-200">
                      {doc.avatar}
                    </div>
                    <span className="text-[11px] font-extrabold truncate text-slate-200 mt-1">{doc.name}</span>
                    <span className="text-[9px] opacity-75 truncate">{doc.specialty}</span>
                    {selectedDoctor.id === doc.id && <Check size={12} className="absolute top-3 right-3 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-350 flex items-center gap-1.5">
                <Clock size={13} className="text-cyan-400" /> Available Time Slots
              </label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-4 py-2.5 rounded-xl border text-[10px] font-extrabold tracking-wide transition-all focus:outline-none
                      ${selectedTime === slot
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 shadow-glass-sm'
                        : 'bg-white/3 border-white/5 text-slate-400 hover:border-white/10'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <RippleButton type="submit" variant="primary" className="w-full py-3.5 text-xs font-bold rounded-xl mt-2">
              Schedule Consultation Slot
            </RippleButton>
          </form>
        </motion.div>

        {/* Existing Appointments Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-3xl p-6 border border-white/8 space-y-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
          
          <div>
            <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-400" /> Scheduled Portal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Active consultation schedule</p>
          </div>

          <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
            {appointments.map((appt) => (
              <div key={appt.id} className="p-4 rounded-2xl bg-white/3 border border-white/5 relative overflow-hidden group">
                <div className="flex justify-between items-start gap-2 mb-2.5">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-200">{appt.patient}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{appt.doctor}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border
                    ${appt.status === 'Confirmed'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                    {appt.status}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-slate-450 border-t border-white/3 pt-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={11} className="text-cyan-400" />
                    {appt.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="text-indigo-400" />
                    {appt.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
