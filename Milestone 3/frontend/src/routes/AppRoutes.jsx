import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import OverviewPage from '../pages/dashboard/OverviewPage';
import SymptomCheckerPage from '../pages/dashboard/SymptomCheckerPage';
import PredictionPage from '../pages/dashboard/PredictionPage';
import RiskAssessmentPage from '../pages/dashboard/RiskAssessmentPage';
import RecommendationsPage from '../pages/dashboard/RecommendationsPage';
import ReportsPage from '../pages/dashboard/ReportsPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import { useAuth } from '../context/AuthContext';

function DefaultRedirect() {
  const { user } = useAuth();
  const landing = user?.role === 'doctor' ? '/dashboard/analytics' : '/dashboard/overview';
  return <Navigate to={landing} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DefaultRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DefaultRedirect />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="symptoms" element={<SymptomCheckerPage />} />
        {/* alias so navigate('/dashboard/symptom-checker') works */}
        <Route path="symptom-checker" element={<SymptomCheckerPage />} />
        <Route path="prediction" element={<PredictionPage />} />
        <Route path="risk" element={<RiskAssessmentPage />} />
        {/* alias so navigate('/dashboard/risk-assessment') works */}
        <Route path="risk-assessment" element={<RiskAssessmentPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={['patient', 'admin']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  );
}
