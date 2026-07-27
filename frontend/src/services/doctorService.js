/**
 * Doctor Service
 *
 * API layer for doctor directory, profile management,
 * and availability lookups.
 */
import api from "./api";

const doctorService = {
  /**
   * List all doctors with optional filtering.
   * @param {Object} params - { specialty, search }
   */
  listDoctors(params = {}) {
    return api.get("/doctors", { params }).then((res) => res.data);
  },

  /**
   * Get the current authenticated doctor's profile.
   */
  getMyProfile() {
    return api.get("/doctors/me").then((res) => res.data);
  },

  /**
   * Create the initial doctor profile (first-time setup).
   * @param {Object} data - { specialty, experience, phone, address, bio, availability }
   */
  createMyProfile(data) {
    return api.post("/doctors/me", data).then((res) => res.data);
  },

  /**
   * Update the authenticated doctor's profile.
   * @param {Object} data - partial update fields
   */
  updateMyProfile(data) {
    return api.put("/doctors/me", data).then((res) => res.data);
  },

  /**
   * Get a specific doctor by ID.
   * @param {number} doctorId
   */
  getDoctorById(doctorId) {
    return api.get(`/doctors/${doctorId}`).then((res) => res.data);
  },

  /**
   * Delete a doctor profile (admin only).
   * @param {number} doctorId
   */
  deleteDoctor(doctorId) {
    return api.delete(`/doctors/${doctorId}`);
  },
};

export default doctorService;
