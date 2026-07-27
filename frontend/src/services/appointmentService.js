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
  listMyAppointments() {
    return api.get("/appointments").then((res) => res.data);
  },

  /**
   * Get a specific appointment by ID.
   * @param {number} appointmentId
   */
  getAppointment(appointmentId) {
    return api.get(`/appointments/${appointmentId}`).then((res) => res.data);
  },

  /**
   * Book a new appointment.
   * @param {Object} data - { doctor_id, doctor_name, doctor_specialty, date_time, priority, status }
   */
  createAppointment(data) {
    return api.post("/appointments", data).then((res) => res.data);
  },

  /**
   * Update an existing appointment.
   * @param {number} appointmentId
   * @param {Object} data - partial update fields
   */
  updateAppointment(appointmentId, data) {
    return api.put(`/appointments/${appointmentId}`, data).then((res) => res.data);
  },

  /**
   * Cancel (delete) an appointment.
   * @param {number} appointmentId
   */
  cancelAppointment(appointmentId) {
    return api.delete(`/appointments/${appointmentId}`);
  },
};

export default appointmentService;
