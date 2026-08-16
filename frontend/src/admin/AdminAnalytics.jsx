import {
  FaChartLine,
  FaChartBar,
  FaShieldAlt,
  FaHeartbeat,
  FaExclamationTriangle,
  FaUsers,
  FaFileMedical,
  FaNotesMedical,
  FaBullseye,
  FaArrowUp,
  FaDatabase,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Line,
  Doughnut,
  Bar,
} from "react-chartjs-2";

import "../css/AdminAnalytics.css";

// =====================================================
// REGISTER CHART.JS COMPONENTS
// =====================================================

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// =====================================================
// COMPONENT
// =====================================================

function AdminAnalytics() {

  // ===================================================
  // STATES
  // ===================================================

  const [dashboardStats, setDashboardStats] =
    useState(null);

  const [diseaseDistribution, setDiseaseDistribution] =
    useState([]);

  const [riskDistribution, setRiskDistribution] =
    useState([]);

  const [monthlyTrend, setMonthlyTrend] =
    useState([]);

  const [commonDiseases, setCommonDiseases] =
    useState([]);

  const [commonSymptoms, setCommonSymptoms] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ===================================================
  // BASE URL
  // ===================================================

  const BASE_URL = "http://127.0.0.1:8000";

  // ===================================================
  // LOAD ANALYTICS
  // ===================================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ===================================================
  // LOAD ALL ADMIN ANALYTICS
  // ===================================================

  const loadAnalytics = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        dashboardResponse,
        diseaseResponse,
        riskResponse,
        monthlyResponse,
        commonDiseaseResponse,
        commonSymptomsResponse,
      ] = await Promise.allSettled([

        // Dashboard Statistics
        axios.get(
          `${BASE_URL}/admin/dashboard-statistics`
        ),

        // Disease Distribution
        axios.get(
          `${BASE_URL}/admin/analytics/disease-distribution`
        ),

        // Risk Distribution
        axios.get(
          `${BASE_URL}/admin/analytics/risk-distribution`
        ),

        // Monthly Prediction Trend
        axios.get(
          `${BASE_URL}/admin/analytics/monthly-prediction-trend`
        ),

        // Most Common Diseases
        axios.get(
          `${BASE_URL}/admin/analytics/most-common-diseases`
        ),

        // Most Common Symptoms
        axios.get(
          `${BASE_URL}/admin/analytics/most-common-symptoms`
        ),
      ]);

      // =================================================
      // DASHBOARD STATISTICS
      // =================================================

      if (
        dashboardResponse.status === "fulfilled"
      ) {

        setDashboardStats(
          dashboardResponse.value.data
        );

      } else {

        console.warn(
          "Dashboard Statistics API Error:",
          dashboardResponse.reason
        );

      }

      // =================================================
      // DISEASE DISTRIBUTION
      // =================================================

      if (
        diseaseResponse.status === "fulfilled"
      ) {

        const data =
          diseaseResponse.value.data;

        setDiseaseDistribution(
          Array.isArray(data?.distribution)
            ? data.distribution
            : []
        );

      } else {

        console.warn(
          "Disease Distribution API Error:",
          diseaseResponse.reason
        );

        setDiseaseDistribution([]);

      }

      // =================================================
      // RISK DISTRIBUTION
      // =================================================

      if (
        riskResponse.status === "fulfilled"
      ) {

        const data =
          riskResponse.value.data;

        setRiskDistribution(
          Array.isArray(data?.distribution)
            ? data.distribution
            : []
        );

      } else {

        console.warn(
          "Risk Distribution API Error:",
          riskResponse.reason
        );

        setRiskDistribution([]);

      }

      // =================================================
      // MONTHLY TREND
      // =================================================

      if (
        monthlyResponse.status === "fulfilled"
      ) {

        const data =
          monthlyResponse.value.data;

        setMonthlyTrend(
          Array.isArray(data?.trend)
            ? data.trend
            : []
        );

      } else {

        console.warn(
          "Monthly Prediction Trend API Error:",
          monthlyResponse.reason
        );

        setMonthlyTrend([]);

      }

      // =================================================
      // MOST COMMON DISEASES
      // =================================================

      if (
        commonDiseaseResponse.status === "fulfilled"
      ) {

        const data =
          commonDiseaseResponse.value.data;

        setCommonDiseases(
          Array.isArray(data?.top_diseases)
            ? data.top_diseases
            : []
        );

      } else {

        console.warn(
          "Most Common Diseases API Error:",
          commonDiseaseResponse.reason
        );

        setCommonDiseases([]);

      }

      // =================================================
      // MOST COMMON SYMPTOMS
      // =================================================

      if (
        commonSymptomsResponse.status === "fulfilled"
      ) {

        const data =
          commonSymptomsResponse.value.data;

        setCommonSymptoms(
          Array.isArray(data?.top_symptoms)
            ? data.top_symptoms
            : []
        );

      } else {

        console.warn(
          "Most Common Symptoms API Error:",
          commonSymptomsResponse.reason
        );

        setCommonSymptoms([]);

      }

      // =================================================
      // CHECK IF ALL FAILED
      // =================================================

      const allFailed =
        dashboardResponse.status === "rejected" &&
        diseaseResponse.status === "rejected" &&
        riskResponse.status === "rejected" &&
        monthlyResponse.status === "rejected" &&
        commonDiseaseResponse.status === "rejected" &&
        commonSymptomsResponse.status === "rejected";

      if (allFailed) {

        setError(
          "Unable to load admin analytics. Please check the backend server."
        );

      }

    } catch (err) {

      console.error(
        "Admin Analytics Error:",
        err
      );

      setError(
        "Unable to load admin analytics."
      );

    } finally {

      setLoading(false);

    }

  };

  // ===================================================
  // DASHBOARD VALUES
  // ===================================================

  const totalPatients =
    Number(dashboardStats?.total_patients) || 0;

  const totalPredictions =
    Number(dashboardStats?.total_predictions) || 0;

  const totalReports =
    Number(dashboardStats?.total_reports) || 0;

  const medicalHistoryRecords =
    Number(dashboardStats?.medical_history_records) || 0;

  const highRiskPatients =
    Number(dashboardStats?.high_risk_patients) || 0;

  const criticalPatients =
    Number(dashboardStats?.critical_patients) || 0;

  // ===================================================
  // MONTHLY TREND
  // ===================================================

  const monthlyLabels =
    monthlyTrend.map(
      (item) =>
        item.month || "Unknown"
    );

  const monthlyValues =
    monthlyTrend.map(
      (item) =>
        Number(item.predictions) || 0
    );

  // ===================================================
  // MONTHLY LINE CHART DATA
  // ===================================================

  const monthlyChartData = {

    labels:
      monthlyLabels.length > 0
        ? monthlyLabels
        : ["No Data"],

    datasets: [
      {
        label: "Predictions",

        data:
          monthlyValues.length > 0
            ? monthlyValues
            : [0],

        borderColor: "#4169e1",

        backgroundColor:
          "rgba(65, 105, 225, 0.12)",

        pointBackgroundColor:
          "#4169e1",

        pointBorderColor:
          "#ffffff",

        pointBorderWidth: 2,

        pointRadius: 5,

        pointHoverRadius: 7,

        borderWidth: 3,

        tension: 0.4,

        fill: true,
      },
    ],
  };

  // ===================================================
  // MONTHLY LINE CHART OPTIONS
  // ===================================================

  const monthlyChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      intersect: false,
      mode: "index",
    },

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        enabled: true,

        backgroundColor: "#172033",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 12,

        cornerRadius: 8,

        displayColors: false,
      },
    },

    scales: {

      y: {

        beginAtZero: true,

        ticks: {
          precision: 0,
          color: "#64748b",
          font: {
            size: 11,
          },
        },

        grid: {
          color:
            "rgba(148, 163, 184, 0.16)",
        },

        border: {
          display: false,
        },
      },

      x: {

        ticks: {
          color: "#64748b",
          font: {
            size: 11,
          },
        },

        grid: {
          display: false,
        },

        border: {
          display: false,
        },
      },
    },
  };

  // ===================================================
  // RISK DISTRIBUTION
  // ===================================================

  const riskLabels = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ];

  const riskValues =
    riskLabels.map((level) => {

      const item =
        riskDistribution.find(
          (record) =>
            String(
              record.risk_level || ""
            ).toUpperCase() === level
        );

      return item
        ? Number(item.count) || 0
        : 0;

    });

  // ===================================================
  // RISK DOUGHNUT DATA
  // ===================================================

  const riskChartData = {

    labels: riskLabels,

    datasets: [
      {

        data: riskValues,

        backgroundColor: [
          "#22c55e",
          "#f59e0b",
          "#f97316",
          "#ef4444",
        ],

        hoverBackgroundColor: [
          "#16a34a",
          "#d97706",
          "#ea580c",
          "#dc2626",
        ],

        borderColor: "#ffffff",

        borderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  // ===================================================
  // RISK DOUGHNUT OPTIONS
  // ===================================================

  const riskChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: "64%",

    plugins: {

      legend: {

        position: "right",

        labels: {

          usePointStyle: true,

          pointStyle: "circle",

          padding: 18,

          color: "#475569",

          font: {
            size: 12,
            weight: "500",
          },
        },
      },

      tooltip: {

        backgroundColor: "#172033",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 12,

        cornerRadius: 8,

        callbacks: {

          label: function (context) {

            const value =
              context.raw || 0;

            return ` ${context.label}: ${value}`;

          },
        },
      },
    },
  };

  // ===================================================
  // DISEASE DISTRIBUTION
  // ===================================================

  const diseaseLabels =
    diseaseDistribution.map(
      (item) =>
        item.disease || "Unknown"
    );

  const diseaseValues =
    diseaseDistribution.map(
      (item) =>
        Number(item.count) || 0
    );

  // ===================================================
  // DISEASE BAR CHART DATA
  // ===================================================

  const diseaseChartData = {

    labels:
      diseaseLabels.length > 0
        ? diseaseLabels
        : ["No Data"],

    datasets: [
      {

        label: "Predictions",

        data:
          diseaseValues.length > 0
            ? diseaseValues
            : [0],

        backgroundColor:
          "rgba(65, 105, 225, 0.78)",

        hoverBackgroundColor:
          "#4169e1",

        borderColor:
          "#4169e1",

        borderWidth: 1,

        borderRadius: 7,

        borderSkipped: false,

        maxBarThickness: 48,
      },
    ],
  };

  // ===================================================
  // DISEASE BAR OPTIONS
  // ===================================================

  const diseaseChartOptions = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        backgroundColor: "#172033",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 12,

        cornerRadius: 8,

        displayColors: false,

        callbacks: {

          label: function (context) {

            return ` Predictions: ${context.raw}`;

          },
        },
      },
    },

    scales: {

      y: {

        beginAtZero: true,

        ticks: {

          precision: 0,

          color: "#64748b",

          font: {
            size: 11,
          },
        },

        grid: {

          color:
            "rgba(148, 163, 184, 0.16)",
        },

        border: {
          display: false,
        },
      },

      x: {

        grid: {
          display: false,
        },

        ticks: {

          color: "#64748b",

          maxRotation: 35,

          minRotation: 0,

          font: {
            size: 10,
          },
        },

        border: {
          display: false,
        },
      },
    },
  };

  // ===================================================
  // COMMON SYMPTOMS
  // ===================================================

  const topSymptoms =
    commonSymptoms.slice(0, 7);

  const symptomLabels =
    topSymptoms.map(
      (item) =>
        item.symptom || "Unknown"
    );

  const symptomValues =
    topSymptoms.map(
      (item) =>
        Number(item.count) || 0
    );

  // ===================================================
  // SYMPTOM BAR DATA
  // ===================================================

  const symptomChartData = {

    labels:
      symptomLabels.length > 0
        ? symptomLabels
        : ["No Data"],

    datasets: [
      {

        label: "Occurrences",

        data:
          symptomValues.length > 0
            ? symptomValues
            : [0],

        backgroundColor:
          "rgba(20, 184, 166, 0.72)",

        hoverBackgroundColor:
          "#0f9f91",

        borderColor:
          "#0f9f91",

        borderWidth: 1,

        borderRadius: 7,

        borderSkipped: false,

        maxBarThickness: 28,
      },
    ],
  };

  // ===================================================
  // SYMPTOM BAR OPTIONS
  // ===================================================

  const symptomChartOptions = {

    indexAxis: "y",

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false,
      },

      tooltip: {

        backgroundColor: "#172033",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 12,

        cornerRadius: 8,

        displayColors: false,

        callbacks: {

          label: function (context) {

            return ` Occurrences: ${context.raw}`;

          },
        },
      },
    },

    scales: {

      x: {

        beginAtZero: true,

        ticks: {

          precision: 0,

          color: "#64748b",

          font: {
            size: 10,
          },
        },

        grid: {

          color:
            "rgba(148, 163, 184, 0.16)",
        },

        border: {
          display: false,
        },
      },

      y: {

        ticks: {

          color: "#64748b",

          font: {
            size: 10,
          },
        },

        grid: {
          display: false,
        },

        border: {
          display: false,
        },
      },
    },
  };

  // ===================================================
  // TOP COMMON DISEASES
  // ===================================================

  const topDiseases =
    commonDiseases.slice(0, 5);

  // ===================================================
  // LOADING SCREEN
  // ===================================================

  if (loading) {

    return (

      <div className="admin-analytics-loading-page">

        <div className="admin-analytics-loading-card">

          <div className="admin-analytics-loading-icon">
            <FaChartBar />
          </div>

          <h2>
            Loading Admin Analytics...
          </h2>

          <p>
            Please wait while we analyze
            the healthcare platform data.
          </p>

          <div className="admin-analytics-spinner"></div>

        </div>

      </div>

    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (

    <div className="admin-analytics-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-analytics-page-header">

        <div className="admin-analytics-header-left">

          <div className="admin-analytics-header-icon">
            <FaChartBar />
          </div>

          <div className="admin-analytics-header-text">

            <h1>
              Admin Analytics
            </h1>

            <p>
              Monitor healthcare activity,
              prediction trends and risk patterns
            </p>

          </div>

        </div>

        <div className="admin-analytics-admin-card">

          <div className="admin-analytics-admin-icon">
            <FaShieldAlt />
          </div>

          <div>

            <span>
              Administration
            </span>

            <strong>
              MedAssist AI
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-analytics-error">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>

      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="admin-analytics-summary-grid">

        <div className="admin-analytics-summary-card blue">

          <div className="admin-analytics-summary-icon">
            <FaUsers />
          </div>

          <div className="admin-analytics-summary-content">

            <span>Total Patients</span>

            <strong>{totalPatients}</strong>

            <small>
              Registered patients
            </small>

          </div>

        </div>

        <div className="admin-analytics-summary-card green">

          <div className="admin-analytics-summary-icon">
            <FaNotesMedical />
          </div>

          <div className="admin-analytics-summary-content">

            <span>Total Predictions</span>

            <strong>{totalPredictions}</strong>

            <small>
              All prediction records
            </small>

          </div>

        </div>

        <div className="admin-analytics-summary-card purple">

          <div className="admin-analytics-summary-icon">
            <FaFileMedical />
          </div>

          <div className="admin-analytics-summary-content">

            <span>Total Reports</span>

            <strong>{totalReports}</strong>

            <small>
              Generated reports
            </small>

          </div>

        </div>

        <div className="admin-analytics-summary-card teal">

          <div className="admin-analytics-summary-icon">
            <FaDatabase />
          </div>

          <div className="admin-analytics-summary-content">

            <span>Medical Records</span>

            <strong>{medicalHistoryRecords}</strong>

            <small>
              History records
            </small>

          </div>

        </div>

        <div className="admin-analytics-summary-card orange">

          <div className="admin-analytics-summary-icon">
            <FaExclamationTriangle />
          </div>

          <div className="admin-analytics-summary-content">

            <span>High Risk Patients</span>

            <strong>{highRiskPatients}</strong>

            <small>
              Require attention
            </small>

          </div>

        </div>

        <div className="admin-analytics-summary-card red">

          <div className="admin-analytics-summary-icon">
            <FaHeartbeat />
          </div>

          <div className="admin-analytics-summary-content">

            <span>Critical Patients</span>

            <strong>{criticalPatients}</strong>

            <small>
              Critical risk cases
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          CHART ROW 1
      ================================================= */}

      <div className="admin-analytics-chart-row">

        {/* MONTHLY TREND */}

        <div className="admin-analytics-chart-card large">

          <div className="admin-analytics-chart-header">

            <div>

              <h2>

                <FaChartLine />

                <span>
                  Monthly Prediction Trend
                </span>

              </h2>

              <p>
                Prediction activity across
                the healthcare platform
              </p>

            </div>

            <span className="admin-analytics-chart-label">
              All Time
            </span>

          </div>

          <div className="admin-analytics-chart-container">

            <Line
              data={monthlyChartData}
              options={monthlyChartOptions}
            />

          </div>

        </div>

        {/* RISK DISTRIBUTION */}

        <div className="admin-analytics-chart-card">

          <div className="admin-analytics-chart-header">

            <div>

              <h2>

                <FaShieldAlt />

                <span>
                  Risk Distribution
                </span>

              </h2>

              <p>
                Overall patient risk levels
              </p>

            </div>

          </div>

          <div className="admin-analytics-risk-chart">

            <Doughnut
              data={riskChartData}
              options={riskChartOptions}
            />

          </div>

        </div>

      </div>

      {/* =================================================
          CHART ROW 2
      ================================================= */}

      <div className="admin-analytics-second-row">

        {/* DISEASE DISTRIBUTION */}

        <div className="admin-analytics-chart-card disease-card">

          <div className="admin-analytics-chart-header">

            <div>

              <h2>

                <FaHeartbeat />

                <span>
                  Disease Distribution
                </span>

              </h2>

              <p>
                Diseases predicted across
                all patients
              </p>

            </div>

          </div>

          <div className="admin-analytics-chart-container">

            <Bar
              data={diseaseChartData}
              options={diseaseChartOptions}
            />

          </div>

        </div>

        {/* COMMON SYMPTOMS */}

        <div className="admin-analytics-chart-card symptoms-card">

          <div className="admin-analytics-chart-header">

            <div>

              <h2>

                <FaNotesMedical />

                <span>
                  Common Symptoms
                </span>

              </h2>

              <p>
                Most frequently reported symptoms
              </p>

            </div>

          </div>

          <div className="admin-analytics-symptom-chart">

            <Bar
              data={symptomChartData}
              options={symptomChartOptions}
            />

          </div>

        </div>

        {/* =================================================
            MOST COMMON DISEASES
        ================================================= */}

        <div className="admin-analytics-common-card">

          <div className="admin-analytics-common-header">

            <div className="admin-analytics-common-header-left">

              <div className="admin-analytics-common-header-icon">
                <FaBullseye />
              </div>

              <div>

                <h2>
                  Most Common Diseases
                </h2>

                <p>
                  Top diseases by prediction count
                </p>

              </div>

            </div>

          </div>

          <div className="admin-analytics-disease-list">

            {topDiseases.length > 0 ? (

              topDiseases.map(
                (item, index) => (

                  <div
                    className="admin-analytics-disease-item"
                    key={
                      item.disease ||
                      index
                    }
                  >

                    <div className="admin-analytics-disease-rank">

                      {item.rank ||
                        index + 1}

                    </div>

                    <div className="admin-analytics-disease-info">

                      <strong>
                        {item.disease ||
                          "Unknown Disease"}
                      </strong>

                      <span>

                        {Number(
                          item.count
                        ) || 0}{" "}

                        predictions

                      </span>

                    </div>

                    <div className="admin-analytics-disease-count">

                      {Number(
                        item.count
                      ) || 0}

                    </div>

                    <FaArrowUp className="admin-analytics-disease-arrow" />

                  </div>

                )
              )

            ) : (

              <div className="admin-analytics-no-data">

                <FaBullseye />

                <p>
                  No disease data available.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =================================================
          PLATFORM OVERVIEW
      ================================================= */}

      <div className="admin-analytics-overview-card">

        <div className="admin-analytics-overview-header">

          <div className="admin-analytics-overview-header-left">

            <div className="admin-analytics-overview-icon">
              <FaChartBar />
            </div>

            <div>

              <h2>
                Platform Overview
              </h2>

              <p>
                Current MedAssist AI healthcare
                platform statistics
              </p>

            </div>

          </div>

        </div>

        <div className="admin-analytics-overview-grid">

          <div className="admin-analytics-overview-item patients">

            <span>
              Patients
            </span>

            <strong>
              {totalPatients}
            </strong>

          </div>

          <div className="admin-analytics-overview-item predictions">

            <span>
              Predictions
            </span>

            <strong>
              {totalPredictions}
            </strong>

          </div>

          <div className="admin-analytics-overview-item reports">

            <span>
              Reports
            </span>

            <strong>
              {totalReports}
            </strong>

          </div>

          <div className="admin-analytics-overview-item high-risk">

            <span>
              High Risk
            </span>

            <strong>
              {highRiskPatients}
            </strong>

          </div>

          <div className="admin-analytics-overview-item critical">

            <span>
              Critical
            </span>

            <strong>
              {criticalPatients}
            </strong>

          </div>

        </div>

        <div className="admin-analytics-overview-description">

          <FaShieldAlt />

          <span>

            Admin analytics provides a complete
            overview of patient activity,
            prediction trends and healthcare
            risk patterns.

          </span>

        </div>

      </div>

      {/* =================================================
          FOOTER MESSAGE
      ================================================= */}

      <div className="admin-analytics-footer">

        <div className="admin-analytics-footer-left">

          <div className="admin-analytics-footer-icon">
            <FaShieldAlt />
          </div>

          <span>

            Admin analytics provides a complete
            overview of patient activity,
            prediction trends and healthcare
            risk patterns.

          </span>

        </div>

        <strong>
          MedAssist AI • Administration
        </strong>

      </div>

      {/* =================================================
          COPYRIGHT
      ================================================= */}

      <div className="admin-analytics-copyright">

        <p>
          © 2026 MedAssist AI | AI-Powered Medical
          Symptom Analysis & Disease Prediction System
        </p>

      </div>

    </div>

  );
}

// =====================================================
// EXPORT
// =====================================================

export default AdminAnalytics;