import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Protection Wrappers
import PrivateRoutes from './PrivateRoutes';
import PublicOnlyRoute from './PublicOnlyRoute';

// Pages
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import ForgotPasswordPage from '../pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/Auth/ResetPasswordPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import MedicalHistoryPage from '../pages/MedicalHistory/MedicalHistoryPage';
import SymptomAnalysisPage from '../pages/SymptomAnalysis/SymptomAnalysisPage';
import DiseasePredictionPage from '../pages/DiseasePrediction/DiseasePredictionPage';
import RiskAssessmentPage from '../pages/RiskAssessment/RiskAssessmentPage';
import RecommendationsPage from '../pages/Recommendations/RecommendationsPage';
import ReportsPage from '../pages/Reports/ReportsPage';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import SettingsPage from '../pages/Settings/SettingsPage';
import NotFoundPage from '../pages/Errors/NotFoundPage';
import AppointmentsPage from '../pages/Appointments/AppointmentsPage';
import AIHealthAssistantPage from '../pages/AIHealthAssistant/AIHealthAssistantPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Authentication Pages (Only accessible when NOT authenticated) */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Navigate to="/auth/login" replace />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* Protected Diagnostics Portal Pages */}
      <Route element={<PrivateRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
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
          <Route path="/assistant" element={<AIHealthAssistantPage />} />
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
