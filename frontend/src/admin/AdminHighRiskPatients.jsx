import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaExclamationTriangle,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaTimes,
  FaUser,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaTint,
  FaHeartbeat,
  FaStethoscope,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

import "../css/AdminHighRiskPatients.css";

function AdminHighRiskPatients() {
  const API_URL = "http://127.0.0.1:8000";

  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH HIGH RISK PATIENTS
  // =====================================================

  const fetchHighRiskPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/admin/high-risk-patients`
      );

      const data = response.data || {};

      setPatients(data.patients || []);

      setTotalPatients(
        data.total_high_risk_patients ??
          (data.patients || []).length
      );
    } catch (err) {
      console.error(
        "Failed to fetch high risk patients:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load high-risk patient records."
      );

      setPatients([]);
      setTotalPatients(0);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchHighRiskPatients();
  }, []);

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return true;
    }

    return (
      String(patient.patient_id || "")
        .toLowerCase()
        .includes(query) ||
      String(patient.full_name || "")
        .toLowerCase()
        .includes(query) ||
      String(patient.disease || "")
        .toLowerCase()
        .includes(query) ||
      String(patient.risk_level || "")
        .toLowerCase()
        .includes(query)
    );
  });

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

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
  // RISK CLASS
  // =====================================================

  const getRiskClass = (riskLevel) => {
    const level = String(
      riskLevel || ""
    ).toLowerCase();

    if (level === "critical") {
      return "risk-critical";
    }

    if (level === "high") {
      return "risk-high";
    }

    if (level === "medium") {
      return "risk-medium";
    }

    return "risk-low";
  };

  // =====================================================
  // VIEW PATIENT
  // =====================================================

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const closeDetails = () => {
    setSelectedPatient(null);
  };

  // =====================================================
  // STATISTICS
  // =====================================================

  const criticalPatients = patients.filter(
    (patient) =>
      String(patient.risk_level || "")
        .toUpperCase() === "CRITICAL"
  ).length;

  const highPatients = patients.filter(
    (patient) =>
      String(patient.risk_level || "")
        .toUpperCase() === "HIGH"
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-high-risk-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="high-risk-page-header">

        <div className="high-risk-header-left">

          <div className="high-risk-title-icon">
            <FaExclamationTriangle />
          </div>

          <div>
            <h1>High-Risk Patients</h1>

            <p>
              Monitor patients with high or critical
              health-risk predictions.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="high-risk-refresh-btn"
          onClick={fetchHighRiskPatients}
          disabled={loading}
        >
          <FaSyncAlt
            className={
              loading
                ? "high-risk-spin"
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
        <div className="high-risk-error">

          <FaExclamationTriangle />

          <span>{error}</span>

        </div>
      )}

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="high-risk-summary-grid">

        <div className="high-risk-summary-card">

          <div className="high-risk-summary-icon total">
            <FaExclamationTriangle />
          </div>

          <div className="high-risk-summary-content">

            <span>Total High-Risk Records</span>

            <strong>{totalPatients}</strong>

          </div>

        </div>

        <div className="high-risk-summary-card">

          <div className="high-risk-summary-icon high">
            <FaHeartbeat />
          </div>

          <div className="high-risk-summary-content">

            <span>High Risk</span>

            <strong>{highPatients}</strong>

          </div>

        </div>

        <div className="high-risk-summary-card">

          <div className="high-risk-summary-icon critical">
            <FaShieldAlt />
          </div>

          <div className="high-risk-summary-content">

            <span>Critical</span>

            <strong>{criticalPatients}</strong>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="high-risk-search-card">

        <div className="high-risk-search-heading">

          <div>

            <h2>Search High-Risk Patients</h2>

            <p>
              Search by patient ID, name, disease,
              or risk level.
            </p>

          </div>

        </div>

        <div className="high-risk-search-row">

          <div className="high-risk-search-input-wrapper">

            <FaSearch />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="Search patient ID, name, disease or risk level..."
            />

          </div>

          {searchQuery && (
            <button
              type="button"
              className="high-risk-clear-btn"
              onClick={() =>
                setSearchQuery("")
              }
            >
              <FaTimes />
              Clear
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          PATIENT TABLE
      ================================================= */}

      <div className="high-risk-table-card">

        <div className="high-risk-table-header">

          <div>

            <h2>High-Risk Patient Records</h2>

            <p>
              Patients identified with HIGH or
              CRITICAL risk levels.
            </p>

          </div>

          <div className="high-risk-count-badge">
            {filteredPatients.length}{" "}
            {filteredPatients.length === 1
              ? "Record"
              : "Records"}
          </div>

        </div>

        {loading ? (

          <div className="high-risk-loading">

            <div className="high-risk-loader"></div>

            <p>
              Loading high-risk patient records...
            </p>

          </div>

        ) : filteredPatients.length === 0 ? (

          <div className="high-risk-empty">

            <div className="high-risk-empty-icon">
              <FaExclamationTriangle />
            </div>

            <h3>
              No high-risk patients found
            </h3>

            <p>
              There are no high-risk patient
              records matching your search.
            </p>

          </div>

        ) : (

          <div className="high-risk-table-wrapper">

            <table className="high-risk-table">

              <thead>

                <tr>

                  <th>Patient</th>

                  <th>Patient ID</th>

                  <th>Age</th>

                  <th>Gender</th>

                  <th>Disease</th>

                  <th>Risk Score</th>

                  <th>Risk Level</th>

                  <th>Prediction Date</th>

                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredPatients.map(
                  (patient, index) => {

                    const initial =
                      patient.full_name
                        ?.charAt(0)
                        ?.toUpperCase() || "P";

                    const riskLevel =
                      patient.risk_level || "";

                    return (
                      <tr
                        key={`${patient.patient_id}-${index}`}
                      >

                        {/* PATIENT */}

                        <td>

                          <div className="high-risk-patient-cell">

                            <div className="high-risk-patient-avatar">
                              {initial}
                            </div>

                            <div>

                              <strong>
                                {displayValue(
                                  patient.full_name
                                )}
                              </strong>

                              <span>
                                {displayValue(
                                  patient.emergency_contact
                                )}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* PATIENT ID */}

                        <td>

                          <span className="high-risk-patient-id">
                            {displayValue(
                              patient.patient_id
                            )}
                          </span>

                        </td>

                        {/* AGE */}

                        <td>
                          {displayValue(
                            patient.age
                          )}
                        </td>

                        {/* GENDER */}

                        <td>
                          {displayValue(
                            patient.gender
                          )}
                        </td>

                        {/* DISEASE */}

                        <td>

                          <div className="high-risk-disease-cell">

                            <FaStethoscope />

                            <span>
                              {displayValue(
                                patient.disease
                              )}
                            </span>

                          </div>

                        </td>

                        {/* RISK SCORE */}

                        <td>

                          <strong className="high-risk-score">
                            {displayValue(
                              patient.risk_score
                            )}
                          </strong>

                        </td>

                        {/* RISK LEVEL */}

                        <td>

                          <span
                            className={`high-risk-badge ${getRiskClass(
                              riskLevel
                            )}`}
                          >
                            {displayValue(
                              riskLevel
                            )}
                          </span>

                        </td>

                        {/* DATE */}

                        <td>

                          <div className="high-risk-date-cell">

                            <FaCalendarAlt />

                            <span>
                              {formatDateTime(
                                patient.prediction_date
                              )}
                            </span>

                          </div>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="high-risk-view-btn"
                            onClick={() =>
                              handleViewPatient(
                                patient
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
          PATIENT DETAILS MODAL
      ================================================= */}

      {selectedPatient && (

        <div
          className="high-risk-details-overlay"
          onClick={closeDetails}
        >

          <div
            className="high-risk-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="high-risk-details-header">

              <div className="high-risk-details-heading">

                <div className="high-risk-details-avatar">
                  {selectedPatient.full_name
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}
                </div>

                <div>

                  <h2>
                    {displayValue(
                      selectedPatient.full_name
                    )}
                  </h2>

                  <span>
                    {displayValue(
                      selectedPatient.patient_id
                    )}
                  </span>

                </div>

              </div>

              <button
                type="button"
                className="high-risk-details-close"
                onClick={closeDetails}
              >
                <FaTimes />
              </button>

            </div>

            {/* BODY */}

            <div className="high-risk-details-body">

              {/* =================================================
                  RISK STATUS
              ================================================= */}

              <section className="high-risk-detail-section">

                <div className="high-risk-section-title">

                  <div className="high-risk-section-icon danger">
                    <FaExclamationTriangle />
                  </div>

                  <div>

                    <h3>
                      Risk Assessment
                    </h3>

                    <p>
                      Current prediction risk information
                    </p>

                  </div>

                </div>

                <div className="high-risk-status-card">

                  <div>

                    <span>
                      Risk Level
                    </span>

                    <strong
                      className={`high-risk-badge large ${getRiskClass(
                        selectedPatient.risk_level
                      )}`}
                    >
                      {displayValue(
                        selectedPatient.risk_level
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Risk Score
                    </span>

                    <strong>
                      {displayValue(
                        selectedPatient.risk_score
                      )}
                    </strong>

                  </div>

                  <div>

                    <span>
                      Confidence
                    </span>

                    <strong>
                      {displayValue(
                        selectedPatient.confidence
                      )}
                    </strong>

                  </div>

                </div>

              </section>

              {/* =================================================
                  PATIENT INFORMATION
              ================================================= */}

              <section className="high-risk-detail-section">

                <div className="high-risk-section-title">

                  <div className="high-risk-section-icon">
                    <FaUser />
                  </div>

                  <div>

                    <h3>
                      Patient Information
                    </h3>

                    <p>
                      Registered patient details
                    </p>

                  </div>

                </div>

                <div className="high-risk-info-grid">

                  <InfoItem
                    icon={<FaUser />}
                    label="Full Name"
                    value={
                      selectedPatient.full_name
                    }
                  />

                  <InfoItem
                    icon={<FaBirthdayCake />}
                    label="Age"
                    value={
                      selectedPatient.age
                    }
                  />

                  <InfoItem
                    icon={<FaVenusMars />}
                    label="Gender"
                    value={
                      selectedPatient.gender
                    }
                  />

                  <InfoItem
                    icon={<FaTint />}
                    label="Blood Group"
                    value={
                      selectedPatient.blood_group
                    }
                  />

                  <InfoItem
                    icon={<FaPhone />}
                    label="Phone"
                    value={
                      selectedPatient.phone
                    }
                  />

                  <InfoItem
                    icon={<FaPhone />}
                    label="Emergency Contact"
                    value={
                      selectedPatient.emergency_contact
                    }
                  />

                </div>

              </section>

              {/* =================================================
                  PREDICTION INFORMATION
              ================================================= */}

              <section className="high-risk-detail-section">

                <div className="high-risk-section-title">

                  <div className="high-risk-section-icon">
                    <FaHeartbeat />
                  </div>

                  <div>

                    <h3>
                      Prediction Information
                    </h3>

                    <p>
                      Disease prediction associated
                      with this risk record
                    </p>

                  </div>

                </div>

                <div className="high-risk-info-grid">

                  <InfoItem
                    icon={<FaStethoscope />}
                    label="Disease"
                    value={
                      selectedPatient.disease
                    }
                  />

                  <InfoItem
                    icon={<FaHeartbeat />}
                    label="Confidence"
                    value={
                      selectedPatient.confidence
                    }
                  />

                  <InfoItem
                    icon={<FaShieldAlt />}
                    label="Risk Score"
                    value={
                      selectedPatient.risk_score
                    }
                  />

                  <InfoItem
                    icon={<FaCalendarAlt />}
                    label="Prediction Date"
                    value={formatDateTime(
                      selectedPatient.prediction_date
                    )}
                  />

                </div>

              </section>

              {/* =================================================
                  CLOSE
              ================================================= */}

              <div className="high-risk-modal-actions">

                <button
                  type="button"
                  onClick={closeDetails}
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
// INFO ITEM
// =====================================================

function InfoItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="high-risk-info-item">

      <div className="high-risk-info-icon">
        {icon}
      </div>

      <div>

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

    </div>
  );
}

export default AdminHighRiskPatients;