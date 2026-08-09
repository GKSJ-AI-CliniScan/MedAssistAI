import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute, { PublicOnlyRoute, FullScreenLoader } from './components/common/ProtectedRoute';



const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const SymptomChecker = lazy(() => import('./pages/SymptomChecker/SymptomChecker'));
const Prediction = lazy(() => import('./pages/Prediction/Prediction'));
const Reports = lazy(() => import('./pages/Reports/Reports'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

        {/* Protected (shared layout) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/prediction/:id" element={<Prediction />} />
          <Route path="/prediction/result" element={<Prediction />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
