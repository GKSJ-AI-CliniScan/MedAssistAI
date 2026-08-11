import { BrowserRouter, Routes, Route } from "react-router-dom";

// ===========================
// Public Pages
// ===========================

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ===========================
// Layout
// ===========================

import MainLayout from "./layouts/MainLayout";

// ===========================
// Protected Pages
// ===========================

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
            MAIN APPLICATION LAYOUT
        ================================================= */}

        <Route element={<MainLayout />}>

          {/* =================================================
              DASHBOARD
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
              ANALYTICS
          ================================================= */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          {/* =================================================
              SETTINGS
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
