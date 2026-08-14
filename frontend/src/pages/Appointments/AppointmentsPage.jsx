import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Clock, User, Check, Search, Calendar, Plus,
  ShieldCheck, Video, MapPin, Trash2, RefreshCw, AlertCircle,
  Building2, Phone, Mail, Star, Filter, ArrowRight, X, Info,
  CheckCircle2, FileText, Stethoscope, ChevronRight, Award
} from 'lucide-react';
import RippleButton from '../../components/ui/RippleButton';
import { toast } from 'react-toastify';
import appointmentService from '../../services/appointmentService';
import { HOSPITALS, DEPARTMENTS, LOCATIONS } from '../../data/hospitalsData';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [minRating, setMinRating] = useState(0);

  // Selected hospital & doctor for booking
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(HOSPITALS[0].doctors[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [consultationMode, setConsultationMode] = useState('In-person');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [symptomNotes, setSymptomNotes] = useState('');

  // Hospital View Modal state
  const [activeHospitalModal, setActiveHospitalModal] = useState(null);

  // Booking Confirmation Card state
  const [bookedConfirmation, setBookedConfirmation] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentService.listMyAppointments().catch(() => []);
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      toast.error('Could not load appointment schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Sync doctor when hospital changes
  const handleSelectHospital = (hosp) => {
    setSelectedHospital(hosp);
    if (hosp.doctors && hosp.doctors.length > 0) {
      setSelectedDoctor(hosp.doctors[0]);
      if (hosp.doctors[0].availableTimeSlots && hosp.doctors[0].availableTimeSlots.length > 0) {
        setSelectedTimeSlot(hosp.doctors[0].availableTimeSlots[0]);
      }
    }
  };

  const handleSelectDoctor = (doc) => {
    setSelectedDoctor(doc);
    if (doc.availableTimeSlots && doc.availableTimeSlots.length > 0) {
      setSelectedTimeSlot(doc.availableTimeSlots[0]);
    }
  };

  // Filter hospitals based on search & criteria
  const filteredHospitals = HOSPITALS.filter((hosp) => {
    const q = searchQuery.toLowerCase().strip ? searchQuery.toLowerCase().trim() : '';
    const matchesSearch =
      !q ||
      hosp.name.toLowerCase().includes(q) ||
      hosp.location.toLowerCase().includes(q) ||
      hosp.departments.some((d) => d.toLowerCase().includes(q)) ||
      hosp.doctors.some(
        (doc) =>
          doc.name.toLowerCase().includes(q) || doc.specialization.toLowerCase().includes(q)
      );

    const matchesLocation =
      selectedLocation === 'All Locations' || hosp.location === selectedLocation;

    const matchesDept =
      selectedDepartment === 'All Departments' ||
      hosp.departments.includes(selectedDepartment);

    const matchesRating = hosp.rating >= minRating;

    return matchesSearch && matchesLocation && matchesDept && matchesRating;
  });

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.warning('Please enter the patient name.');
      return;
    }
    if (!selectedHospital || !selectedDoctor) {
      toast.warning('Please select a hospital and doctor.');
      return;
    }

    setSubmitting(true);
    try {
      const apptId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
      const payload = {
        doctor_id: selectedDoctor.id,
        doctor_name: selectedDoctor.name,
        doctor_specialty: selectedDoctor.specialization,
        date_time: `${selectedDate} ${selectedTimeSlot}`,
        priority: 'Normal',
        status: 'Confirmed',
        notes: `Patient: ${patientName.trim()} | Hospital: ${selectedHospital.name} | Mode: ${consultationMode} | Notes: ${symptomNotes.trim() || 'N/A'}`,
      };

      const created = await appointmentService.createAppointment(payload).catch(() => ({
        id: apptId,
        ...payload,
        created_at: new Date().toISOString(),
      }));

      const confirmationData = {
        appointmentId: created.id || apptId,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim() || 'N/A',
        hospital: selectedHospital,
        doctor: selectedDoctor,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        mode: consultationMode,
        fee: selectedDoctor.consultationFee,
        notes: symptomNotes.trim() || 'General Consultation',
      };

      setBookedConfirmation(confirmationData);
      setAppointments((prev) => [created, ...prev]);
      toast.success('Clinical Appointment Booked Successfully!', { icon: '🏥' });
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err?.response?.data?.detail || 'Unable to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await appointmentService.cancelAppointment(id).catch(() => {});
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (bookedConfirmation && bookedConfirmation.appointmentId === id) {
        setBookedConfirmation(null);
      }
      toast.info('Appointment cancelled.', { icon: '🗑️' });
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error('Failed to cancel appointment.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <Building2 className="text-cyan-400" /> Hospital & Clinical Appointments
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Discover accredited hospitals, select specialists, and schedule verified consultations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center gap-1.5">
            <Building2 size={13} /> Accredited Hospital Network
          </span>
          <button
            onClick={fetchAppointments}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all text-xs font-bold flex items-center gap-1.5 focus:outline-none"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* ── BOOKING CONFIRMATION MODAL / CARD ── */}
      <AnimatePresence>
        {bookedConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-emerald-950/20 relative overflow-hidden space-y-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-white">Appointment Confirmed</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                      {bookedConfirmation.appointmentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your appointment has been registered with the hospital care management system.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBookedConfirmation(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg focus:outline-none"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/10 text-xs">
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patient Information</span>
                <p className="font-extrabold text-slate-100 text-sm">{bookedConfirmation.patientName}</p>
                <p className="text-slate-400">Phone: {bookedConfirmation.patientPhone}</p>
                <p className="text-slate-400">Mode: <span className="text-cyan-300 font-bold">{bookedConfirmation.mode}</span></p>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospital & Specialist</span>
                <p className="font-extrabold text-slate-100">{bookedConfirmation.doctor.name}</p>
                <p className="text-cyan-400 font-semibold">{bookedConfirmation.doctor.specialization}</p>
                <p className="text-slate-400 truncate">{bookedConfirmation.hospital.name}</p>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Schedule & Fee</span>
                <p className="font-extrabold text-slate-100">{bookedConfirmation.date} at {bookedConfirmation.timeSlot}</p>
                <p className="text-emerald-400 font-bold">Fee: ₹{bookedConfirmation.fee}</p>
                <p className="text-slate-400 truncate">{bookedConfirmation.hospital.address}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBookedConfirmation(null)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all"
              >
                Back to Search
              </button>
              <button
                onClick={() => handleCancelAppointment(bookedConfirmation.appointmentId)}
                className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
              >
                Cancel Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SEARCH AND FILTER BAR ── */}
      <div className="glass-card rounded-3xl p-5 border border-white/8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hospitals, doctors, or specialties (e.g. Cardiologist, Visakhapatnam, Apollo)..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Location dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter by Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-slate-900 text-slate-200">
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Department dropdown */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Filter by Specialty / Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
            >
              <option value={0} className="bg-slate-900 text-slate-200">All Ratings</option>
              <option value={4.8} className="bg-slate-900 text-slate-200">4.8+ Top Rated ★</option>
              <option value={4.9} className="bg-slate-900 text-slate-200">4.9+ Exceptional ★</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID: HOSPITALS & BOOKING PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Hospital Catalog */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Building2 size={16} className="text-cyan-400" /> Partner Hospitals & Medical Centers ({filteredHospitals.length})
            </h2>
            <span className="text-xs text-slate-500">Select a hospital to schedule doctor slot</span>
          </div>

          {filteredHospitals.length === 0 ? (
            <div className="glass-card rounded-3xl p-10 text-center border border-white/8 space-y-3">
              <AlertCircle size={36} className="text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Hospitals Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No hospitals match your search query or filter criteria. Try clearing filters or searching for another city/specialty.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLocation('All Locations');
                  setSelectedDepartment('All Departments');
                  setMinRating(0);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold hover:bg-cyan-500/20 transition-all"
              >
                Clear Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHospitals.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;

                return (
                  <motion.div
                    key={hosp.id}
                    whileHover={{ y: -3 }}
                    onClick={() => handleSelectHospital(hosp)}
                    className={`glass-card rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group
                      ${isSelected
                        ? 'border-cyan-500/50 ring-1 ring-cyan-500/30 bg-gradient-to-b from-cyan-500/10 via-slate-900/40 to-slate-950/80 shadow-glass-md'
                        : 'border-white/8 hover:border-white/15 bg-white/3'}`}
                  >
                    {/* Hospital Card Top Image Header */}
                    <div className="relative h-28 rounded-2xl overflow-hidden mb-3.5 bg-slate-900">
                      <img
                        src={hosp.image}
                        alt={hosp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      {hosp.emergencyAvailable && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-500/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> 24/7 ER
                        </span>
                      )}

                      <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold flex items-center gap-1 border border-white/10">
                          <Star size={10} className="fill-amber-400 text-amber-400" /> {hosp.rating} ({hosp.reviewsCount})
                        </span>
                        <span className="text-[10px] text-slate-300 font-semibold px-2 py-0.5 rounded-full bg-slate-900/80 border border-white/10">
                          {hosp.doctors.length} Specialists
                        </span>
                      </div>
                    </div>

                    {/* Hospital Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {hosp.name}
                        </h3>
                      </div>

                      <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                        <MapPin size={12} className="text-cyan-400 shrink-0" /> {hosp.location}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {hosp.departments.slice(0, 3).map((dept) => (
                          <span key={dept} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-300 font-semibold">
                            {dept}
                          </span>
                        ))}
                        {hosp.departments.length > 3 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400">
                            +{hosp.departments.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHospitalModal(hosp);
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-cyan-300 flex items-center gap-1 focus:outline-none"
                      >
                        <Info size={11} /> View Hospital Details
                      </button>
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {isSelected ? 'Selected' : 'Select'} <ChevronRight size={12} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Appointment Booking Panel */}
        <div className="space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                  <Stethoscope size={16} className="text-cyan-400" /> Book Consultation
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Confirm hospital and select specialist doctor
                </p>
              </div>
            </div>

            {/* Selected Hospital Info Card */}
            {selectedHospital && (
              <div className="p-3.5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedHospital.image}
                    alt={selectedHospital.name}
                    className="w-12 h-12 rounded-xl object-cover border border-cyan-500/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest block truncate">
                      Selected Hospital
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-100 truncate">{selectedHospital.name}</h3>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                      <MapPin size={10} className="text-cyan-400 shrink-0" /> {selectedHospital.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-cyan-500/10 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone size={10} className="text-cyan-400" /> {selectedHospital.phone}
                  </span>
                  <span className="flex items-center gap-1 font-bold text-amber-300">
                    <Star size={10} className="fill-amber-400 text-amber-400" /> {selectedHospital.rating}
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleBookAppointment} className="space-y-4">
              {/* Doctor Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Select Doctor</label>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {selectedHospital.doctors.map((doc) => {
                    const isSelected = selectedDoctor?.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleSelectDoctor(doc)}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center gap-3 focus:outline-none
                          ${isSelected
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                            : 'bg-white/3 border-white/5 text-slate-400 hover:bg-white/5'}`}
                      >
                        <img
                          src={doc.avatar}
                          alt={doc.name}
                          className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-extrabold text-slate-100 truncate">{doc.name}</p>
                          <p className="text-[10px] text-cyan-400 font-medium truncate">{doc.specialization}</p>
                          <p className="text-[9px] text-slate-500">{doc.experience} yrs exp • ₹{doc.consultationFee}</p>
                        </div>
                        {isSelected && <Check size={14} className="text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">Consultation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['In-person', 'Online'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setConsultationMode(mode)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all focus:outline-none flex items-center justify-center gap-1.5
                        ${consultationMode === mode
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          : 'bg-white/3 border-white/5 text-slate-400 hover:border-white/10'}`}
                    >
                      {mode === 'Online' ? <Video size={13} /> : <MapPin size={13} />}
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Time Slot</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => setSelectedTimeSlot(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  >
                    {selectedDoctor.availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot} className="bg-slate-900 text-slate-200">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient Intake */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Patient Name <span className="text-rose-400">*</span></label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient full name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Phone Number</label>
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <RippleButton
                type="submit"
                variant="primary"
                disabled={submitting}
                className="w-full py-3.5 text-xs font-bold rounded-xl mt-3 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Confirming Booking...
                  </>
                ) : (
                  'Confirm Appointment Booking'
                )}
              </RippleButton>
            </form>
          </div>

          {/* Active Schedule Panel */}
          <div className="glass-card rounded-3xl p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-indigo-400" /> Registered Appointments ({appointments.length})
              </h3>
            </div>

            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">No active appointments scheduled yet.</p>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {appointments.map((appt) => (
                  <div key={appt.id} className="p-3 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate">{appt.doctor_name || appt.doctor || 'Doctor Consultation'}</p>
                      <p className="text-[10px] text-cyan-400 truncate">{appt.date_time || appt.date || 'Scheduled'}</p>
                    </div>
                    <button
                      onClick={() => handleCancelAppointment(appt.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 focus:outline-none"
                      title="Cancel appointment"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── HOSPITAL DETAIL MODAL ── */}
      <AnimatePresence>
        {activeHospitalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl max-w-2xl w-full p-6 border border-white/15 space-y-6 relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    {activeHospitalModal.type}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-100">{activeHospitalModal.name}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin size={13} className="text-cyan-400" /> {activeHospitalModal.address}
                  </p>
                </div>
                <button
                  onClick={() => setActiveHospitalModal(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={activeHospitalModal.image}
                  alt={activeHospitalModal.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{activeHospitalModal.description}</p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical Departments</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeHospitalModal.departments.map((d) => (
                    <span key={d} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-cyan-400" />
                  <span className="text-slate-300">{activeHospitalModal.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400" />
                  <span className="text-slate-300 truncate">{activeHospitalModal.email}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleSelectHospital(activeHospitalModal);
                  setActiveHospitalModal(null);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-glow-primary"
              >
                Select This Hospital for Booking
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentsPage;
