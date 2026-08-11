import {
  FaUserCircle,
  FaPlayCircle,
  FaFileMedical,
  FaHeartbeat,
  FaChartLine,
  FaNotesMedical,
  FaRobot,
  FaArrowRight,
  FaBell,
  FaCalendarAlt,
  FaShieldAlt,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Dashboard.css";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// Dashboard Component
// =====================================================

function Dashboard() {
  const navigate = useNavigate();

  // ===================================================
  // Patient Profile State
  // ===================================================

  const [profile, setProfile] = useState({
    patient_id: "",
    full_name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    blood_group: "",
    address: "",
    emergency_contact: "",
    photo: "",
    created_at: "",
  });

  // ===================================================
  // Dashboard Statistics
  // ===================================================

  const [totalReports, setTotalReports] = useState(0);

  const [latestPrediction, setLatestPrediction] = useState({
    disease: "No Prediction",
    confidence: null,
    risk_level: "No Risk Data",
    risk_score: null,
  });

  // ===================================================
  // Loading State
  // ===================================================

  const [loading, setLoading] = useState(true);

  // ===================================================
  // Error State
  // ===================================================

  const [error, setError] = useState("");

  // ===================================================
  // Get Patient ID
  // ===================================================

  const getPatientId = useCallback(() => {
    const possibleKeys = [
      "patient_id",
      "patientId",
      "patientID",
      "user_patient_id",
    ];

    // -------------------------------------------------
    // Check localStorage / sessionStorage
    // -------------------------------------------------

    for (const key of possibleKeys) {
      const localValue = localStorage.getItem(key);

      if (localValue) {
        return localValue;
      }

      const sessionValue = sessionStorage.getItem(key);

      if (sessionValue) {
        return sessionValue;
      }
    }

    // -------------------------------------------------
    // Check stored user object
    // -------------------------------------------------

    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.patient_id) {
          return user.patient_id;
        }

        if (user?.patientId) {
          return user.patientId;
        }

        if (user?.patientID) {
          return user.patientID;
        }
      } catch (parseError) {
        console.error(
          "Unable to read stored user:",
          parseError
        );
      }
    }

    return "";
  }, []);

  // ===================================================
  // Convert Date To Timestamp
  // ===================================================

  const getRecordTimestamp = (record) => {
    if (!record) {
      return 0;
    }

    const possibleDates = [
      record.date,
      record.created_at,
      record.prediction_date,
      record.generated_date,
    ];

    for (const dateValue of possibleDates) {
      if (!dateValue) {
        continue;
      }

      const timestamp = new Date(dateValue).getTime();

      if (!Number.isNaN(timestamp)) {
        return timestamp;
      }
    }

    return 0;
  };

  // ===================================================
  // Load Dashboard Data
  // ===================================================

  const loadDashboardData = useCallback(async () => {
    const patientId = getPatientId();

    if (!patientId) {
      setLoading(false);

      setError(
        "Patient ID not found. Please login again."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      // =================================================
      // 1. LOAD PATIENT PROFILE
      // =================================================

      try {
        const profileResponse = await axios.get(
          `${API_BASE_URL}/profile/${patientId}`
        );

        const profileData =
          profileResponse.data || {};

        setProfile({
          patient_id:
            profileData.patient_id || patientId,

          full_name:
            profileData.full_name || "",

          email:
            profileData.email || "",

          phone:
            profileData.phone || "",

          age:
            profileData.age ?? "",

          gender:
            profileData.gender || "",

          blood_group:
            profileData.blood_group || "",

          address:
            profileData.address || "",

          emergency_contact:
            profileData.emergency_contact || "",

          photo:
            profileData.photo || "",

          created_at:
            profileData.created_at || "",
        });
      } catch (profileError) {
        console.error(
          "Unable to load patient profile:",
          profileError
        );

        // ------------------------------------------------
        // Profile fallback from local storage
        // ------------------------------------------------

        const storedUser =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user");

        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);

            setProfile({
              patient_id:
                user?.patient_id ||
                user?.patientId ||
                patientId,

              full_name:
                user?.full_name ||
                user?.name ||
                "",

              email:
                user?.email || "",

              phone:
                user?.phone || "",

              age:
                user?.age ?? "",

              gender:
                user?.gender || "",

              blood_group:
                user?.blood_group || "",

              address:
                user?.address || "",

              emergency_contact:
                user?.emergency_contact || "",

              photo:
                user?.photo || "",

              created_at:
                user?.created_at || "",
            });
          } catch (userError) {
            console.error(
              "Unable to load stored profile:",
              userError
            );
          }
        }
      }

      // =================================================
      // 2. LOAD MEDICAL HISTORY
      // =================================================

      let medicalRecords = [];

      try {
        const historyResponse = await axios.get(
          `${API_BASE_URL}/medical-history/${patientId}`
        );

        if (
          Array.isArray(
            historyResponse.data
          )
        ) {
          medicalRecords =
            historyResponse.data;
        } else if (
          Array.isArray(
            historyResponse.data?.records
          )
        ) {
          medicalRecords =
            historyResponse.data.records;
        } else if (
          Array.isArray(
            historyResponse.data?.history
          )
        ) {
          medicalRecords =
            historyResponse.data.history;
        } else {
          medicalRecords = [];
        }
      } catch (historyError) {
        console.error(
          "Unable to load medical history:",
          historyError
        );

        medicalRecords = [];
      }

      // =================================================
      // 3. CALCULATE TOTAL HEALTH REPORTS
      // =================================================

      const reportIds = new Set();

      medicalRecords.forEach((record) => {
        const reportId =
          record?.report_id ||
          record?.reportId;

        if (
          reportId &&
          String(reportId).trim() !== ""
        ) {
          reportIds.add(
            String(reportId).trim()
          );
        }
      });

      setTotalReports(reportIds.size);

      // =================================================
      // 4. GET LATEST MEDICAL RECORD
      // =================================================

      let latestRecord = null;

      if (medicalRecords.length > 0) {
        const sortedRecords = [
          ...medicalRecords,
        ].sort((a, b) => {
          return (
            getRecordTimestamp(b) -
            getRecordTimestamp(a)
          );
        });

        latestRecord = sortedRecords[0];
      }

      // =================================================
      // 5. LOAD LATEST PREDICTION
      // =================================================

      if (latestRecord) {
        setLatestPrediction({
          disease:
            latestRecord.disease ||
            latestRecord.predicted_disease ||
            latestRecord["Predicted Disease"] ||
            "No Prediction",

          confidence:
            latestRecord.confidence ??
            latestRecord.prediction_confidence ??
            null,

          risk_level:
            latestRecord.risk_level ||
            latestRecord.riskLevel ||
            "No Risk Data",

          risk_score:
            latestRecord.risk_score ??
            latestRecord.riskScore ??
            null,
        });
      } else {
        // ------------------------------------------------
        // Fallback to locally stored prediction
        // ------------------------------------------------

        const storedPrediction =
          localStorage.getItem(
            "prediction"
          );

        if (storedPrediction) {
          try {
            const prediction =
              JSON.parse(
                storedPrediction
              );

            setLatestPrediction({
              disease:
                prediction?.disease ||
                prediction?.[
                  "Predicted Disease"
                ] ||
                prediction?.predicted_disease ||
                "No Prediction",

              confidence:
                prediction?.confidence ??
                null,

              risk_level:
                prediction?.risk_level ||
                prediction?.riskLevel ||
                "No Risk Data",

              risk_score:
                prediction?.risk_score ??
                prediction?.riskScore ??
                null,
            });
          } catch (
            predictionParseError
          ) {
            console.error(
              "Unable to read stored prediction:",
              predictionParseError
            );
          }
        } else {
          setLatestPrediction({
            disease: "No Prediction",
            confidence: null,
            risk_level:
              "No Risk Data",
            risk_score: null,
          });
        }
      }
    } catch (dashboardError) {
      console.error(
        "Dashboard loading error:",
        dashboardError
      );

      let message =
        "Unable to load dashboard information.";

      if (
        dashboardError.response?.data
          ?.detail
      ) {
        message =
          dashboardError.response.data.detail;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [getPatientId]);

  // ===================================================
  // Initial Dashboard Load
  // ===================================================

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // ===================================================
  // Refresh Dashboard When User Returns To Tab
  // ===================================================

  useEffect(() => {
    const handleWindowFocus = () => {
      loadDashboardData();
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        loadDashboardData();
      }
    };

    window.addEventListener(
      "focus",
      handleWindowFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleWindowFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadDashboardData]);

  // ===================================================
  // Format Patient Age
  // ===================================================

  const getAgeText = () => {
    if (
      profile.age === "" ||
      profile.age === null ||
      profile.age === undefined
    ) {
      return "--";
    }

    return `${profile.age} Years`;
  };

  // ===================================================
  // Format Prediction Confidence
  // ===================================================

  const getConfidenceText = () => {
    if (
      latestPrediction.confidence ===
        null ||
      latestPrediction.confidence ===
        undefined ||
      latestPrediction.confidence === ""
    ) {
      return "--";
    }

    const confidence = Number(
      latestPrediction.confidence
    );

    if (Number.isNaN(confidence)) {
      return `${latestPrediction.confidence}`;
    }

    // -------------------------------------------------
    // If backend stores 0.94 -> 94%
    // -------------------------------------------------

    if (confidence <= 1) {
      return `${Math.round(
        confidence * 100
      )}%`;
    }

    return `${Math.round(confidence)}%`;
  };

  // ===================================================
  // Format Risk Level
  // ===================================================

  const getRiskLevelText = () => {
    if (
      !latestPrediction.risk_level ||
      latestPrediction.risk_level ===
        "No Risk Data"
    ) {
      return "No Data";
    }

    return latestPrediction.risk_level;
  };

  // ===================================================
  // Loading Screen
  // ===================================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h3>Loading Dashboard</h3>

          <p>
            Please wait while we load your
            healthcare information.
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN DASHBOARD
  // ===================================================

  return (
    <div className="dashboard-page">

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="dashboard-error">
          <FaExclamationTriangle />

          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          HEALTH QUOTATION SCROLLER
      ================================================= */}

      <div className="health-quote-bar">
        <div className="health-quote-track">

          <span>
            “Take care of your body. It’s the
            only place you have to live.”
          </span>

          <span>
            “Health is not just about what
            you’re eating. It’s also about what
            you’re thinking and saying.”
          </span>

          <span>
            “A healthy outside starts from
            the inside.”
          </span>

          <span>
            “Your health is an investment,
            not an expense.”
          </span>

          {/* Duplicate quotations for
              seamless scrolling */}

          <span>
            “Take care of your body. It’s the
            only place you have to live.”
          </span>

          <span>
            “Health is not just about what
            you’re eating. It’s also about what
            you’re thinking and saying.”
          </span>

          <span>
            “A healthy outside starts from
            the inside.”
          </span>

          <span>
            “Your health is an investment,
            not an expense.”
          </span>

        </div>
      </div>

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <div className="hero-card">

        <div className="hero-left">

          <span className="hero-subtitle">
            👋 Good Morning
          </span>

          <h1>
            Welcome Back,

            <span className="text-primary">
              {" "}
              {profile.full_name ||
                "Patient"}
            </span>
          </h1>

          <p>
            MedAssist AI helps you analyze
            symptoms, predict diseases using
            Artificial Intelligence, calculate
            health risks and generate
            professional healthcare reports.
          </p>

          <button
            className="start-btn"
            onClick={() =>
              navigate(
                "/health-analysis"
              )
            }
          >
            <FaPlayCircle />

            Start New Health Analysis
          </button>

        </div>

        <div className="hero-right">

          <div className="hero-icon">
            <FaRobot />
          </div>

        </div>

      </div>

      {/* =================================================
          QUICK STATS
      ================================================= */}

      <div className="stats-container">

        {/* TOTAL REPORTS */}

        <div className="stat-card blue">

          <FaFileMedical
            className="stat-icon"
          />

          <div>

            <h2>
              {totalReports}
            </h2>

            <p>
              Total Reports
            </p>

          </div>

        </div>

        {/* LATEST PREDICTION */}

        <div className="stat-card green">

          <FaHeartbeat
            className="stat-icon"
          />

          <div>

            <h2>
              {latestPrediction.disease}
            </h2>

            <p>
              Latest Prediction
            </p>

          </div>

        </div>

        {/* CURRENT RISK */}

        <div className="stat-card orange">

          <FaChartLine
            className="stat-icon"
          />

          <div>

            <h2>
              {getRiskLevelText()}
            </h2>

            <p>
              Current Risk
            </p>

          </div>

        </div>

        {/* LATEST PREDICTION CONFIDENCE */}

        <div className="stat-card purple">

          <FaNotesMedical
            className="stat-icon"
          />

          <div>

            <h2>
              {getConfidenceText()}
            </h2>

            <p>
              Latest Prediction
              Confidence
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          TWO COLUMN
      ================================================= */}

      <div className="dashboard-grid">

        {/* =================================================
            PATIENT CARD
        ================================================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <FaUserCircle />

            <h3>
              Patient Information
            </h3>

          </div>

          <div className="patient-profile">

            <div className="profile-avatar">

              <FaUserCircle />

            </div>

            <div>

              <h4>
                {profile.full_name ||
                  "Patient"}
              </h4>

              <span>
                {profile.patient_id ||
                  "--"}
              </span>

            </div>

          </div>

          <div className="patient-details">

            {/* Age */}

            <div>

              <label>
                Age
              </label>

              <p>
                {getAgeText()}
              </p>

            </div>

            {/* Gender */}

            <div>

              <label>
                Gender
              </label>

              <p>
                {profile.gender ||
                  "--"}
              </p>

            </div>

            {/* Blood Group */}

            <div>

              <label>
                Blood Group
              </label>

              <p>
                {profile.blood_group ||
                  "--"}
              </p>

            </div>

            {/* Phone */}

            <div>

              <label>
                Phone
              </label>

              <p>
                {profile.phone ||
                  "--"}
              </p>

            </div>

            {/* Email */}

            <div>

              <label>
                Email
              </label>

              <p>
                {profile.email ||
                  "--"}
              </p>

            </div>

            {/* Account */}

            <div>

              <label>
                Account
              </label>

              <p>
                Active
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            AI WORKFLOW
        ================================================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <FaRobot />

            <h3>
              How MedAssist AI Works
            </h3>

          </div>

          <div className="workflow">

            <div className="workflow-step">

              <span>
                1
              </span>

              <p>
                Select Symptoms
              </p>

            </div>

            <FaArrowRight />

            <div className="workflow-step">

              <span>
                2
              </span>

              <p>
                AI Prediction
              </p>

            </div>

            <FaArrowRight />

            <div className="workflow-step">

              <span>
                3
              </span>

              <p>
                Risk Analysis
              </p>

            </div>

            <FaArrowRight />

            <div className="workflow-step">

              <span>
                4
              </span>

              <p>
                Treatment
              </p>

            </div>

            <FaArrowRight />

            <div className="workflow-step">

              <span>
                5
              </span>

              <p>
                Health Report
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          SECOND GRID
      ================================================= */}

      <div className="dashboard-grid mt-4">

        {/* =================================================
            IMPORTANT INSTRUCTIONS
        ================================================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <FaShieldAlt />

            <h3>
              Important Instructions
            </h3>

          </div>

          <ul className="instruction-list">

            <li>
              Enter genuine symptoms for
              accurate disease prediction.
            </li>

            <li>
              Complete your medical history
              whenever possible.
            </li>

            <li>
              AI predictions are for
              assistance only and should
              not replace professional
              medical advice.
            </li>

            <li>
              Consult a qualified doctor
              immediately for emergency
              situations.
            </li>

            <li>
              All your health records are
              securely stored and encrypted.
            </li>

          </ul>

        </div>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <div className="dashboard-card">

          <div className="card-header">

            <FaBell />

            <h3>
              Notifications
            </h3>

          </div>

          <div className="notification-box">

            <div className="notification-item">

              <FaCalendarAlt
                className="notify-icon"
              />

              <div>

                <h5>
                  Welcome to MedAssist AI
                </h5>

                <span>
                  Your healthcare dashboard
                  is ready.
                </span>

              </div>

            </div>

            <div className="notification-item">

              <FaClock
                className="notify-icon"
              />

              <div>

                <h5>
                  Health Reports
                </h5>

                <span>
                  You currently have{" "}
                  <strong>
                    {totalReports}
                  </strong>{" "}
                  generated report
                  {totalReports === 1
                    ? ""
                    : "s"}.
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          DAILY HEALTH TIPS
      ================================================= */}

      <div className="dashboard-card mt-4">

        <div className="card-header">

          <FaHeartbeat />

          <h3>
            Daily Health Tips
          </h3>

        </div>

        <div className="tips-grid">

          <div className="tip-card">
            💧 Drink at least 2–3 liters
            of water daily.
          </div>

          <div className="tip-card">
            🥗 Eat a balanced diet rich
            in fruits and vegetables.
          </div>

          <div className="tip-card">
            🚶 Exercise for at least 30
            minutes every day.
          </div>

          <div className="tip-card">
            😴 Get 7–8 hours of quality
            sleep.
          </div>

        </div>

      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="dashboard-footer">

        <p>
          © 2026 MedAssist AI |
          AI-Powered Medical Symptom Analysis &
          Disease Prediction System
        </p>

      </div>

    </div>
  );
}

export default Dashboard;