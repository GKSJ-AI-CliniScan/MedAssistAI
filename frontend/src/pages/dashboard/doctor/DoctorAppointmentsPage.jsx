import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import EmptyState from '../../../components/ui/EmptyState';
import {
  Calendar,
  Plus,
  Loader2,
  AlertCircle,
  Clock,
  Users,
  Filter,
  CheckCircle2,
  X,
  User,
  Stethoscope,
  FileText
} from 'lucide-react';
import {
  getMyAppointments,
  getAppointmentDetails,
  updateAppointmentStatus,
  createAppointment,
} from '../../../services/api/appointments';
import { getAllPatients } from '../../../services/api/patient';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Create Appointment Form
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [newAptDate, setNewAptDate] = useState('');
  const [newAptTime, setNewAptTime] = useState('10:00');
  const [newAptReason, setNewAptReason] = useState('');
  const [newAptNotes, setNewAptNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [modalSuccess, setModalSuccess] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Unable to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await getAllPatients();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return '';
    const normalized = String(status).trim().toLowerCase();
    if (normalized === 'scheduled') return 'scheduled';
    if (normalized === 'confirmed') return 'confirmed';
    if (normalized === 'completed') return 'completed';
    if (normalized === 'cancelled') return 'cancelled';
    if (normalized === 'canceled') return 'cancelled';
    if (normalized === 'pending') return 'pending';
    return normalized;
  };

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => normalizeStatus(a.status) === filterStatus);

  const handleOpenCreateModal = () => {
    setSelectedPatientId(patients[0]?.id || '');
    setNewAptDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setNewAptTime('10:00');
    setNewAptReason('');
    setNewAptNotes('');
    setModalSuccess('');
    setShowCreateModal(true);
  };

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !newAptDate || !newAptTime) {
      alert('Please fill all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const fullDateTime = `${newAptDate}T${newAptTime}:00`;
      await createAppointment({
        patient_id: Number(selectedPatientId),
        appointment_date: fullDateTime,
        reason: newAptReason || 'Clinical Follow-up',
        notes: newAptNotes || undefined,
      });

      setModalSuccess('Appointment scheduled successfully (Status: CONFIRMED).');
      await fetchAppointments();
      setTimeout(() => {
        setShowCreateModal(false);
        setModalSuccess('');
      }, 1200);
    } catch (err) {
      console.error('Error creating doctor appointment:', err);
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = async (appointmentId) => {
    try {
      const details = await getAppointmentDetails(appointmentId);
      setSelectedAppointment(details);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching appointment details:', err);
      alert('Unable to load appointment details.');
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, { status: newStatus });
      await fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Unable to update appointment status.');
    }
  };

  const getStatusColor = (status) => {
    switch (normalizeStatus(status)) {
      case 'confirmed':
      case 'scheduled':
        return 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800';
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800';
      case 'pending':
      default:
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            Clinical appointment schedule & status transitions
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleOpenCreateModal}
          className="gap-1.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4]"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchAppointments} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <Card title="Appointment Queue" subtitle="Consultation Schedule & Status Transitions">
        <div className="space-y-4">
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark"
            >
              <option value="all">All Appointments ({appointments.length})</option>
              <option value="pending">Pending Review</option>
              <option value="confirmed">Confirmed / Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {filteredAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments found"
              description={
                filterStatus === 'all'
                  ? 'No patient consultations currently scheduled in your queue.'
                  : `No appointments with status: ${filterStatus.toUpperCase()}`
              }
              actionLabel="Schedule Appointment"
              onActionClick={handleOpenCreateModal}
              className="py-12"
            />
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredAppointments.map((apt) => {
                const status = normalizeStatus(apt.status);
                const patientName = apt.patient?.user?.fullname || apt.patient?.fullname || `Patient #${apt.patient_id}`;
                const patientEmail = apt.patient?.user?.email || 'N/A';
                const dateStr = apt.appointment_date ? new Date(apt.appointment_date).toLocaleString() : 'Date N/A';

                return (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <User className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {patientName}
                          </span>
                          <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark">
                            ({patientEmail})
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(status)}`}>
                            {apt.status || 'Pending'}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{dateStr}</span>
                          </div>
                          <div>
                            Reason: <strong className="text-clinical-textLight dark:text-clinical-textDark">{apt.reason || 'General Consultation'}</strong>
                          </div>
                        </div>

                        {apt.notes && (
                          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark italic">
                            Notes: "{apt.notes}"
                          </p>
                        )}
                      </div>

                      {/* Action Triggers */}
                      <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
                        <Button
                          variant="outline"
                          size="small"
                          onClick={() => handleViewDetails(apt.id)}
                          className="text-xs py-1"
                        >
                          Details
                        </Button>

                        {status === 'pending' && (
                          <>
                            <Button
                              variant="primary"
                              size="small"
                              onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                              className="text-xs py-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                              Confirm
                            </Button>
                            <Button
                              variant="outline"
                              size="small"
                              onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                              className="text-xs py-1 text-red-500 border-red-200 dark:border-red-900"
                            >
                              Cancel
                            </Button>
                          </>
                        )}

                        {(status === 'confirmed' || status === 'scheduled') && (
                          <Button
                            variant="primary"
                            size="small"
                            onClick={() => handleUpdateStatus(apt.id, 'completed')}
                            className="text-xs py-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* New Appointment Modal for Doctor */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#061426] border border-white/10 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Consultation Slot</h3>
                  <p className="text-[11px] text-white/60">Schedule direct appointment with a patient</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalSuccess ? (
              <div className="p-4 rounded-xl bg-green-950/40 border border-green-500/30 text-green-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <span>{modalSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateAppointment} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">
                    Select Patient *
                  </label>
                  <select
                    value={selectedPatientId || ''}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                  >
                    <option value="" disabled className="bg-[#061426]">Select Patient Record</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#061426]">
                        {p.user?.fullname || p.fullname} ({p.user?.email || 'No email'})
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
                      value={newAptDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewAptDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/90 block mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={newAptTime}
                      onChange={(e) => setNewAptTime(e.target.value)}
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
                    placeholder="e.g. Clinical follow-up, Lab results review"
                    value={newAptReason}
                    onChange={(e) => setNewAptReason(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:border-[#06B6D4] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/90 block mb-1">
                    Doctor Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Clinical preparation instructions..."
                    value={newAptNotes}
                    onChange={(e) => setNewAptNotes(e.target.value)}
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
                        <span>Creating Slot...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Appointment</span>
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#061426] border border-white/10 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4]">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Appointment Dossier</h3>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white/5 space-y-1">
                <span className="text-white/60 block text-[11px]">Patient Name</span>
                <span className="text-white font-bold text-sm">
                  {selectedAppointment.patient?.user?.fullname || `Patient #${selectedAppointment.patient_id}`}
                </span>
                <span className="text-white/60 block text-[11px]">
                  {selectedAppointment.patient?.user?.email || 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-white/5">
                  <span className="text-white/60 block text-[10px]">Date & Time</span>
                  <span className="text-white font-semibold">
                    {new Date(selectedAppointment.appointment_date).toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5">
                  <span className="text-white/60 block text-[10px]">Status</span>
                  <span className="text-[#06B6D4] font-bold uppercase">
                    {selectedAppointment.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white/5 space-y-1">
                <span className="text-white/60 block text-[10px]">Reason for Consultation</span>
                <p className="text-white font-medium">{selectedAppointment.reason || 'General Consultation'}</p>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 rounded-lg bg-white/5 space-y-1">
                  <span className="text-white/60 block text-[10px]">Notes</span>
                  <p className="text-white/80">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}