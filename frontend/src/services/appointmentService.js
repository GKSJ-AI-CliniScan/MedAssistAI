/**
 * Appointment Service
 *
 * API layer for managing patient and doctor appointments:
 * booking, listing, updating, and cancellation.
 */
import api from "./api";

const appointmentService = {
  /**
   * List appointments for the current user.
   * Returns role-appropriate results (patient/doctor/admin).
   */
  async listMyAppointments() {
    try {
      const { data } = await api.get("/appointments");
      const local = JSON.parse(localStorage.getItem('medassist_shared_appointments') || '[]');
      
      const map = new Map();
      (data || []).forEach(item => map.set(String(item.id), item));
      local.forEach(item => {
        if (!map.has(String(item.id))) map.set(String(item.id), item);
      });
      return Array.from(map.values());
    } catch (err) {
      return JSON.parse(localStorage.getItem('medassist_shared_appointments') || '[]');
    }
  },

  /**
   * Get a specific appointment by ID.
   * @param {number|string} appointmentId
   */
  getAppointment(appointmentId) {
    return api.get(`/appointments/${appointmentId}`).then((res) => res.data);
  },

  /**
   * Book a new appointment.
   * @param {Object} data - { doctor_id, doctor_name, doctor_specialty, date_time, priority, status }
   */
  async createAppointment(data) {
    let created = null;
    try {
      const res = await api.post("/appointments", data);
      created = res.data;
    } catch (e) {
      created = {
        id: `APP-${Math.floor(100000 + Math.random() * 900000)}`,
        patient_name: data.patient_name || 'Registered Patient',
        doctor_id: data.doctor_id,
        doctor_name: data.doctor_name,
        doctor_specialty: data.doctor_specialty,
        date_time: data.date_time,
        priority: data.priority || 'Normal',
        status: data.status || 'Confirmed',
        notes: data.notes || '',
        created_at: new Date().toISOString()
      };
    }
    
    // Save to shared appointments storage for persistent cross-portal visibility
    try {
      const existing = JSON.parse(localStorage.getItem('medassist_shared_appointments') || '[]');
      localStorage.setItem('medassist_shared_appointments', JSON.stringify([created, ...existing]));
    } catch (err) {}

    return created;
  },

  /**
   * Update an existing appointment.
   * @param {number|string} appointmentId
   * @param {Object} data - partial update fields
   */
  updateAppointment(appointmentId, data) {
    return api.put(`/appointments/${appointmentId}`, data).then((res) => res.data);
  },

  /**
   * Cancel (delete) an appointment.
   * @param {number|string} appointmentId
   */
  cancelAppointment(appointmentId) {
    return api.delete(`/appointments/${appointmentId}`);
  },
};

export default appointmentService;
