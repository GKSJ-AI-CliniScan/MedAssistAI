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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="symptoms" element={<SymptomCheckerPage />} />
        <Route path="prediction" element={<PredictionPage />} />
        <Route path="risk" element={<RiskAssessmentPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
}
