import {
  FaHistory,
  FaSearch,
  FaEye,
  FaFileMedical,
  FaShieldAlt,
  FaCalendarAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/MedicalRecords.css";

function MedicalRecords() {
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;

  // =========================================================
  // GET PATIENT ID
  // =========================================================

  const getPatientId = () => {
    return (
      localStorage.getItem("patient_id") ||
      sessionStorage.getItem("patient_id")
    );
  };

  // =========================================================
  // LOAD MEDICAL HISTORY
  // =========================================================

  useEffect(() => {
    loadMedicalHistory();
  }, []);

  const loadMedicalHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const patientId = getPatientId();

      if (!patientId) {
        setError("Patient ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/medical-history/${patientId}`
      );

      if (Array.isArray(response.data)) {
        setRecords(response.data);
      } else {
        setRecords([]);
      }
    } catch (err) {
      console.error("Medical History Error:", err);

      if (err.response?.status === 404) {
        setRecords([]);
        setError("");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Unable to load medical history.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return {
        date: "-",
        time: "",
      };
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return {
        date: "-",
        time: "",
      };
    }

    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // =========================================================
  // RISK LEVEL
  // =========================================================

  const getRiskClass = (riskLevel) => {
    const level = String(riskLevel || "").toUpperCase();

    if (level === "CRITICAL") {
      return "critical";
    }

    if (level === "HIGH") {
      return "high";
    }

    if (level === "MEDIUM") {
      return "medium";
    }

    return "low";
  };

  // =========================================================
  // RISK ICON
  // =========================================================

  const getRiskIcon = (riskLevel) => {
    const level = String(riskLevel || "").toUpperCase();

    if (level === "HIGH" || level === "CRITICAL") {
      return <FaExclamationTriangle />;
    }

    if (level === "MEDIUM") {
      return <FaShieldAlt />;
    }

    return <FaCheckCircle />;
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return records.filter((record) => {
      const disease = String(
        record.disease || ""
      ).toLowerCase();

      const symptoms = String(
        record.symptoms || ""
      ).toLowerCase();

      const predictionId = String(
        record.prediction_id || ""
      ).toLowerCase();

      const reportId = String(
        record.report_id || ""
      ).toLowerCase();

      const riskLevel = String(
        record.risk_level || ""
      ).toUpperCase();

      const matchesSearch =
        !searchValue ||
        disease.includes(searchValue) ||
        symptoms.includes(searchValue) ||
        predictionId.includes(searchValue) ||
        reportId.includes(searchValue);

      const matchesRisk =
        riskFilter === "ALL" ||
        riskLevel === riskFilter;

      return matchesSearch && matchesRisk;
    });
  }, [records, search, riskFilter]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredRecords.length / recordsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) * recordsPerPage;

  const currentRecords =
    filteredRecords.slice(
      startIndex,
      startIndex + recordsPerPage
    );

  // =========================================================
  // RESET PAGE WHEN SEARCH/FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, riskFilter]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalRecords = records.length;

  const highRiskRecords = records.filter(
    (record) => {
      const level = String(
        record.risk_level || ""
      ).toUpperCase();

      return (
        level === "HIGH" ||
        level === "CRITICAL"
      );
    }
  ).length;

  const reportCount = records.filter(
    (record) => record.report_id
  ).length;

  const latestRecord =
    records.length > 0
      ? records[0]
      : null;

  // =========================================================
  // VIEW SELECTED REPORT
  // =========================================================

  const handleViewReport = (record) => {
    if (!record?.prediction_id) {
      alert(
        "Prediction information is not available."
      );
      return;
    }

    const selectedPrediction = {
      prediction_id:
        record.prediction_id,

      disease:
        record.disease,

      symptoms:
        record.symptoms,

      confidence:
        record.confidence,

      risk_score:
        record.risk_score,

      risk_level:
        record.risk_level,
    };

    localStorage.setItem(
      "prediction",
      JSON.stringify(selectedPrediction)
    );

    localStorage.setItem(
      "selectedMedicalRecord",
      JSON.stringify(record)
    );

    navigate("/report");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="medical-records-page">

        <div className="medical-loading-container">

          <h2>
            Loading Medical Records...
          </h2>

          <p>
            Please wait while we retrieve
            your medical history.
          </p>

          <div className="medical-loading-spinner"></div>

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

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="medical-records-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="medical-page-header">

        <div className="medical-header-left">

          <div className="medical-header-icon">
            <FaFileMedical />
          </div>

          <div>

            <h1>
              Medical Records
            </h1>

            <p>
              View all your past medical history,
              predictions and reports
            </p>

          </div>

        </div>

        <div className="patient-id-card">

          <div className="patient-id-icon">
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

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="medical-error-box">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Login Again
          </button>

        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="medical-summary-grid">

        {/* Total Records */}

        <div className="medical-summary-card blue">

          <div className="summary-icon">
            <FaHistory />
          </div>

          <div className="summary-content">

            <span>
              Total Records
            </span>

            <strong>
              {totalRecords}
            </strong>

            <small>
              All medical records
            </small>

          </div>

        </div>

        {/* High Risk */}

        <div className="medical-summary-card purple">

          <div className="summary-icon">
            <FaShieldAlt />
          </div>

          <div className="summary-content">

            <span>
              High Risk Records
            </span>

            <strong>
              {highRiskRecords}
            </strong>

            <small>
              Need attention
            </small>

          </div>

        </div>

        {/* Reports */}

        <div className="medical-summary-card orange">

          <div className="summary-icon">
            <FaFileMedical />
          </div>

          <div className="summary-content">

            <span>
              Reports Generated
            </span>

            <strong>
              {reportCount}
            </strong>

            <small>
              PDF health reports
            </small>

          </div>

        </div>

        {/* Latest Record */}

        <div className="medical-summary-card green">

          <div className="summary-icon">
            <FaCalendarAlt />
          </div>

          <div className="summary-content">

            <span>
              Latest Record
            </span>

            {latestRecord ? (
              <>
                <strong className="latest-record-date">
                  {
                    formatDate(
                      latestRecord.date
                    ).date
                  }
                </strong>

                <small>
                  {
                    formatDate(
                      latestRecord.date
                    ).time
                  }
                </small>
              </>
            ) : (
              <>
                <strong>
                  -
                </strong>

                <small>
                  No records available
                </small>
              </>
            )}

          </div>

        </div>

      </div>

      {/* =====================================================
          MEDICAL HISTORY SECTION
      ===================================================== */}

      <div className="medical-history-card">

        {/* Section Header */}

        <div className="history-section-header">

          <div className="history-title">

            <div className="history-title-icon">
              <FaHistory />
            </div>

            <div>

              <h2>
                Your Medical History
              </h2>

              <p>
                All previous disease predictions,
                risk assessments and health reports
              </p>

            </div>

          </div>

          {/* Search */}

          <div className="history-controls">

            <div className="medical-search">

              <FaSearch />

              <input
                type="text"
                placeholder="Search by disease, symptom..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              value={riskFilter}
              onChange={(e) =>
                setRiskFilter(
                  e.target.value
                )
              }
              className="risk-filter"
            >

              <option value="ALL">
                All Risk Levels
              </option>

              <option value="LOW">
                Low Risk
              </option>

              <option value="MEDIUM">
                Medium Risk
              </option>

              <option value="HIGH">
                High Risk
              </option>

              <option value="CRITICAL">
                Critical Risk
              </option>

            </select>

          </div>

        </div>

        {/* ===================================================
            NO RECORDS
        =================================================== */}

        {records.length === 0 ? (

          <div className="no-medical-records">

            <div className="no-record-icon">
              <FaFileMedical />
            </div>

            <h3>
              No Medical Records Found
            </h3>

            <p>
              Your medical history will appear
              here after completing a health analysis.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/health-analysis"
                )
              }
            >
              Start New Health Analysis
            </button>

          </div>

        ) : filteredRecords.length === 0 ? (

          <div className="no-medical-records">

            <div className="no-record-icon">
              <FaSearch />
            </div>

            <h3>
              No Matching Records
            </h3>

            <p>
              Try changing your search
              or risk filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setRiskFilter("ALL");
              }}
            >
              Clear Filters
            </button>

          </div>

        ) : (

          <>

            {/* =================================================
                RECORD LIST
            ================================================= */}

            <div className="medical-record-list">

              {currentRecords.map(
                (record, index) => {

                  const riskClass =
                    getRiskClass(
                      record.risk_level
                    );

                  const formattedDate =
                    formatDate(
                      record.date
                    );

                  return (

                    <div
                      className={`medical-record-item ${riskClass}`}
                      key={
                        record.history_id ||
                        `${record.prediction_id}-${index}`
                      }
                    >

                      {/* Disease Icon */}

                      <div className="record-disease-icon">

                        {
                          getRiskIcon(
                            record.risk_level
                          )
                        }

                      </div>

                      {/* Disease */}

                      <div className="record-disease-section">

                        <h3>
                          {
                            record.disease ||
                            "Unknown Disease"
                          }
                        </h3>

                        <div className="record-risk-row">

                          <span
                            className={`risk-badge ${riskClass}`}
                          >
                            {
                              String(
                                record.risk_level ||
                                "LOW"
                              ).toUpperCase()
                            }{" "}
                            RISK
                          </span>

                          <span
                            className={`risk-score-badge ${riskClass}`}
                          >
                            Risk Score:{" "}
                            {
                              record.risk_score ??
                              0
                            }
                            /100
                          </span>

                        </div>

                      </div>

                      {/* Prediction + Report */}

                      <div className="record-id-section">

                        <div className="record-detail">

                          <span>
                            Prediction ID
                          </span>

                          <strong>
                            {
                              record.prediction_id ||
                              "-"
                            }
                          </strong>

                        </div>

                        <div className="record-detail">

                          <span>
                            Report ID
                          </span>

                          <strong>
                            {
                              record.report_id ||
                              "-"
                            }
                          </strong>

                        </div>

                      </div>

                      {/* Confidence + Symptoms */}

                      <div className="record-analysis-section">

                        <div className="record-detail">

                          <span>
                            Confidence
                          </span>

                          <strong>
                            {
                              record.confidence != null
                                ? `${record.confidence}%`
                                : "-"
                            }
                          </strong>

                        </div>

                        <div className="record-detail">

                          <span>
                            Symptoms
                          </span>

                          <strong>

                            {
                              record.symptoms
                                ? record.symptoms
                                    .split(",")
                                    .filter(
                                      (item) =>
                                        item.trim()
                                    ).length
                                : 0
                            }{" "}
                            Symptoms

                          </strong>

                        </div>

                      </div>

                      {/* Date */}

                      <div className="record-date-section">

                        <div className="record-calendar">
                          <FaCalendarAlt />
                        </div>

                        <div>

                          <strong>
                            {
                              formattedDate.date
                            }
                          </strong>

                          <span>
                            {
                              formattedDate.time
                            }
                          </span>

                        </div>

                      </div>

                      {/* View Report */}

                      <button
                        className="view-report-btn"
                        onClick={() =>
                          handleViewReport(
                            record
                          )
                        }
                      >

                        <FaEye />

                        View Report

                      </button>

                    </div>
                  );
                }
              )}

            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {totalPages > 1 && (

              <div className="medical-pagination">

                <button
                  disabled={
                    safeCurrentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                >
                  <FaArrowLeft />
                </button>

                {Array.from(
                  {
                    length:
                      totalPages,
                  },
                  (_, index) =>
                    index + 1
                ).map((page) => (

                  <button
                    key={page}
                    className={
                      safeCurrentPage ===
                      page
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(
                        page
                      )
                    }
                  >
                    {page}
                  </button>

                ))}

                <button
                  disabled={
                    safeCurrentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                >
                  <FaArrowRight />
                </button>

              </div>

            )}

          </>
        )}

      </div>

      {/* =================================================
          FOOTER MESSAGE
      ================================================= */}

      <div className="medical-record-footer">

        <div>
          <FaChartLine />

          <span>
            Your complete healthcare journey,
            securely maintained.
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

export default MedicalRecords;