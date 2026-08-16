import {
  FaUsers,
  FaFileMedical,
  FaChartLine,
  FaDatabase,
  FaExclamationTriangle,
  FaHeartbeat,
  FaArrowRight,
  FaCheckCircle,
  FaHistory,
  FaUserShield,
  FaSpinner,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/AdminDashboard.css";

// =====================================================
// API BASE URL
// =====================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// =====================================================
// ADMIN DASHBOARD
// =====================================================

function AdminDashboard() {
  const navigate = useNavigate();

  // =====================================================
  // DASHBOARD STATISTICS
  // =====================================================

  const [statistics, setStatistics] = useState({
    total_patients: 0,
    total_predictions: 0,
    total_reports: 0,
    medical_history_records: 0,
    high_risk_patients: 0,
    critical_patients: 0,
  });

  // =====================================================
  // PATIENTS
  // =====================================================

  const [patients, setPatients] = useState([]);

  // =====================================================
  // DISEASE DISTRIBUTION
  // =====================================================

  const [diseaseDistribution, setDiseaseDistribution] =
    useState([]);

  // =====================================================
  // RISK DISTRIBUTION
  // =====================================================

  const [riskDistribution, setRiskDistribution] =
    useState([]);

  // =====================================================
  // LOADING
  // =====================================================

  const [loading, setLoading] = useState(true);

  // =====================================================
  // ERROR
  // =====================================================

  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  // =====================================================
  // LOAD DASHBOARD DATA
  // =====================================================

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // =================================================
      // GET DASHBOARD STATISTICS
      // =================================================

      const statisticsResponse = await axios.get(
        `${API_BASE_URL}/admin/dashboard-statistics`
      );

      console.log(
        "Admin dashboard statistics:",
        statisticsResponse.data
      );

      setStatistics({
        total_patients:
          statisticsResponse.data?.total_patients || 0,

        total_predictions:
          statisticsResponse.data?.total_predictions || 0,

        total_reports:
          statisticsResponse.data?.total_reports || 0,

        medical_history_records:
          statisticsResponse.data
            ?.medical_history_records || 0,

        high_risk_patients:
          statisticsResponse.data
            ?.high_risk_patients || 0,

        critical_patients:
          statisticsResponse.data
            ?.critical_patients || 0,
      });

      // =================================================
      // GET ALL PATIENTS
      // =================================================

      const patientsResponse = await axios.get(
        `${API_BASE_URL}/admin/patients`
      );

      console.log(
        "Admin patients:",
        patientsResponse.data
      );

      setPatients(
        patientsResponse.data?.patients || []
      );

      // =================================================
      // GET DISEASE DISTRIBUTION
      // =================================================

      const diseaseResponse = await axios.get(
        `${API_BASE_URL}/admin/analytics/disease-distribution`
      );

      console.log(
        "Disease distribution:",
        diseaseResponse.data
      );

      setDiseaseDistribution(
        diseaseResponse.data?.distribution || []
      );

      // =================================================
      // GET RISK DISTRIBUTION
      // =================================================

      const riskResponse = await axios.get(
        `${API_BASE_URL}/admin/analytics/risk-distribution`
      );

      console.log(
        "Risk distribution:",
        riskResponse.data
      );

      setRiskDistribution(
        riskResponse.data?.distribution || []
      );

    } catch (err) {
      console.error(
        "Admin dashboard loading error:",
        err
      );

      if (err.response) {
        console.error(
          "Backend response:",
          err.response.data
        );

        setError(
          err.response.data?.detail ||
          "Unable to load dashboard data."
        );
      } else {
        setError(
          "Unable to connect to the backend server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    try {
      return new Date(
        dateValue
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // =====================================================
  // GET PATIENT INITIAL
  // =====================================================

  const getPatientInitial = (name) => {
    if (!name) {
      return "P";
    }

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  // =====================================================
  // GET TOP DISEASE
  // =====================================================

  const getTopDisease = () => {
    if (
      !diseaseDistribution ||
      diseaseDistribution.length === 0
    ) {
      return null;
    }

    return diseaseDistribution[0];
  };

  // =====================================================
  // GET RISK COUNT
  // =====================================================

  const getRiskCount = (level) => {
    const item = riskDistribution.find(
      (risk) =>
        risk.risk_level === level
    );

    return item?.count || 0;
  };

  // =====================================================
  // STATISTICS CARDS
  // =====================================================

  const statisticCards = [
    {
      title: "Total Patients",
      value: statistics.total_patients,
      description:
        "Registered patients",
      icon: <FaUsers />,
      className: "patients",
      path: "/admin/patients",
    },

    {
      title: "Total Predictions",
      value: statistics.total_predictions,
      description:
        "Disease predictions",
      icon: <FaHeartbeat />,
      className: "predictions",
      path: "/admin/analytics",
    },

    {
      title: "Total Reports",
      value: statistics.total_reports,
      description:
        "Generated medical reports",
      icon: <FaFileMedical />,
      className: "reports",
      path: "/admin/reports",
    },

    {
      title: "Medical Records",
      value:
        statistics.medical_history_records,
      description:
        "Medical history records",
      icon: <FaHistory />,
      className: "history",
      path: "/admin/patients",
    },

    {
      title: "High Risk",
      value:
        statistics.high_risk_patients,
      description:
        "High risk predictions",
      icon: <FaExclamationTriangle />,
      className: "high-risk",
      path: "/admin/patients",
    },

    {
      title: "Critical",
      value:
        statistics.critical_patients,
      description:
        "Critical risk predictions",
      icon: <FaExclamationTriangle />,
      className: "critical",
      path: "/admin/patients",
    },
  ];

  // =====================================================
  // TOP PATIENTS
  // =====================================================

  const recentPatients = patients
    ? patients.slice(0, 5)
    : [];

  // =====================================================
  // TOP DISEASE
  // =====================================================

  const topDisease = getTopDisease();

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="admin-dashboard-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Monitor and manage the MedAssist AI
            healthcare platform.
          </p>

        </div>

        <button
          type="button"
          className="admin-refresh-btn"
          onClick={loadDashboardData}
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSpinner className="spin" />
              Loading...
            </>
          ) : (
            <>
              <FaChartLine />
              Refresh Data
            </>
          )}
        </button>

      </section>


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (

        <div className="admin-dashboard-error">

          <FaExclamationTriangle />

          <div>

            <strong>
              Unable to load dashboard
            </strong>

            <p>
              {error}
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="admin-dashboard-loading">

          <FaSpinner className="spin" />

          <p>
            Loading dashboard data...
          </p>

        </div>

      ) : (

        <>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="admin-statistics">

            {statisticCards.map(
              (card) => (

                <button
                  type="button"
                  key={card.title}
                  className={`admin-stat-card ${card.className}`}
                  onClick={() =>
                    navigate(card.path)
                  }
                >

                  <div className="admin-stat-top">

                    <div className="admin-stat-icon">
                      {card.icon}
                    </div>

                    <FaArrowRight className="admin-stat-arrow" />

                  </div>

                  <div className="admin-stat-content">

                    <span className="admin-stat-title">
                      {card.title}
                    </span>

                    <h2>
                      {card.value}
                    </h2>

                    <p>
                      {card.description}
                    </p>

                  </div>

                </button>

              )
            )}

          </section>


          {/* =================================================
              MAIN GRID
          ================================================= */}

          <section className="admin-dashboard-grid">

            {/* =================================================
                RECENT PATIENTS
            ================================================= */}

            <div className="admin-dashboard-card admin-patients-card">

              <div className="admin-card-header">

                <div>

                  <h2>
                    Registered Patients
                  </h2>

                  <p>
                    Patients currently registered
                    in the system
                  </p>

                </div>

                <button
                  type="button"
                  className="admin-view-all-btn"
                  onClick={() =>
                    navigate(
                      "/admin/patients"
                    )
                  }
                >
                  View All
                  <FaArrowRight />
                </button>

              </div>


              {recentPatients.length === 0 ? (

                <div className="admin-empty-state">

                  <FaUsers />

                  <p>
                    No patients found.
                  </p>

                </div>

              ) : (

                <div className="admin-patients-table-wrapper">

                  <table className="admin-patients-table">

                    <thead>

                      <tr>

                        <th>
                          Patient
                        </th>

                        <th>
                          Patient ID
                        </th>

                        <th>
                          Age
                        </th>

                        <th>
                          Gender
                        </th>

                        <th>
                          Registered
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {recentPatients.map(
                        (patient) => (

                          <tr
                            key={
                              patient.patient_id
                            }
                            onClick={() =>
                              navigate(
                                `/admin/patients/${patient.patient_id}`
                              )
                            }
                            className="admin-patient-row"
                          >

                            <td>

                              <div className="admin-patient-info">

                                <div className="admin-patient-avatar">

                                  {getPatientInitial(
                                    patient.full_name
                                  )}

                                </div>

                                <div>

                                  <strong>
                                    {patient.full_name ||
                                      "Unknown Patient"}
                                  </strong>

                                  <span>
                                    {patient.email ||
                                      "No email"}
                                  </span>

                                </div>

                              </div>

                            </td>

                            <td>

                              <span className="admin-patient-id">

                                {patient.patient_id}

                              </span>

                            </td>

                            <td>

                              {patient.age ??
                                "N/A"}

                            </td>

                            <td>

                              {patient.gender ||
                                "N/A"}

                            </td>

                            <td>

                              {formatDate(
                                patient.created_at
                              )}

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              )}

            </div>


            {/* =================================================
                SYSTEM OVERVIEW
            ================================================= */}

            <div className="admin-dashboard-card admin-system-card">

              <div className="admin-card-header">

                <div>

                  <h2>
                    Health System Overview
                  </h2>

                  <p>
                    Data calculated from the
                    backend
                  </p>

                </div>

              </div>


              <div className="admin-system-content">

                {/* High Risk */}

                <div className="admin-system-item">

                  <div className="admin-system-icon danger">
                    <FaExclamationTriangle />
                  </div>

                  <div className="admin-system-info">

                    <strong>
                      High Risk
                    </strong>

                    <span>
                      HIGH risk predictions
                    </span>

                  </div>

                  <span className="admin-system-value danger-text">

                    {statistics.high_risk_patients}

                  </span>

                </div>


                {/* Critical */}

                <div className="admin-system-item">

                  <div className="admin-system-icon critical-icon">
                    <FaHeartbeat />
                  </div>

                  <div className="admin-system-info">

                    <strong>
                      Critical
                    </strong>

                    <span>
                      CRITICAL risk predictions
                    </span>

                  </div>

                  <span className="admin-system-value critical-text">

                    {statistics.critical_patients}

                  </span>

                </div>


                {/* Low Risk */}

                <div className="admin-system-item">

                  <div className="admin-system-icon success">
                    <FaCheckCircle />
                  </div>

                  <div className="admin-system-info">

                    <strong>
                      Low Risk
                    </strong>

                    <span>
                      LOW risk predictions
                    </span>

                  </div>

                  <span className="admin-system-value">

                    {getRiskCount("LOW")}

                  </span>

                </div>


                {/* Medium Risk */}

                <div className="admin-system-item">

                  <div className="admin-system-icon warning">
                    <FaExclamationTriangle />
                  </div>

                  <div className="admin-system-info">

                    <strong>
                      Medium Risk
                    </strong>

                    <span>
                      MEDIUM risk predictions
                    </span>

                  </div>

                  <span className="admin-system-value warning-text">

                    {getRiskCount("MEDIUM")}

                  </span>

                </div>


                {/* Top Disease */}

                <div className="admin-system-item">

                  <div className="admin-system-icon primary">
                    <FaHeartbeat />
                  </div>

                  <div className="admin-system-info">

                    <strong>
                      Most Predicted Disease
                    </strong>

                    <span>
                      Based on prediction records
                    </span>

                  </div>

                  <span className="admin-system-disease">

                    {topDisease
                      ? topDisease.disease
                      : "N/A"}

                  </span>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="admin-dashboard-card admin-quick-actions-card">

            <div className="admin-card-header">

              <div>

                <h2>
                  Administration Tools
                </h2>

                <p>
                  Access different areas of the
                  administration portal
                </p>

              </div>

            </div>


            <div className="admin-quick-actions">

              {/* Patients */}

              <button
                type="button"
                className="admin-quick-action"
                onClick={() =>
                  navigate(
                    "/admin/patients"
                  )
                }
              >

                <div className="admin-quick-action-icon">
                  <FaUsers />
                </div>

                <div className="admin-quick-action-content">

                  <strong>
                    Manage Patients
                  </strong>

                  <span>
                    View registered patients
                  </span>

                </div>

                <FaArrowRight />

              </button>


              {/* Reports */}

              <button
                type="button"
                className="admin-quick-action"
                onClick={() =>
                  navigate(
                    "/admin/reports"
                  )
                }
              >

                <div className="admin-quick-action-icon">
                  <FaFileMedical />
                </div>

                <div className="admin-quick-action-content">

                  <strong>
                    Medical Reports
                  </strong>

                  <span>
                    View generated reports
                  </span>

                </div>

                <FaArrowRight />

              </button>


              {/* Analytics */}

              <button
                type="button"
                className="admin-quick-action"
                onClick={() =>
                  navigate(
                    "/admin/analytics"
                  )
                }
              >

                <div className="admin-quick-action-icon">
                  <FaChartLine />
                </div>

                <div className="admin-quick-action-content">

                  <strong>
                    Analytics
                  </strong>

                  <span>
                    View healthcare analytics
                  </span>

                </div>

                <FaArrowRight />

              </button>


              {/* Disease Knowledge */}

              <button
                type="button"
                className="admin-quick-action"
                onClick={() =>
                  navigate(
                    "/admin/disease-knowledge"
                  )
                }
              >

                <div className="admin-quick-action-icon">
                  <FaDatabase />
                </div>

                <div className="admin-quick-action-content">

                  <strong>
                    Disease Knowledge
                  </strong>

                  <span>
                    Manage disease information
                  </span>

                </div>

                <FaArrowRight />

              </button>

            </div>

          </section>


          {/* =================================================
              DATABASE SUMMARY
          ================================================= */}

          <section className="admin-dashboard-footer">

            <div className="admin-footer-item">

              <FaUsers />

              <div>

                <strong>
                  {statistics.total_patients}
                </strong>

                <span>
                  Total Patients
                </span>

              </div>

            </div>


            <div className="admin-footer-item">

              <FaHeartbeat />

              <div>

                <strong>
                  {statistics.total_predictions}
                </strong>

                <span>
                  Total Predictions
                </span>

              </div>

            </div>


            <div className="admin-footer-item">

              <FaFileMedical />

              <div>

                <strong>
                  {statistics.total_reports}
                </strong>

                <span>
                  Total Reports
                </span>

              </div>

            </div>


            <div className="admin-footer-item">

              <FaUserShield />

              <div>

                <strong>
                  {statistics.medical_history_records}
                </strong>

                <span>
                  Medical Records
                </span>

              </div>

            </div>

          </section>


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

        </>

      )}

    </div>
  );
}

// =====================================================
// EXPORT
// =====================================================

export default AdminDashboard;