/**
 * Admin Service
 *
 * API layer for admin-only operations: system stats,
 * user management, role changes, and audit logs.
 */
import api from "./api";

const adminService = {
  /**
   * Get platform-wide statistics.
   */
  getSystemStats() {
    return api.get("/admin/stats").then((res) => res.data);
  },

  /**
   * List all users with optional filtering.
   * @param {Object} params - { role, search, skip, limit }
   */
  listUsers(params = {}) {
    return api.get("/admin/users", { params }).then((res) => res.data);
  },

  /**
   * Get detailed user information.
   * @param {number} userId
   */
  getUserDetail(userId) {
    return api.get(`/admin/users/${userId}`).then((res) => res.data);
  },

  /**
   * Activate a user account.
   * @param {number} userId
   */
  activateUser(userId) {
    return api.put(`/admin/users/${userId}/activate`).then((res) => res.data);
  },

  /**
   * Deactivate a user account.
   * @param {number} userId
   */
  deactivateUser(userId) {
    return api.put(`/admin/users/${userId}/deactivate`).then((res) => res.data);
  },

  /**
   * Change a user's role.
   * @param {number} userId
   * @param {string} newRole - patient, doctor, or admin
   */
  changeUserRole(userId, newRole) {
    return api
      .put(`/admin/users/${userId}/role`, null, { params: { new_role: newRole } })
      .then((res) => res.data);
  },

  /**
   * Permanently delete a user.
   * @param {number} userId
   */
  deleteUser(userId) {
    return api.delete(`/admin/users/${userId}`);
  },

  /**
   * Get audit log entries.
   * @param {Object} params - { skip, limit }
   */
  getAuditLogs(params = {}) {
    return api.get("/admin/audit-logs", { params }).then((res) => res.data);
  },
};

export default adminService;
