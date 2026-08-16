import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaUsers,
  FaSearch,
  FaSyncAlt,
  FaEye,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBirthdayCake,
  FaVenusMars,
  FaTint,
  FaPhoneAlt,
  FaCalendarAlt,
  FaHeartbeat,
  FaFileMedical,
  FaNotesMedical,
  FaExclamationTriangle,
  FaStethoscope,
  FaClipboardCheck,
} from "react-icons/fa";

import "../css/AdminPatients.css";

function AdminPatients() {
  const API_URL = "http://127.0.0.1:8000";

  // =====================================================
  // STATE
  // =====================================================

  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH ALL PATIENTS
  // =====================================================

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/admin/patients`
      );

      const data = response.data || {};

      setPatients(data.patients || []);

      setTotalPatients(
        data.total_patients ??
          data.total ??
          (data.patients || []).length
      );
    } catch (err) {
      console.error(
        "Failed to fetch patients:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load patient records."
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
    fetchPatients();
  }, []);

  // =====================================================
  // SEARCH PATIENT
  // =====================================================

  const handleSearch = async () => {
    const query = searchQuery.trim();

    if (!query) {
      fetchPatients();
      return;
    }

    try {
      setSearching(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/admin/search-patient`,
        {
          params: {
            query,
          },
        }
      );

      const data = response.data || {};

      setPatients(data.patients || []);

      setTotalPatients(
        data.total_results ??
          data.total_patients ??
          (data.patients || []).length
      );
    } catch (err) {
      console.error(
        "Patient search failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to search patient records."
      );

      setPatients([]);
      setTotalPatients(0);
    } finally {
      setSearching(false);
    }
  };

  // =====================================================
  // SEARCH ENTER KEY
  // =====================================================

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // =====================================================
  // VIEW PATIENT DETAILS
  // =====================================================

  const handleViewPatient = async (patientId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/admin/patient/${patientId}`
      );

      setSelectedPatient(
        response.data || null
      );
    } catch (err) {
      console.error(
        "Failed to fetch patient details:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Unable to load patient details."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const closeDetails = () => {
    setSelectedPatient(null);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "—";

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
      }
    );
  };

  // =====================================================
  // FORMAT DATE + TIME
  // =====================================================

  const formatDateTime = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString(
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
  // GET ALL PREDICTIONS
  // =====================================================

  const getPredictions = (patient) => {
    if (!patient) return [];

    if (Array.isArray(patient.predictions)) {
      return patient.predictions;
    }

    if (
      Array.isArray(
        patient.all_predictions
      )
    ) {
      return patient.all_predictions;
    }

    if (
      Array.isArray(
        patient.prediction_records
      )
    ) {
      return patient.prediction_records;
    }

    if (
      Array.isArray(
        patient.prediction_history
      )
    ) {
      return patient.prediction_history;
    }

    if (patient.latest_prediction) {
      return [patient.latest_prediction];
    }

    return [];
  };

  // =====================================================
  // GET ALL REPORTS
  // =====================================================

  const getReports = (patient) => {
    if (!patient) return [];

    if (Array.isArray(patient.reports)) {
      return patient.reports;
    }

    if (
      Array.isArray(
        patient.all_reports
      )
    ) {
      return patient.all_reports;
    }

    if (
      Array.isArray(
        patient.report_records
      )
    ) {
      return patient.report_records;
    }

    if (
      Array.isArray(
        patient.recent_reports
      )
    ) {
      return patient.recent_reports;
    }

    return [];
  };

  // =====================================================
  // GET MEDICAL HISTORY
  // =====================================================

  const getMedicalHistory = (patient) => {
    if (!patient) return [];

    if (
      Array.isArray(
        patient.medical_history
      )
    ) {
      return patient.medical_history;
    }

    if (
      Array.isArray(
        patient.medical_history_records
      )
    ) {
      return patient.medical_history_records;
    }

    if (Array.isArray(patient.history)) {
      return patient.history;
    }

    return [];
  };

  // =====================================================
  // CREATE PREDICTION LOOKUP
  // =====================================================

  const predictionLookup = useMemo(() => {
    const lookup = {};

    const predictions =
      getPredictions(selectedPatient);

    predictions.forEach((prediction) => {
      const id =
        prediction.prediction_id ||
        prediction.id;

      if (id) {
        lookup[String(id)] = prediction;
      }
    });

    return lookup;
  }, [selectedPatient]);

  // =====================================================
  // GET PREDICTION RELATED TO REPORT
  // =====================================================

  const getPredictionForReport = (report) => {
    if (!report) return null;

    const predictionId =
      report.prediction_id ||
      report.predictionId;

    if (!predictionId) {
      return null;
    }

    return (
      predictionLookup[
        String(predictionId)
      ] || null
    );
  };

  // =====================================================
  // RECORD DATA
  // =====================================================

  const predictions =
    getPredictions(selectedPatient);

  const reports =
    getReports(selectedPatient);

  const medicalHistory =
    getMedicalHistory(selectedPatient);

  // =====================================================
  // CALCULATE HIGH RISK CASES
  // =====================================================

  const calculatedHighRiskCases =
    predictions.filter(
      (prediction) => {
        const riskLevel = String(
          prediction.risk_level ||
            prediction.riskLevel ||
            ""
        ).toLowerCase();

        return (
          riskLevel === "high" ||
          riskLevel === "critical"
        );
      }
    ).length;

  // =====================================================
  // BACKEND STATISTICS
  // =====================================================

  const statistics =
    selectedPatient?.statistics || {};

  const totalPredictions =
    statistics.total_predictions ??
    predictions.length;

  const totalReports =
    statistics.total_reports ??
    reports.length;

  const totalMedicalRecords =
    statistics.medical_history_records ??
    medicalHistory.length;

  const highRiskCases =
    statistics.high_risk_cases ??
    calculatedHighRiskCases;

  // =====================================================
  // LATEST PREDICTION
  // =====================================================

  const latestPrediction =
    predictions.length > 0
      ? predictions[0]
      : null;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="admin-patients-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="patients-page-header">

        <div className="patients-header-left">

          <div className="patients-title-icon">
            <FaUsers />
          </div>

          <div>
            <h1>Patients</h1>

            <p>
              View and manage registered
              patient records.
            </p>
          </div>

        </div>

        <button
          type="button"
          className="patients-refresh-btn"
          onClick={fetchPatients}
          disabled={loading}
        >

          <FaSyncAlt
            className={
              loading
                ? "patients-spin"
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
        <div className="patients-error">

          <FaExclamationTriangle />

          <span>
            {error}
          </span>

        </div>
      )}

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="patients-summary-card">

        <div className="patients-summary-icon">
          <FaUsers />
        </div>

        <div className="patients-summary-content">

          <span>
            Total Patients
          </span>

          <strong>
            {totalPatients}
          </strong>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="patients-search-card">

        <div className="patients-search-heading">

          <div>

            <h2>
              Search Patients
            </h2>

            <p>
              Search using patient ID,
              name, or email.
            </p>

          </div>

        </div>

        <div className="patients-search-row">

          <div className="patients-search-input-wrapper">

            <FaSearch />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              onKeyDown={
                handleSearchKeyDown
              }
              placeholder="Search by patient ID, name or email..."
            />

          </div>

          <button
            type="button"
            className="patients-search-btn"
            onClick={handleSearch}
            disabled={searching}
          >

            <FaSearch />

            {searching
              ? "Searching..."
              : "Search"}

          </button>

          {searchQuery && (
            <button
              type="button"
              className="patients-clear-btn"
              onClick={() => {
                setSearchQuery("");
                fetchPatients();
              }}
            >
              Clear
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          PATIENT TABLE
      ================================================= */}

      <div className="patients-table-card">

        <div className="patients-table-header">

          <div>

            <h2>
              Registered Patients
            </h2>

            <p>
              Patient information retrieved
              from the backend.
            </p>

          </div>

          <div className="patients-count-badge">

            {totalPatients}{" "}

            {totalPatients === 1
              ? "Patient"
              : "Patients"}

          </div>

        </div>

        {loading ? (

          <div className="patients-loading">

            <div className="patients-loader"></div>

            <p>
              Loading patient records...
            </p>

          </div>

        ) : patients.length === 0 ? (

          <div className="patients-empty">

            <div className="patients-empty-icon">
              <FaUsers />
            </div>

            <h3>
              No patients found
            </h3>

            <p>
              There are no patient records
              matching your search.
            </p>

          </div>

        ) : (

          <div className="patients-table-wrapper">

            <table className="patients-table">

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
                    Blood Group
                  </th>

                  <th>
                    Registered
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {patients.map(
                  (patient) => {

                    const initial =
                      patient.full_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                      "P";

                    return (

                      <tr
                        key={
                          patient.patient_id
                        }
                      >

                        {/* PATIENT */}

                        <td>

                          <div className="patient-name-cell">

                            <div className="patient-avatar">
                              {initial}
                            </div>

                            <div className="patient-name-info">

                              <strong>
                                {displayValue(
                                  patient.full_name
                                )}
                              </strong>

                              <span>
                                {displayValue(
                                  patient.email
                                )}
                              </span>

                            </div>

                          </div>

                        </td>

                        {/* PATIENT ID */}

                        <td>

                          <span className="patient-id-badge">

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

                        {/* BLOOD GROUP */}

                        <td>

                          <span className="blood-group-value">

                            {patient.blood_group ? (
                              <>
                                <FaTint />

                                {
                                  patient.blood_group
                                }
                              </>
                            ) : (
                              "—"
                            )}

                          </span>

                        </td>

                        {/* REGISTERED */}

                        <td>

                          <span className="registered-date">

                            <FaCalendarAlt />

                            {formatDate(
                              patient.created_at
                            )}

                          </span>

                        </td>

                        {/* ACTION */}

                        <td>

                          <button
                            type="button"
                            className="view-patient-btn"
                            onClick={() =>
                              handleViewPatient(
                                patient.patient_id
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
          className="patient-details-overlay"
          onClick={closeDetails}
        >

          <div
            className="patient-details-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="patient-details-header">

              <div className="patient-details-heading">

                <div className="patient-details-avatar">

                  {selectedPatient
                    .patient
                    ?.full_name
                    ?.charAt(0)
                    ?.toUpperCase() ||
                    "P"}

                </div>

                <div>

                  <h2>

                    {displayValue(
                      selectedPatient
                        .patient
                        ?.full_name
                    )}

                  </h2>

                  <span>

                    {displayValue(
                      selectedPatient
                        .patient
                        ?.patient_id
                    )}

                  </span>

                </div>

              </div>

              <button
                type="button"
                className="patient-details-close"
                onClick={closeDetails}
              >

                <FaTimes />

              </button>

            </div>

            {/* =================================================
                DETAILS LOADING
            ================================================= */}

            {detailsLoading ? (

              <div className="patient-details-loading">

                <div className="patients-loader"></div>

                <p>
                  Loading patient details...
                </p>

              </div>

            ) : (

              <div className="patient-details-body">

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <section className="patient-detail-section">

                  <div className="patient-section-title">

                    <div className="patient-section-icon">
                      <FaUser />
                    </div>

                    <div>

                      <h3>
                        Personal Information
                      </h3>

                      <p>
                        Patient registration details
                      </p>

                    </div>

                  </div>

                  <div className="patient-info-grid">

                    <InfoItem
                      icon={<FaUser />}
                      label="Full Name"
                      value={
                        selectedPatient
                          .patient
                          ?.full_name
                      }
                    />

                    <InfoItem
                      icon={<FaEnvelope />}
                      label="Email"
                      value={
                        selectedPatient
                          .patient
                          ?.email
                      }
                    />

                    <InfoItem
                      icon={<FaPhone />}
                      label="Phone"
                      value={
                        selectedPatient
                          .patient
                          ?.phone
                      }
                    />

                    <InfoItem
                      icon={
                        <FaBirthdayCake />
                      }
                      label="Age"
                      value={
                        selectedPatient
                          .patient
                          ?.age
                      }
                    />

                    <InfoItem
                      icon={
                        <FaVenusMars />
                      }
                      label="Gender"
                      value={
                        selectedPatient
                          .patient
                          ?.gender
                      }
                    />

                    <InfoItem
                      icon={<FaTint />}
                      label="Blood Group"
                      value={
                        selectedPatient
                          .patient
                          ?.blood_group
                      }
                    />

                    <InfoItem
                      icon={
                        <FaPhoneAlt />
                      }
                      label="Emergency Contact"
                      value={
                        selectedPatient
                          .patient
                          ?.emergency_contact
                      }
                    />

                    <InfoItem
                      icon={
                        <FaCalendarAlt />
                      }
                      label="Registered"
                      value={formatDate(
                        selectedPatient
                          .patient
                          ?.created_at
                      )}
                    />

                  </div>

                  <div className="patient-address-box">

                    <span>
                      Address
                    </span>

                    <p>
                      {displayValue(
                        selectedPatient
                          .patient
                          ?.address
                      )}
                    </p>

                  </div>

                </section>

                {/* =================================================
                    PATIENT STATISTICS
                ================================================= */}

                <section className="patient-detail-section">

                  <div className="patient-section-title">

                    <div className="patient-section-icon">
                      <FaHeartbeat />
                    </div>

                    <div>

                      <h3>
                        Patient Statistics
                      </h3>

                      <p>
                        Records available in the system
                      </p>

                    </div>

                  </div>

                  <div className="patient-stat-grid">

                    <StatCard
                      icon={
                        <FaHeartbeat />
                      }
                      label="Predictions"
                      value={
                        totalPredictions
                      }
                    />

                    <StatCard
                      icon={
                        <FaFileMedical />
                      }
                      label="Reports"
                      value={
                        totalReports
                      }
                    />

                    <StatCard
                      icon={
                        <FaNotesMedical />
                      }
                      label="Medical Records"
                      value={
                        totalMedicalRecords
                      }
                    />

                    <StatCard
                      icon={
                        <FaExclamationTriangle />
                      }
                      label="High Risk Cases"
                      value={
                        highRiskCases
                      }
                    />

                  </div>

                </section>

                {/* =================================================
                    LATEST PREDICTION
                ================================================= */}

                <section className="patient-detail-section">

                  <div className="patient-section-title">

                    <div className="patient-section-icon">
                      <FaClipboardCheck />
                    </div>

                    <div>

                      <h3>
                        Latest Prediction
                      </h3>

                      <p>
                        Most recent disease prediction
                      </p>

                    </div>

                  </div>

                  {latestPrediction ? (

                    <div className="patient-history-list">

                      <div className="patient-history-row">

                        <div className="history-main">

                          <div className="history-icon">
                            <FaStethoscope />
                          </div>

                          <div>

                            <strong>
                              {displayValue(
                                latestPrediction
                                  .disease
                              )}
                            </strong>

                            <span>
                              Prediction ID:{" "}
                              {displayValue(
                                latestPrediction
                                  .prediction_id ||
                                latestPrediction.id
                              )}
                            </span>

                            <span>
                              Confidence:{" "}
                              {displayValue(
                                latestPrediction
                                  .confidence
                              )}
                            </span>

                            <span>
                              Risk Score:{" "}
                              {displayValue(
                                latestPrediction
                                  .risk_score ??
                                latestPrediction
                                  .riskScore
                              )}
                            </span>

                          </div>

                        </div>

                        <div className="history-risk">

                          <span
                            className={`risk-badge risk-${String(
                              latestPrediction
                                .risk_level ||
                                latestPrediction
                                  .riskLevel ||
                                ""
                            ).toLowerCase()}`}
                          >

                            {displayValue(
                              latestPrediction
                                .risk_level ||
                                latestPrediction
                                  .riskLevel
                            )}

                          </span>

                          <small>

                            {formatDateTime(
                              latestPrediction
                                .prediction_date ||
                              latestPrediction
                                .created_at ||
                              latestPrediction
                                .createdAt
                            )}

                          </small>

                        </div>

                      </div>

                    </div>

                  ) : (

                    <div className="no-record-message">

                      No prediction records available.

                    </div>

                  )}

                </section>

                {/* =================================================
                    ALL PREDICTIONS
                ================================================= */}

                <section className="patient-detail-section">

                  <div className="patient-section-title">

                    <div className="patient-section-icon">
                      <FaHeartbeat />
                    </div>

                    <div>

                      <h3>
                        Prediction Records
                      </h3>

                      <p>
                        Disease prediction records
                        for this patient
                      </p>

                    </div>

                    <span className="section-record-count">

                      {predictions.length}{" "}

                      {predictions.length === 1
                        ? "Record"
                        : "Records"}

                    </span>

                  </div>

                  {predictions.length > 0 ? (

                    <div className="patient-history-list">

                      {predictions.map(
                        (prediction, index) => {

                          const predictionId =
                            prediction.prediction_id ||
                            prediction.id ||
                            `prediction-${index}`;

                          const riskLevel =
                            prediction.risk_level ||
                            prediction.riskLevel ||
                            "";

                          return (

                            <div
                              className="patient-history-row"
                              key={predictionId}
                            >

                              <div className="history-main">

                                <div className="history-icon">
                                  <FaStethoscope />
                                </div>

                                <div>

                                  <strong>
                                    {displayValue(
                                      prediction.disease
                                    )}
                                  </strong>

                                  <span>
                                    Prediction ID:{" "}
                                    {displayValue(
                                      predictionId
                                    )}
                                  </span>

                                  <span>
                                    Confidence:{" "}
                                    {displayValue(
                                      prediction.confidence
                                    )}
                                  </span>

                                  <span>
                                    Risk Score:{" "}
                                    {displayValue(
                                      prediction.risk_score ??
                                      prediction.riskScore
                                    )}
                                  </span>

                                </div>

                              </div>

                              <div className="history-risk">

                                <span
                                  className={`risk-badge risk-${String(
                                    riskLevel
                                  ).toLowerCase()}`}
                                >

                                  {displayValue(
                                    riskLevel
                                  )}

                                </span>

                                <small>

                                  {formatDateTime(
                                    prediction.prediction_date ||
                                    prediction.created_at ||
                                    prediction.createdAt
                                  )}

                                </small>

                              </div>

                            </div>

                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="no-record-message">

                      No prediction records available.

                    </div>

                  )}

                </section>

                {/* =================================================
                    MEDICAL REPORTS
                ================================================= */}

                <section className="patient-detail-section">

                  <div className="patient-section-title">

                    <div className="patient-section-icon">
                      <FaFileMedical />
                    </div>

                    <div>

                      <h3>
                        Medical Reports
                      </h3>

                      <p>
                        Reports generated for this patient
                      </p>

                    </div>

                    <span className="section-record-count">

                      {reports.length}{" "}

                      {reports.length === 1
                        ? "Report"
                        : "Reports"}

                    </span>

                  </div>

                  {reports.length > 0 ? (

                    <div className="patient-history-list">

                      {reports.map(
                        (report, index) => {

                          const reportId =
                            report.report_id ||
                            report.id ||
                            `report-${index}`;

                          const relatedPrediction =
                            getPredictionForReport(
                              report
                            );

                          const disease =
                            report.disease ??
                            relatedPrediction?.disease;

                          const riskScore =
                            report.risk_score ??
                            relatedPrediction?.risk_score ??
                            relatedPrediction?.riskScore;

                          const riskLevel =
                            report.risk_level ??
                            relatedPrediction?.risk_level ??
                            relatedPrediction?.riskLevel;

                          return (

                            <div
                              className="patient-history-row"
                              key={reportId}
                            >

                              <div className="history-main">

                                <div className="history-icon">
                                  <FaFileMedical />
                                </div>

                                <div>

                                  <strong>
                                    {displayValue(
                                      disease
                                    )}
                                  </strong>

                                  <span>
                                    Report ID:{" "}
                                    {displayValue(
                                      reportId
                                    )}
                                  </span>

                                  <span>
                                    Risk Score:{" "}
                                    {displayValue(
                                      riskScore
                                    )}
                                  </span>

                                </div>

                              </div>

                              <div className="history-risk">

                                <span
                                  className={`risk-badge risk-${String(
                                    riskLevel || ""
                                  ).toLowerCase()}`}
                                >

                                  {displayValue(
                                    riskLevel
                                  )}

                                </span>

                                <small>

                                  {formatDateTime(
                                    report.generated_date ||
                                    report.created_at
                                  )}

                                </small>

                              </div>

                            </div>

                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="no-record-message">

                      No medical reports available.

                    </div>

                  )}

                </section>

                {/* =================================================
                    MEDICAL HISTORY
                ================================================= */}

                <section className="patient-detail-section">

                  <div className="patient-section-title">

                    <div className="patient-section-icon">
                      <FaNotesMedical />
                    </div>

                    <div>

                      <h3>
                        Medical History
                      </h3>

                      <p>
                        Complete patient medical history
                      </p>

                    </div>

                    <span className="section-record-count">

                      {medicalHistory.length}{" "}

                      {medicalHistory.length === 1
                        ? "Record"
                        : "Records"}

                    </span>

                  </div>

                  {medicalHistory.length > 0 ? (

                    <div className="patient-history-list">

                      {medicalHistory.map(
                        (item, index) => {

                          const historyId =
                            item.history_id ||
                            item.id ||
                            `history-${index}`;

                          const riskLevel =
                            item.risk_level ||
                            item.riskLevel ||
                            "";

                          return (

                            <div
                              className="patient-history-row"
                              key={historyId}
                            >

                              <div className="history-main">

                                <div className="history-icon">
                                  <FaNotesMedical />
                                </div>

                                <div>

                                  <strong>
                                    {displayValue(
                                      item.disease
                                    )}
                                  </strong>

                                  <span>
                                    History ID:{" "}
                                    {displayValue(
                                      historyId
                                    )}
                                  </span>

                                  <span>
                                    Confidence:{" "}
                                    {displayValue(
                                      item.confidence
                                    )}
                                  </span>

                                </div>

                              </div>

                              <div className="history-risk">

                                <span>
                                  Risk Score:{" "}
                                  {displayValue(
                                    item.risk_score ??
                                    item.riskScore
                                  )}
                                </span>

                                <span
                                  className={`risk-badge risk-${String(
                                    riskLevel
                                  ).toLowerCase()}`}
                                >

                                  {displayValue(
                                    riskLevel
                                  )}

                                </span>

                                <small>

                                  {formatDateTime(
                                    item.created_at ||
                                    item.createdAt
                                  )}

                                </small>

                              </div>

                            </div>

                          );
                        }
                      )}

                    </div>

                  ) : (

                    <div className="no-record-message">

                      No medical history records
                      available.

                    </div>

                  )}

                </section>

              </div>

            )}

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

    <div className="patient-info-item">

      <div className="patient-info-icon">
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

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  label,
  value,
}) {
  return (

    <div className="patient-stat-card">

      <div className="patient-stat-icon">
        {icon}
      </div>

      <div>

        <strong>
          {value}
        </strong>

        <span>
          {label}
        </span>

      </div>

    </div>
  );
}

export default AdminPatients;