import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardLayout from '../components/layout/DashboardLayout';

// Admin Pages
import AdminOverviewPage from '../pages/dashboard/admin/AdminOverviewPage';
import ManageDoctorsPage from '../pages/dashboard/admin/ManageDoctorsPage';
import ManagePatientsPage from '../pages/dashboard/admin/ManagePatientsPage';
import ManageStaffPage from '../pages/dashboard/admin/ManageStaffPage';
import ManageAppointmentsPage from '../pages/dashboard/admin/ManageAppointmentsPage';
import AdminAnalyticsPage from '../pages/dashboard/admin/AdminAnalyticsPage';
import AdminReportsPage from '../pages/dashboard/admin/AdminReportsPage';
import AdminSettingsPage from '../pages/dashboard/admin/AdminSettingsPage';

// Doctor Pages
import DoctorOverviewPage from '../pages/dashboard/doctor/DoctorOverviewPage';
import AssignedPatientsPage from '../pages/dashboard/doctor/AssignedPatientsPage';
import DoctorAppointmentsPage from '../pages/dashboard/doctor/DoctorAppointmentsPage';
import PatientHistoryPage from '../pages/dashboard/doctor/PatientHistoryPage';
import DoctorReportsPage from '../pages/dashboard/doctor/DoctorReportsPage';
import PrescriptionsPage from '../pages/dashboard/doctor/PrescriptionsPage';
import DoctorProfilePage from '../pages/dashboard/doctor/DoctorProfilePage';

// Patient Pages
import PatientOverviewPage from '../pages/dashboard/patient/PatientOverviewPage';
import PatientSymptomCheckerPage from '../pages/dashboard/patient/PatientSymptomCheckerPage';
import PatientPredictionPage from '../pages/dashboard/patient/PatientPredictionPage';
import PatientRiskAssessmentPage from '../pages/dashboard/patient/PatientRiskAssessmentPage';
import PatientRecommendationsPage from '../pages/dashboard/patient/PatientRecommendationsPage';
import PatientReportsPage from '../pages/dashboard/patient/PatientReportsPage';
import PatientProfilePage from '../pages/dashboard/patient/PatientProfilePage';

// Staff Pages
import StaffOverviewPage from '../pages/dashboard/staff/StaffOverviewPage';
import PatientRegistrationPage from '../pages/dashboard/staff/PatientRegistrationPage';
import StaffAppointmentsPage from '../pages/dashboard/staff/StaffAppointmentsPage';
import DoctorSchedulePage from '../pages/dashboard/staff/DoctorSchedulePage';
import StaffReportsPage from '../pages/dashboard/staff/StaffReportsPage';

import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { ROLE } from '../constants/roles';

// Helper component to redirect authenticated/unauthenticated users from root or wildcards
function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case ROLE.ADMIN:
      return <Navigate to="/admin" replace />;
    case ROLE.DOCTOR:
      return <Navigate to="/doctor" replace />;
    case ROLE.PATIENT:
      return <Navigate to="/patient" replace />;
    case ROLE.STAFF:
      return <Navigate to="/staff" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={[ROLE.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="doctors" element={<ManageDoctorsPage />} />
        <Route path="patients" element={<ManagePatientsPage />} />
        <Route path="staff" element={<ManageStaffPage />} />
        <Route path="appointments" element={<ManageAppointmentsPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Doctor routes */}
      <Route 
        path="/doctor" 
        element={
          <ProtectedRoute allowedRoles={[ROLE.DOCTOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<DoctorOverviewPage />} />
        <Route path="patients" element={<AssignedPatientsPage />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="history" element={<PatientHistoryPage />} />
        <Route path="reports" element={<DoctorReportsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />
        <Route path="profile" element={<DoctorProfilePage />} />
      </Route>

      {/* Patient routes */}
      <Route 
        path="/patient" 
        element={
          <ProtectedRoute allowedRoles={[ROLE.PATIENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<PatientOverviewPage />} />
        <Route path="symptoms" element={<PatientSymptomCheckerPage />} />
        <Route path="prediction" element={<PatientPredictionPage />} />
        <Route path="risk" element={<PatientRiskAssessmentPage />} />
        <Route path="recommendations" element={<PatientRecommendationsPage />} />
        <Route path="reports" element={<PatientReportsPage />} />
        <Route path="profile" element={<PatientProfilePage />} />
      </Route>

      {/* Staff routes - Completely optional and separate */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute allowedRoles={[ROLE.STAFF]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<StaffOverviewPage />} />
        <Route path="registration" element={<PatientRegistrationPage />} />
        <Route path="appointments" element={<StaffAppointmentsPage />} />
        <Route path="schedule" element={<DoctorSchedulePage />} />
        <Route path="reports" element={<StaffReportsPage />} />
      </Route>
      
      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

