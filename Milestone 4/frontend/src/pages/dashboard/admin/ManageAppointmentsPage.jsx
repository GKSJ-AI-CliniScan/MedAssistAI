import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import EmptyState from '../../../components/ui/EmptyState';
import { Calendar, Loader2, AlertCircle, Users, Clock, Filter, Stethoscope, User, X, FileText, CheckCircle2 } from 'lucide-react';
import { getAllAppointments, getAppointmentDetails, updateAppointmentStatus } from '../../../services/api/appointments';

export default function ManageAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAllAppointments(0, 100, filterStatus === 'all' ? null : filterStatus);
      setAppointments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load appointments. Please try again later.');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
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
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return '';
    const s = String(status).trim().toLowerCase();
    if (s === 'canceled') return 'cancelled';
    return s;
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

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Manage Appointments
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            System-wide consultation schedule, room occupancy & clinical status oversight
          </p>
        </div>
        <ModTag variant="brand">Booking Operations</ModTag>
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

      <Card title="Appointment Oversight" subtitle="Master Clinical Consultation Directory">
        <div className="space-y-4">
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
            Monitor clinical consultations across all departments, resolve patient-physician pairs, and manage status lifecycles.
          </p>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark focus:outline-none focus:border-[#06B6D4]"
            >
              <option value="all">All Appointments ({appointments.length})</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {appointments.length === 0 ? (
            <EmptyState 
              icon={Calendar}
              title="No appointments found"
              description={filterStatus === 'all' ? 'System-wide clinic booking logs will be displayed here.' : `No appointments with status: ${filterStatus.toUpperCase()}`}
              className="py-10"
            />
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {appointments.map((appointment) => {
                const patName = appointment.patient?.user?.fullname || appointment.patient?.fullname || `Patient #${appointment.patient_id}`;
                const docName = appointment.doctor?.user?.fullname || appointment.doctor?.fullname || `Doctor #${appointment.doctor_id}`;
                const docSpec = appointment.doctor?.specialization || 'General Medicine';
                const dateStr = appointment.appointment_date ? new Date(appointment.appointment_date).toLocaleString() : 'Date N/A';
                const status = normalizeStatus(appointment.status);

                return (
                  <div key={appointment.id} className="p-4 rounded-xl bg-clinical-bgLight dark:bg-clinical-bgDarkSec border border-slate-200 dark:border-clinical-tealDark/15 hover:border-[#06B6D4]/30 transition-all space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Calendar className="w-4 h-4 text-[#06B6D4]" />
                          <span className="text-sm font-bold text-clinical-textLight dark:text-clinical-textDark">
                            {appointment.reason || 'Consultation'}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>{dateStr}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>Patient: <strong className="text-clinical-textLight dark:text-clinical-textDark">{patName}</strong></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <span>Doctor: <strong className="text-clinical-textLight dark:text-clinical-textDark">{docName}</strong> ({docSpec})</span>
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark italic">
                            Notes: "{appointment.notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap justify-end">
                        <Button 
                          variant="outline" 
                          size="small" 
                          onClick={() => handleViewDetails(appointment.id)}
                          className="text-xs py-1"
                        >
                          Details
                        </Button>

                        {status === 'pending' && (
                          <Button 
                            variant="primary" 
                            size="small" 
                            onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                            className="text-xs py-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                          >
                            Confirm
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

      {/* Appointment Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#061426] border border-white/10 p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#06B6D4]/20 text-[#06B6D4]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Appointment Dossier #{selectedAppointment.id}</h3>
                  <p className="text-[11px] text-white/60">Complete clinical visit record</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/5 space-y-1">
                  <span className="text-white/60 block text-[10px]">Patient Information</span>
                  <span className="text-white font-bold text-sm block">
                    {selectedAppointment.patient?.user?.fullname || `Patient #${selectedAppointment.patient_id}`}
                  </span>
                  <span className="text-white/60 block text-[11px]">
                    {selectedAppointment.patient?.user?.email || 'N/A'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/5 space-y-1">
                  <span className="text-white/60 block text-[10px]">Assigned Physician</span>
                  <span className="text-white font-bold text-sm block">
                    {selectedAppointment.doctor?.user?.fullname || `Doctor #${selectedAppointment.doctor_id}`}
                  </span>
                  <span className="text-[#06B6D4] font-semibold block text-[11px]">
                    {selectedAppointment.doctor?.specialization || 'General Medicine'}
                  </span>
                </div>
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
                <span className="text-white/60 block text-[10px]">Reason for Visit</span>
                <p className="text-white font-medium">{selectedAppointment.reason || 'General Consultation'}</p>
              </div>

              {selectedAppointment.notes && (
                <div className="p-3 rounded-lg bg-white/5 space-y-1">
                  <span className="text-white/60 block text-[10px]">Clinical Notes</span>
                  <p className="text-white/80">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-2">
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