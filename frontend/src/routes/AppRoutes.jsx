import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Protection Wrappers
import PrivateRoutes from './PrivateRoutes';
import PublicOnlyRoute from './PublicOnlyRoute';

// ── Landing ──
import LandingPage from '../pages/Landing/LandingPage';

// ── Auth: Role Select, Patient, Doctor ──
import RoleSelectPage from '../pages/Auth/RoleSelectPage';
import PatientLoginPage from '../pages/Auth/PatientLoginPage';
import DoctorLoginPage from '../pages/Auth/DoctorLoginPage';
import PatientRegisterPage from '../pages/Auth/PatientRegisterPage';
import DoctorRegisterPage from '../pages/Auth/DoctorRegisterPage';

// ── Existing Auth Pages ──
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import AuthCallbackPage from '../pages/Auth/AuthCallbackPage';

// ── Patient Dashboard & Profile ──
import PatientDashboardPage from '../pages/Dashboard/PatientDashboardPage';
import PatientProfilePage from '../pages/Profile/PatientProfilePage';

// ── Doctor Dashboard, Profile & Appointments ──
import DoctorDashboardPage from '../pages/Dashboard/DoctorDashboardPage';
import DoctorProfilePage from '../pages/Profile/DoctorProfilePage';
import DoctorAppointmentsPage from '../pages/Appointments/DoctorAppointmentsPage';

// ── Patient Appointments ──
import AppointmentsPage from '../pages/Appointments/AppointmentsPage';
import MyAppointmentsPage from '../pages/Appointments/MyAppointmentsPage';

// ── Symptom Analysis (Enhanced) ──
import SymptomAnalysisPage from '../pages/SymptomAnalysis/SymptomAnalysisPage';

// ── Existing Dashboard & Other Pages ──
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import MedicalHistoryPage from '../pages/MedicalHistory/MedicalHistoryPage';
import DiseasePredictionPage from '../pages/DiseasePrediction/DiseasePredictionPage';
import RiskAssessmentPage from '../pages/RiskAssessment/RiskAssessmentPage';
import RecommendationsPage from '../pages/Recommendations/RecommendationsPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import NotFoundPage from '../pages/Errors/NotFoundPage';
import AIHealthAssistantPage from '../pages/AIHealthAssistant/AIHealthAssistantPage';
import HospitalsPage from '../pages/Hospitals/HospitalsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public: Landing Page ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* ── OAuth Callback ── */}
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      {/* ── Role-Based Auth Pages (Standalone, always accessible) ── */}
      {/* Role Selector */}
      <Route path="/signin" element={<RoleSelectPage />} />
      <Route path="/login" element={<RoleSelectPage />} />

      {/* Patient Auth */}
      <Route path="/patient-login" element={<PatientLoginPage />} />
      <Route path="/patient-register" element={<PatientRegisterPage />} />

      {/* Doctor Auth */}
      <Route path="/doctor-login" element={<DoctorLoginPage />} />
      <Route path="/doctor-register" element={<DoctorRegisterPage />} />

      {/* Password Recovery */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ── Legacy Auth (wrapped in PublicOnlyRoute) ── */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/signin" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* ── Protected Dashboard Routes ── */}
      <Route element={<PrivateRoutes />}>
        <Route element={<DashboardLayout />}>

          {/* ──── Patient Routes ──── */}
          <Route path="/patient-dashboard" element={<PatientDashboardPage />} />
          <Route path="/patient-profile" element={<PatientProfilePage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/symptom-analysis" element={<SymptomAnalysisPage />} />

          {/* ──── Doctor Routes ──── */}
          <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
          <Route path="/doctor-profile" element={<DoctorProfilePage />} />
          <Route path="/doctor-appointments" element={<DoctorAppointmentsPage />} />

          {/* ──── Shared Routes (Patient & Doctor) ──── */}
          <Route path="/dashboard" element={<PatientDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/medical-history" element={<MedicalHistoryPage />} />
          <Route path="/symptoms" element={<SymptomAnalysisPage />} />
          <Route path="/prediction" element={<DiseasePredictionPage />} />
          <Route path="/risk" element={<RiskAssessmentPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/hospitals" element={<HospitalsPage />} />
          <Route path="/assistant" element={<AIHealthAssistantPage />} />
        </Route>
      </Route>

      {/* ── Route Aliases ── */}
      <Route path="/register" element={<Navigate to="/patient-register" replace />} />
      <Route path="/signup" element={<Navigate to="/patient-register" replace />} />

      {/* ── 404 ── */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
