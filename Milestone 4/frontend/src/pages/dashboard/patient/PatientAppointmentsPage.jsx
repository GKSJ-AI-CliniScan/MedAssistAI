import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import EmptyState from '../../../components/ui/EmptyState';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Plus, 
  Search, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  X,
  Award,
  Filter
} from 'lucide-react';
import { getMyAppointments, createAppointment, updateAppointmentStatus } from '../../../services/api/appointments';
import { getAllDoctors } from '../../../services/api/doctor';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [doctorSearch, setDoctorSearch] = useState('');
  
  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aptsData, docsData] = await Promise.all([
        getMyAppointments().catch(() => []),
        getAllDoctors().catch(() => []),
      ]);
      setAppointments(Array.isArray(aptsData) ? aptsData : []);
      setDoctors(Array.isArray(docsData) ? docsData : []);
      setError(null);
    } catch (err) {
      console.error('Error loading appointments data:', err);
      setError('Unable to load appointment schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (doctor = null) => {
    setSelectedDoctor(doctor ? doctor.id : (doctors[0]?.id || ''));
    setBookingDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setBookingTime('10:00');
    setBookingReason('');
    setBookingNotes('');
    setBookingSuccess('');
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const fullDateTime = `${bookingDate}T${bookingTime}:00`;
      await createAppointment({
        doctor_id: Number(selectedDoctor),
        appointment_date: fullDateTime,
        reason: bookingReason || 'General Consultation',
        notes: bookingNotes || undefined,
      });

      setBookingSuccess('Appointment requested successfully! Status: PENDING clinician review.');
      const updatedApts = await getMyAppointments();
      setAppointments(Array.isArray(updatedApts) ? updatedApts : []);

      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess('');
      }, 1500);
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await updateAppointmentStatus(appointmentId, { status: 'cancelled' });
      const updatedApts = await getMyAppointments();
      setAppointments(Array.isArray(updatedApts) ? updatedApts : []);
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert('Failed to cancel appointment.');
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return '';
    const norm = String(status).trim().toLowerCase();
    if (norm === 'canceled') return 'cancelled';
    return norm;
  };

  const getStatusBadge = (status) => {
    const s = normalizeStatus(status);
    switch (s) {
      case 'confirmed':
        return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800/50';
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/50';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50';
      case 'pending':
      default:
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50';
    }
  };

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => normalizeStatus(a.status) === filterStatus);

  const filteredDoctors = doctors.filter(d => {
    const name = d.user?.fullname || d.fullname || '';
    const spec = d.specialization || '';
    const q = doctorSearch.toLowerCase();
    return name.toLowerCase().includes(q) || spec.toLowerCase().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Care & Appointments
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Book consultations with certified physicians and track clinical appointments
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => handleOpenBooking()} 
          className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchData} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Grid Layout: My Appointments (Left 7) & Available Clinicians (Right 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: My Appointments */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="My Appointments" subtitle="Scheduled & Requested Consultations">
            <div className="space-y-4">
              
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
                >
                  <option value="all">All Appointments ({appointments.length})</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {filteredAppointments.length === 0 ? (
                <EmptyState
                  icon={Calendar}
                  title="No appointments in this category"
                  description={filterStatus === 'all' ? "You haven't scheduled any consultations yet. Find a doctor from the directory to book an appointment." : `No appointments with status: ${filterStatus.toUpperCase()}`}
                  actionLabel="Schedule First Appointment"
                  onActionClick={() => handleOpenBooking()}
                  className="py-8"
                />
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredAppointments.map((apt) => {
                    const status = normalizeStatus(apt.status);
                    const docName = apt.doctor?.user?.fullname || apt.doctor?.fullname || `Doctor #${apt.doctor_id}`;
                    const docSpec = apt.doctor?.specialization || 'General Medicine';
                    const aptDate = apt.appointment_date ? new Date(apt.appointment_date).toLocaleString() : 'N/A';

                    return (
                      <div 
                        key={apt.id}
                        className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="w-4 h-4 text-[#06B6D4]" />
                              <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                                {docName}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] font-semibold border border-[#06B6D4]/20">
                                {docSpec}
                              </span>
                            </div>
                            <p className="text-xs text-clinical-textLight dark:text-clinical-textDark font-medium">
                              Reason: {apt.reason || 'General Consultation'}
                            </p>
                          </div>

                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(apt.status)}`}>
                            {apt.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-clinical-mutedLight dark:text-clinical-mutedDark pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{aptDate}</span>
                          </div>

                          {(status === 'pending' || status === 'confirmed') && (
                            <Button 
                              variant="outline" 
                              size="small" 
                              onClick={() => handleCancelAppointment(apt.id)}
                              className="text-red-500 hover:text-red-600 border-red-200 dark:border-red-900 text-[11px] py-1"
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Available Clinicians Directory */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Certified Physicians" subtitle="Browse and book approved doctors">
            <div className="space-y-4">
              
              {/* Doctor Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
                <input
                  type="text"
                  placeholder="Search doctor or specialization..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark focus:outline-none focus:border-[#06B6D4]"
                />
              </div>

              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {filteredDoctors.length === 0 ? (
                  <p className="text-center py-6 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                    No physicians match your search.
                  </p>
                ) : (
                  filteredDoctors.map((doc) => {
                    const docName = doc.user?.fullname || doc.fullname || 'Dr. Practitioner';
                    const docSpec = doc.specialization || 'General Medicine';
                    const docExp = doc.experience_years || 0;

                    return (
                      <div
                        key={doc.id}
                        className="p-3.5 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-clinical-textLight dark:text-clinical-textDark truncate">
                              {docName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                            <span className="text-[#06B6D4] font-medium">{docSpec}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-500" />
                              {docExp} yrs exp
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => handleOpenBooking(doc)}
                          className="shrink-0 text-xs py-1.5 px-3"
                        >
                          Book
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#061426] border border-white/10 p-6 text-white shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Book Doctor Consultation</h3>
                  <p className="text-[11px] text-white/60">Schedule an appointment with an approved physician</p>
                </div>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-green-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <span>{bookingSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">
                    Select Physician *
                  </label>
                  <select
                    value={selectedDoctor || ''}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                  >
                    <option value="" disabled className="bg-[#061426]">Select a Doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id} className="bg-[#061426]">
                        {d.user?.fullname || d.fullname} - {d.specialization} ({d.experience_years} yrs exp)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-white/90 block mb-1">
                      Consultation Date *
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/90 block mb-1">
                      Preferred Time *
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                    >
                      <option value="09:00" className="bg-[#061426]">09:00 AM</option>
                      <option value="10:00" className="bg-[#061426]">10:00 AM</option>
                      <option value="11:30" className="bg-[#061426]">11:30 AM</option>
                      <option value="14:00" className="bg-[#061426]">02:00 PM</option>
                      <option value="15:30" className="bg-[#061426]">03:30 PM</option>
                      <option value="16:30" className="bg-[#061426]">04:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">
                    Reason for Consultation *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chest discomfort, Follow-up on cough, Fever"
                    value={bookingReason}
                    onChange={(e) => setBookingReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">
                    Notes for Doctor (Optional)
                  </label>
                  <textarea
                    placeholder="Provide any relevant medical symptoms or questions..."
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="w-full gap-2 justify-center bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Appointment Request</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
