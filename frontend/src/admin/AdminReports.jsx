import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaFileMedical,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaTimes,
  FaUser,
  FaHeartbeat,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaStethoscope,
  FaClipboardCheck,
  FaDownload,
} from "react-icons/fa";

import "../css/AdminReports.css";

function AdminReports() {
  const API_URL = "http://127.0.0.1:8000";

  // =====================================================
  // STATE
  // =====================================================

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ALL REPORTS
  // =====================================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/admin/reports`
      );

      const data = response.data || {};

      setReports(
        Array.isArray(data.reports)
          ? data.reports
          : []
      );
    } catch (err) {
      console.error(
        "Failed to fetch reports:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load report records."
      );

      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchReports();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // SAFE VALUE
  // =====================================================

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "—";
    }

    return value;
  };

  // =====================================================
  // RISK LEVEL CLASS
  // =====================================================

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) {
      return "";
    }

    return `risk-${String(
      riskLevel
    ).toLowerCase()}`;
  };

  // =====================================================
  // SEARCH REPORTS
  // =====================================================

  const filteredReports = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return reports;
    }

    return reports.filter((report) => {
      const searchableText = [
        report.report_id,
        report.patient_id,
        report.patient_name,
        report.prediction_id,
        report.disease,
        report.risk_level,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined
        )
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [reports, searchQuery]);

  // =====================================================
  // SUMMARY STATISTICS
  // =====================================================

  const totalReports = reports.length;

  const highRiskReports = reports.filter(
    (report) =>
      String(
        report.risk_level || ""
      ).toUpperCase() === "HIGH"
  ).length;

  const criticalReports = reports.filter(
    (report) =>
      String(
        report.risk_level || ""
      ).toUpperCase() === "CRITICAL"
  ).length;

  const otherReports = reports.filter(
    (report) => {
      const level = String(
        report.risk_level || ""
      ).toUpperCase();

      return (
        level !== "HIGH" &&
        level !== "CRITICAL"
      );
    }
  ).length;

  // =====================================================
  // OPEN REPORT DETAILS
  // =====================================================

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  // =====================================================
  // CLOSE REPORT DETAILS
  // =====================================================

  const closeReport = () => {
    setSelectedReport(null);
  };

  // =====================================================
  // OPEN PDF
  // =====================================================

  const handleOpenReport = (reportPath) => {
    if (!reportPath) {
      return;
    }

    const normalizedPath = String(
      reportPath
    ).replace(/^\/+/, "");

    const reportUrl =
      `${API_URL}/${normalizedPath}`;

    window.open(
      reportUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const handleDownloadReport = async (
    report
  ) => {
    if (!report?.report_path) {
      return;
    }

    try {
      const normalizedPath = String(
        report.report_path
      ).replace(/^\/+/, "");

      const reportUrl =
        `${API_URL}/${normalizedPath}`;

      const response = await axios.get(
        reportUrl,
        {
          responseType: "blob",
        }
      );

      const blobUrl =
        window.URL.createObjectURL(
          new Blob([
            response.data,
          ])
        );

      const link =
        document.createElement("a");

      link.href = blobUrl;

      link.download =
        `${report.report_id || "medical-report"}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(
        blobUrl
      );
    } catch (err) {
      console.error(
        "Failed to download report:",
        err
      );

      setError(
        "Unable to download the report."
      );
    }
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearchQuery("");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-reports-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="reports-page-header">

        <div className="reports-header-left">

          <div className="reports-title-icon">
            <FaFileMedical />
          </div>

          <div>
            <h1>Reports</h1>

            <p>
              View and manage generated medical
              reports.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="reports-refresh-btn"
          onClick={fetchReports}
          disabled={loading}
        >
          <FaSyncAlt
            className={
              loading
                ? "reports-spin"
                : ""
            }
          />

          {loading
            ? "Refreshing..."
            : "Refresh Data"}
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="reports-error">

          <FaExclamationTriangle />

          <span>{error}</span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <FaTimes />
          </button>

        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="reports-summary-grid">

        {/* TOTAL */}

        <div className="reports-summary-card">

          <div className="reports-summary-icon total">
            <FaFileMedical />
          </div>

          <div className="reports-summary-content">

            <span>Total Reports</span>

            <strong>
              {totalReports}
            </strong>

          </div>

        </div>

        {/* HIGH RISK */}

        <div className="reports-summary-card">

          <div className="reports-summary-icon high">
            <FaExclamationTriangle />
          </div>

          <div className="reports-summary-content">

            <span>High Risk</span>

            <strong>
              {highRiskReports}
            </strong>

          </div>

        </div>

        {/* CRITICAL */}

        <div className="reports-summary-card">

          <div className="reports-summary-icon critical">
            <FaHeartbeat />
          </div>

          <div className="reports-summary-content">

            <span>Critical</span>

            <strong>
              {criticalReports}
            </strong>

          </div>

        </div>

        {/* OTHER */}

        <div className="reports-summary-card">

          <div className="reports-summary-icon normal">
            <FaClipboardCheck />
          </div>

          <div className="reports-summary-content">

            <span>Other Risk Levels</span>

            <strong>
              {otherReports}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="reports-search-card">

        <div className="reports-search-heading">

          <div>

            <h2>
              Search Reports
            </h2>

            <p>
              Search by report ID, patient ID,
              patient name, prediction ID,
              disease, or risk level.
            </p>

          </div>

        </div>

        <div className="reports-search-row">

          <div className="reports-search-input-wrapper">

            <FaSearch />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search reports..."
            />

          </div>

          {searchQuery && (
            <button
              type="button"
              className="reports-clear-btn"
              onClick={clearSearch}
            >
              <FaTimes />
              Clear
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          REPORTS TABLE
      ================================================= */}

      <div className="reports-table-card">

        <div className="reports-table-header">

          <div>

            <h2>
              Medical Reports
            </h2>

            <p>
              Generated reports retrieved
              from the backend.
            </p>

          </div>

          <div className="reports-count-badge">

            {filteredReports.length}{" "}

            {filteredReports.length === 1
              ? "Report"
              : "Reports"}

          </div>

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="reports-loading">

            <div className="reports-loader"></div>

            <p>
              Loading report records...
            </p>

          </div>

        ) : filteredReports.length === 0 ? (

          <div className="reports-empty">

            <div className="reports-empty-icon">
              <FaFileMedical />
            </div>

            <h3>
              No reports found
            </h3>

            <p>
              {searchQuery
                ? "No reports match your search."
                : "There are no medical reports available."}
            </p>

          </div>

        ) : (

          <div className="reports-table-wrapper">

            <table className="reports-table">

              <thead>

                <tr>

                  <th>Report</th>

                  <th>Patient</th>

                  <th>Disease</th>

                  <th>Prediction ID</th>

                  <th>Risk Score</th>

                  <th>Risk Level</th>

                  <th>Generated</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredReports.map(
                  (report, index) => {

                    const reportId =
                      report.report_id ||
                      `report-${index}`;

                    return (

                      <tr
                        key={reportId}
                      >

                        {/* REPORT */}

                        <td>

                          <div className="report-id-cell">

                            <div className="report-table-icon">
                              <FaFileMedical />
                            </div>

                            <div>

                              <strong>
                                {displayValue(
                                  report.report_id
                                )}
                              </strong>

                              <span>
                                Generated Report
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* PATIENT */}

                        <td>

                          <div className="report-patient-cell">

                            <div className="report-patient-avatar">

                              {report.patient_name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "P"}

                            </div>

                            <div>

                              <strong>
                                {displayValue(
                                  report.patient_name
                                )}
                              </strong>

                              <span>
                                {displayValue(
                                  report.patient_id
                                )}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* DISEASE */}

                        <td>

                          <div className="report-disease-cell">

                            <FaStethoscope />

                            <span>
                              {displayValue(
                                report.disease
                              )}
                            </span>

                          </div>

                        </td>

                        {/* PREDICTION ID */}

                        <td>

                          <span className="prediction-id-value">
                            {displayValue(
                              report.prediction_id
                            )}
                          </span>

                        </td>

                        {/* RISK SCORE */}

                        <td>

                          <strong className="risk-score-value">
                            {displayValue(
                              report.risk_score
                            )}
                          </strong>

                        </td>

                        {/* RISK LEVEL */}

                        <td>

                          <span
                            className={`risk-badge ${getRiskClass(
                              report.risk_level
                            )}`}
                          >
                            {displayValue(
                              report.risk_level
                            )}
                          </span>

                        </td>

                        {/* GENERATED DATE */}

                        <td>

                          <div className="report-date-cell">

                            <FaCalendarAlt />

                            <span>
                              {formatDateTime(
                                report.generated_date
                              )}
                            </span>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="view-report-btn"
                            onClick={() =>
                              handleViewReport(
                                report
                              )
                            }
                          >

                            <FaEye />

                            View

                          </button>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =================================================
          REPORT DETAILS MODAL
      ================================================= */}

      {selectedReport && (

        <div
          className="report-details-overlay"
          onClick={closeReport}
        >

          <div
            className="report-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="report-details-header">

              <div className="report-details-heading">

                <div className="report-details-icon">
                  <FaFileMedical />
                </div>

                <div>

                  <h2>
                    Medical Report
                  </h2>

                  <span>
                    {displayValue(
                      selectedReport.report_id
                    )}
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="report-details-close"
                onClick={closeReport}
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}

            <div className="report-details-body">

              {/* PATIENT */}

              <section className="report-detail-section">

                <div className="report-section-title">

                  <div className="report-section-icon">
                    <FaUser />
                  </div>

                  <div>

                    <h3>
                      Patient Information
                    </h3>

                    <p>
                      Patient associated with
                      this report
                    </p>

                  </div>

                </div>

                <div className="report-info-grid">

                  <ReportInfoItem
                    label="Patient ID"
                    value={
                      selectedReport.patient_id
                    }
                  />

                  <ReportInfoItem
                    label="Patient Name"
                    value={
                      selectedReport.patient_name
                    }
                  />

                  <ReportInfoItem
                    label="Report ID"
                    value={
                      selectedReport.report_id
                    }
                  />

                  <ReportInfoItem
                    label="Prediction ID"
                    value={
                      selectedReport.prediction_id
                    }
                  />

                </div>

              </section>

              {/* PREDICTION */}

              <section className="report-detail-section">

                <div className="report-section-title">

                  <div className="report-section-icon">
                    <FaHeartbeat />
                  </div>

                  <div>

                    <h3>
                      Prediction Information
                    </h3>

                    <p>
                      Prediction details associated
                      with this report
                    </p>

                  </div>

                </div>

                <div className="report-info-grid">

                  <ReportInfoItem
                    label="Disease"
                    value={
                      selectedReport.disease
                    }
                  />

                  <ReportInfoItem
                    label="Confidence"
                    value={
                      selectedReport.confidence
                    }
                  />

                  <ReportInfoItem
                    label="Risk Score"
                    value={
                      selectedReport.risk_score
                    }
                  />

                  <div className="report-info-item">

                    <span>
                      Risk Level
                    </span>

                    <strong>

                      <span
                        className={`risk-badge ${getRiskClass(
                          selectedReport.risk_level
                        )}`}
                      >
                        {displayValue(
                          selectedReport.risk_level
                        )}
                      </span>

                    </strong>

                  </div>

                </div>

              </section>

              {/* REPORT INFORMATION */}

              <section className="report-detail-section">

                <div className="report-section-title">

                  <div className="report-section-icon">
                    <FaFileMedical />
                  </div>

                  <div>

                    <h3>
                      Report Information
                    </h3>

                    <p>
                      Generated report details
                    </p>

                  </div>

                </div>

                <div className="report-info-grid">

                  <ReportInfoItem
                    label="Generated Date"
                    value={formatDateTime(
                      selectedReport.generated_date
                    )}
                  />

                  <ReportInfoItem
                    label="Report Path"
                    value={
                      selectedReport.report_path
                    }
                  />

                </div>

              </section>

              {/* ACTIONS */}

              <div className="report-modal-actions">

                <button
                  type="button"
                  className="report-open-btn"
                  onClick={() =>
                    handleOpenReport(
                      selectedReport.report_path
                    )
                  }
                  disabled={
                    !selectedReport.report_path
                  }
                >

                  <FaEye />

                  Open Report

                </button>

                <button
                  type="button"
                  className="report-download-btn"
                  onClick={() =>
                    handleDownloadReport(
                      selectedReport
                    )
                  }
                  disabled={
                    !selectedReport.report_path
                  }
                >

                  <FaDownload />

                  Download

                </button>

                <button
                  type="button"
                  className="report-close-btn"
                  onClick={closeReport}
                >

                  <FaTimes />

                  Close

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* =================================================
          FOOTER
          SAME STYLE AS ADMIN HIGH-RISK PATIENTS
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
// REPORT INFO ITEM
// =====================================================

function ReportInfoItem({
  label,
  value,
}) {
  return (

    <div className="report-info-item">

      <span>
        {label}
      </span>

      <strong>

        {value === null ||
        value === undefined ||
        value === ""
          ? "—"
          : value}

      </strong>

    </div>

  );
}

export default AdminReports;