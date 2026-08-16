import { BrowserRouter, Routes, Route } from "react-router-dom";

// =====================================================
// PUBLIC PAGES
// =====================================================

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminPatients from "./admin/AdminPatients";
import AdminHighRiskPatients from "./admin/AdminHighRiskPatients";
import AdminReports from "./admin/AdminReports";
import AdminAnalytics from "./admin/AdminAnalytics";

// =====================================================
// ADMIN LAYOUT
// =====================================================

import AdminLayout from "./layouts/AdminLayout";

// =====================================================
// PATIENT LAYOUT
// =====================================================

import MainLayout from "./layouts/MainLayout";

// =====================================================
// PATIENT PAGES
// =====================================================

import Dashboard from "./pages/Dashboard";
import HealthAnalysis from "./pages/HealthAnalysis";
import DiseasePrediction from "./pages/DiseasePrediction";
import RiskAssessment from "./pages/RiskAssessment";
import TreatmentRecommendation from "./pages/TreatmentRecommendation";
import HealthReport from "./pages/HealthReports";
import MedicalRecords from "./pages/MedicalRecords";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC PAGES
        ================================================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =================================================
            ADMIN LOGIN
        ================================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =================================================
            ADMIN APPLICATION LAYOUT
        ================================================= */}

        <Route element={<AdminLayout />}>

          {/* =================================================
              ADMIN DASHBOARD
          ================================================= */}

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />


          {/* =================================================
              ADMIN PATIENTS
          ================================================= */}

          <Route
            path="/admin/patients"
            element={<AdminPatients />}
          />


          {/* =================================================
              ADMIN HIGH RISK PATIENTS
          ================================================= */}

          <Route
            path="/admin/high-risk-patients"
            element={<AdminHighRiskPatients />}
          />


          {/* =================================================
              ADMIN REPORTS
          ================================================= */}

          <Route
            path="/admin/reports"
            element={<AdminReports />}
          />


          {/* =================================================
              ADMIN ANALYTICS
          ================================================= */}

          <Route
            path="/admin/analytics"
            element={<AdminAnalytics />}
          />

        </Route>


        {/* =================================================
            MAIN PATIENT APPLICATION LAYOUT
        ================================================= */}

        <Route element={<MainLayout />}>

          {/* =================================================
              PATIENT DASHBOARD
          ================================================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* =================================================
              HEALTH ANALYSIS
          ================================================= */}

          <Route
            path="/health-analysis"
            element={<HealthAnalysis />}
          />


          {/* =================================================
              DISEASE PREDICTION
          ================================================= */}

          <Route
            path="/prediction"
            element={<DiseasePrediction />}
          />


          {/* =================================================
              RISK ASSESSMENT
          ================================================= */}

          <Route
            path="/risk"
            element={<RiskAssessment />}
          />


          {/* =================================================
              TREATMENT RECOMMENDATION
          ================================================= */}

          <Route
            path="/recommendation"
            element={<TreatmentRecommendation />}
          />


          {/* =================================================
              HEALTH REPORT
          ================================================= */}

          <Route
            path="/report"
            element={<HealthReport />}
          />


          {/* =================================================
              MEDICAL RECORDS
          ================================================= */}

          <Route
            path="/records"
            element={<MedicalRecords />}
          />


          {/* =================================================
              PATIENT ANALYTICS
          ================================================= */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />


          {/* =================================================
              PATIENT SETTINGS
          ================================================= */}

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;