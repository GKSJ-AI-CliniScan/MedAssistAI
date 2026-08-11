import {
  FaChartLine,
  FaFileMedical,
  FaShieldAlt,
  FaBullseye,
  FaExclamationTriangle,
  FaHeartbeat,
  FaNotesMedical,
  FaArrowUp,
  FaArrowDown,
  FaHashtag,
  FaChartBar,
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

import { Line, Doughnut, Bar } from "react-chartjs-2";

import "../css/Analytics.css";

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

function Analytics() {
  // ===================================================
  // STATES
  // ===================================================

  const [summary, setSummary] = useState(null);
  const [diseaseDistribution, setDiseaseDistribution] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [commonSymptoms, setCommonSymptoms] = useState([]);
  const [predictionAccuracy, setPredictionAccuracy] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // GET PATIENT ID
  // ===================================================

  const getPatientId = () => {
    return (
      localStorage.getItem("patient_id") ||
      sessionStorage.getItem("patient_id") ||
      ""
    );
  };

  // ===================================================
  // LOAD ANALYTICS ON PAGE LOAD
  // ===================================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ===================================================
  // LOAD ALL ANALYTICS DATA
  // ===================================================

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const patientId = getPatientId();

      if (!patientId) {
        setError("Patient ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const BASE_URL = "http://127.0.0.1:8000";

      const [
        summaryResponse,
        diseaseResponse,
        riskResponse,
        monthlyResponse,
        symptomsResponse,
        accuracyResponse,
      ] = await Promise.allSettled([
        axios.get(
          `${BASE_URL}/analytics/dashboard/${patientId}`
        ),

        axios.get(
          `${BASE_URL}/analytics/disease-distribution/${patientId}`
        ),

        axios.get(
          `${BASE_URL}/analytics/risk-distribution/${patientId}`
        ),

        axios.get(
          `${BASE_URL}/analytics/monthly-trend/${patientId}`
        ),

        axios.get(
          `${BASE_URL}/analytics/common-symptoms/${patientId}`
        ),

        axios.get(
          `${BASE_URL}/analytics/prediction-accuracy/${patientId}`
        ),
      ]);

      // =================================================
      // SUMMARY
      // =================================================

      if (summaryResponse.status === "fulfilled") {
        setSummary(summaryResponse.value.data);
      } else {
        console.warn(
          "Summary API Error:",
          summaryResponse.reason
        );
      }

      // =================================================
      // DISEASE DISTRIBUTION
      // =================================================

      if (diseaseResponse.status === "fulfilled") {
        const data = diseaseResponse.value.data;

        setDiseaseDistribution(
          Array.isArray(data) ? data : []
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

      if (riskResponse.status === "fulfilled") {
        const data = riskResponse.value.data;

        setRiskDistribution(
          Array.isArray(data) ? data : []
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

      if (monthlyResponse.status === "fulfilled") {
        const data = monthlyResponse.value.data;

        setMonthlyTrend(
          Array.isArray(data) ? data : []
        );
      } else {
        console.warn(
          "Monthly Trend API Error:",
          monthlyResponse.reason
        );

        setMonthlyTrend([]);
      }

      // =================================================
      // COMMON SYMPTOMS
      // =================================================

      if (symptomsResponse.status === "fulfilled") {
        const data = symptomsResponse.value.data;

        setCommonSymptoms(
          Array.isArray(data) ? data : []
        );
      } else {
        console.warn(
          "Common Symptoms API Error:",
          symptomsResponse.reason
        );

        setCommonSymptoms([]);
      }

      // =================================================
      // PREDICTION ACCURACY
      // =================================================

      if (accuracyResponse.status === "fulfilled") {
        setPredictionAccuracy(
          accuracyResponse.value.data
        );
      } else {
        console.warn(
          "Prediction Accuracy API Error:",
          accuracyResponse.reason
        );

        setPredictionAccuracy(null);
      }

      // =================================================
      // CHECK NO HISTORY
      // =================================================

      if (
        summaryResponse.status === "rejected" &&
        summaryResponse.reason?.response?.status === 404
      ) {
        setError(
          "No prediction history found. Complete a health analysis to view your analytics."
        );
      }
    } catch (err) {
      console.error("Analytics Error:", err);

      setError(
        "Unable to load health analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // FORMAT MONTH
  // ===================================================

  const formatMonth = (monthValue) => {
    if (!monthValue) {
      return "-";
    }

    try {
      const date = new Date(
        `${monthValue}-01`
      );

      if (Number.isNaN(date.getTime())) {
        return monthValue;
      }

      return date.toLocaleDateString(
        "en-US",
        {
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return monthValue;
    }
  };

  // ===================================================
  // FORMAT CONFIDENCE
  // ===================================================

  const formatConfidence = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "0%";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return `${value}%`;
    }

    return `${number.toFixed(1)}%`;
  };

  // ===================================================
  // SUMMARY VALUES
  // ===================================================

  const totalPredictions =
    summary?.total_predictions || 0;

  const totalReports =
    summary?.total_reports || 0;

  const highRiskAlerts =
    summary?.high_risk_alerts || 0;

  const averageConfidence =
    summary?.average_confidence || 0;

  // ===================================================
  // MONTHLY TREND DATA
  // ===================================================

  const monthlyLabels =
    monthlyTrend.map((item) =>
      formatMonth(item.month)
    );

  const monthlyValues =
    monthlyTrend.map(
      (item) =>
        Number(item.predictions) || 0
    );

  // ===================================================
  // MONTHLY LINE CHART
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

        pointBackgroundColor: "#4169e1",

        pointBorderColor: "#ffffff",

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

  const riskValues = riskLabels.map(
    (level) => {
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
    }
  );

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
  // DISEASE BAR CHART OPTIONS
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
  // SYMPTOM BAR CHART DATA
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
  // SYMPTOM BAR CHART OPTIONS
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
  // LOADING SCREEN
  // ===================================================

  if (loading) {
    return (
      <div className="analytics-loading-page">
        <div className="analytics-loading-card">
          <div className="analytics-loading-icon">
            <FaChartBar />
          </div>

          <h2>
            Loading Health Analytics...
          </h2>

          <p>
            Please wait while we analyze
            your healthcare data.
          </p>

          <div className="analytics-spinner"></div>
        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================

  return (
    <div className="analytics-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="analytics-page-header">
        <div className="analytics-header-left">

          <div className="analytics-header-icon">
            <FaChartBar />
          </div>

          <div>
            <h1>
              Health Analytics
            </h1>

            <p>
              Understand your health patterns
              and trends
            </p>
          </div>

        </div>

        <div className="analytics-patient-card">

          <div className="analytics-patient-icon">
            <FaShieldAlt />
          </div>

          <div>
            <span>
              Patient ID
            </span>

            <strong>
              {getPatientId() || "-"}
            </strong>
          </div>

        </div>
      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="analytics-error">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="analytics-summary-grid">

        {/* Total Predictions */}

        <div className="analytics-summary-card blue">

          <div className="analytics-summary-icon">
            <FaNotesMedical />
          </div>

          <div className="analytics-summary-content">

            <span>
              Total Predictions
            </span>

            <strong>
              {totalPredictions}
            </strong>

            <small>
              All time predictions
            </small>

          </div>

        </div>

        {/* Total Reports */}

        <div className="analytics-summary-card green">

          <div className="analytics-summary-icon">
            <FaFileMedical />
          </div>

          <div className="analytics-summary-content">

            <span>
              Total Reports
            </span>

            <strong>
              {totalReports}
            </strong>

            <small>
              Reports generated
            </small>

          </div>

        </div>

        {/* High Risk */}

        <div className="analytics-summary-card orange">

          <div className="analytics-summary-icon">
            <FaExclamationTriangle />
          </div>

          <div className="analytics-summary-content">

            <span>
              High Risk Alerts
            </span>

            <strong>
              {highRiskAlerts}
            </strong>

            <small>
              Need attention
            </small>

          </div>

        </div>

        {/* Average Confidence */}

        <div className="analytics-summary-card purple">

          <div className="analytics-summary-icon">
            <FaBullseye />
          </div>

          <div className="analytics-summary-content">

            <span>
              Average Confidence
            </span>

            <strong>
              {formatConfidence(
                averageConfidence
              )}
            </strong>

            <small>
              Across all predictions
            </small>

          </div>

        </div>

      </div>

      {/* =================================================
          CHART ROW 1
      ================================================= */}

      <div className="analytics-chart-row">

        {/* Monthly Prediction Trend */}

        <div className="analytics-chart-card large">

          <div className="analytics-chart-header">

            <div>
              <h2>
                <FaChartLine />
                Monthly Prediction Trend
              </h2>

              <p>
                Your prediction activity over time
              </p>
            </div>

            <span className="analytics-chart-label">
              All Time
            </span>

          </div>

          <div className="analytics-chart-container">
            <Line
              data={monthlyChartData}
              options={monthlyChartOptions}
            />
          </div>

        </div>

        {/* Risk Distribution */}

        <div className="analytics-chart-card">

          <div className="analytics-chart-header">

            <div>
              <h2>
                <FaShieldAlt />
                Risk Distribution
              </h2>

              <p>
                Your historical risk levels
              </p>
            </div>

          </div>

          <div className="analytics-risk-chart">

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

      <div className="analytics-chart-row second-row">

        {/* Disease Distribution */}

        <div className="analytics-chart-card disease-card">

          <div className="analytics-chart-header">

            <div>
              <h2>
                <FaHeartbeat />
                Disease Distribution
              </h2>

              <p>
                Diseases predicted from your analyses
              </p>
            </div>

          </div>

          <div className="analytics-chart-container">

            <Bar
              data={diseaseChartData}
              options={diseaseChartOptions}
            />

          </div>

        </div>

        {/* Common Symptoms */}

        <div className="analytics-chart-card symptoms-card">

          <div className="analytics-chart-header">

            <div>
              <h2>
                <FaNotesMedical />
                Common Symptoms
              </h2>

              <p>
                Most frequently selected symptoms
              </p>
            </div>

          </div>

          <div className="analytics-symptom-chart">

            <Bar
              data={symptomChartData}
              options={symptomChartOptions}
            />

          </div>

        </div>

        {/* Prediction Confidence */}

        <div className="analytics-confidence-card">

          <div className="analytics-confidence-header">

            <h2>
              <FaBullseye />
              Prediction Confidence
            </h2>

            <p>
              Confidence statistics
            </p>

          </div>

          {/* Average */}

          <div className="confidence-item blue">

            <div className="confidence-icon">
              <FaChartLine />
            </div>

            <div className="confidence-text">

              <span>
                Average Confidence
              </span>

              <strong>
                {formatConfidence(
                  predictionAccuracy?.average_confidence ??
                    averageConfidence
                )}
              </strong>

            </div>

          </div>

          {/* Highest */}

          <div className="confidence-item green">

            <div className="confidence-icon">
              <FaArrowUp />
            </div>

            <div className="confidence-text">

              <span>
                Highest Confidence
              </span>

              <strong>
                {formatConfidence(
                  predictionAccuracy?.highest_confidence
                )}
              </strong>

            </div>

          </div>

          {/* Lowest */}

          <div className="confidence-item orange">

            <div className="confidence-icon">
              <FaArrowDown />
            </div>

            <div className="confidence-text">

              <span>
                Lowest Confidence
              </span>

              <strong>
                {formatConfidence(
                  predictionAccuracy?.lowest_confidence
                )}
              </strong>

            </div>

          </div>

          {/* Total Predictions */}

          <div className="confidence-item purple">

            <div className="confidence-icon">
              <FaHashtag />
            </div>

            <div className="confidence-text">

              <span>
                Total Predictions
              </span>

              <strong>
                {predictionAccuracy?.total_predictions ??
                  totalPredictions}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          ANALYTICS FOOTER MESSAGE
      ================================================= */}

      <div className="analytics-footer">

        <div className="analytics-footer-left">

          <div className="analytics-footer-icon">
            <FaShieldAlt />
          </div>

          <span>
            Analytics helps you understand
            your health patterns better.
            Stay proactive and take care
            of your health!
          </span>

        </div>

        <strong>
          Your Health, Our Priority ❤️
        </strong>

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

// =====================================================
// EXPORT
// =====================================================

export default Analytics;