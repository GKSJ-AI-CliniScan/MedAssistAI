import {
  FaFileMedical,
  FaDownload,
  FaHistory,
  FaUser,
  FaHeartbeat,
  FaShieldAlt,
} from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/HealthReport.css";

function HealthReport() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  // =====================================================
  // PREVENT DUPLICATE REPORT GENERATION
  // =====================================================

  const reportRequestInProgress = useRef(false);
  const generatedForPrediction = useRef(null);

  // =====================================================
  // LOAD HEALTH REPORT
  // =====================================================

  useEffect(() => {
    loadReport();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // LOAD REPORT
  // =====================================================

  const loadReport = async () => {
    try {
      // =================================================
      // FIRST:
      // Check whether user came from Medical Records
      // =================================================

      const selectedMedicalRecord = JSON.parse(
        localStorage.getItem("selectedMedicalRecord")
      );

      // =================================================
      // HISTORICAL MEDICAL RECORD FLOW
      // =================================================

      if (selectedMedicalRecord) {
        console.log(
          "Opening selected historical medical record:",
          selectedMedicalRecord
        );

        const currentPatientId =
          selectedMedicalRecord.patient_id ||
          localStorage.getItem("patient_id") ||
          "";

        // =================================================
        // Try to get patient information
        // =================================================

        let patientData = {};

        try {
          const token =
            localStorage.getItem("access_token") ||
            sessionStorage.getItem("access_token");

          if (token) {
            const userResponse = await axios.get(
              "http://127.0.0.1:8000/auth/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            patientData = userResponse.data || {};
          }
        } catch (userError) {
          console.warn(
            "Unable to load current patient information:",
            userError
          );
        }

        // =================================================
        // Parse recommendation
        // =================================================

        let recommendationData = {};

        if (selectedMedicalRecord.recommendation) {
          try {
            if (
              typeof selectedMedicalRecord.recommendation ===
              "string"
            ) {
              recommendationData = JSON.parse(
                selectedMedicalRecord.recommendation
              );
            } else {
              recommendationData =
                selectedMedicalRecord.recommendation;
            }
          } catch (recommendationError) {
            console.warn(
              "Unable to parse recommendation:",
              recommendationError
            );

            recommendationData = {
              "Doctor Advice":
                selectedMedicalRecord.recommendation,
            };
          }
        }

        // =================================================
        // Build historical report object
        // =================================================

        const historicalReport = {
          message: "Historical medical report",

          report: {
            report_id:
              selectedMedicalRecord.report_id || "-",

            generated_date:
              selectedMedicalRecord.date ||
              selectedMedicalRecord.created_at ||
              null,

            report_path:
              selectedMedicalRecord.report_path || null,
          },

          patient: {
            patient_id:
              selectedMedicalRecord.patient_id ||
              patientData.patient_id ||
              currentPatientId ||
              "-",

            patient_name:
              patientData.full_name ||
              patientData.patient_name ||
              localStorage.getItem("full_name") ||
              "-",

            age:
              patientData.age ??
              selectedMedicalRecord.age ??
              "-",

            gender:
              patientData.gender ||
              selectedMedicalRecord.gender ||
              "-",

            blood_group:
              patientData.blood_group ||
              selectedMedicalRecord.blood_group ||
              "-",

            email:
              patientData.email ||
              selectedMedicalRecord.email ||
              "-",

            phone:
              patientData.phone ||
              selectedMedicalRecord.phone ||
              "-",

            address:
              patientData.address ||
              selectedMedicalRecord.address ||
              "-",

            emergency_contact:
              patientData.emergency_contact ||
              selectedMedicalRecord.emergency_contact ||
              "-",

            photo:
              patientData.photo ||
              selectedMedicalRecord.photo ||
              null,
          },

          prediction: {
            prediction_id:
              selectedMedicalRecord.prediction_id || "-",

            symptoms:
              selectedMedicalRecord.symptoms || "-",

            disease:
              selectedMedicalRecord.disease || "-",

            confidence:
              selectedMedicalRecord.confidence ?? "-",
          },

          risk: {
            risk_score:
              selectedMedicalRecord.risk_score ?? "-",

            risk_level:
              selectedMedicalRecord.risk_level || "-",
          },

          recommendation: recommendationData,
        };

        console.log(
          "HISTORICAL HEALTH REPORT:",
          historicalReport
        );

        // =================================================
        // Save and display historical report
        // =================================================

        localStorage.setItem(
          "healthReport",
          JSON.stringify(historicalReport)
        );

        setReport(historicalReport);
        setLoading(false);

        return;
      }

      // =====================================================
      // NORMAL / NEW HEALTH ANALYSIS FLOW
      // =====================================================

      const prediction =
        JSON.parse(
          localStorage.getItem("prediction")
        ) || {};

      // =================================================
      // Check Prediction ID
      // =================================================

      if (!prediction?.prediction_id) {
        alert("Prediction ID not found.");

        navigate("/prediction");

        return;
      }

      const predictionId =
        prediction.prediction_id;

      console.log(
        "Prediction ID:",
        predictionId
      );

      // =================================================
      // PREVENT DUPLICATE REQUEST
      // =================================================

      if (
        reportRequestInProgress.current
      ) {
        console.log(
          "Report generation already in progress. Skipping duplicate request."
        );

        return;
      }

      // =================================================
      // PREVENT SECOND REQUEST FOR SAME PREDICTION
      // =================================================

      if (
        generatedForPrediction.current ===
        predictionId
      ) {
        console.log(
          "Report already requested for this prediction. Skipping."
        );

        return;
      }

      // =================================================
      // CHECK LOCAL STORAGE FIRST
      // =================================================

      const existingHealthReport =
        JSON.parse(
          localStorage.getItem("healthReport")
        );

      if (
        existingHealthReport?.prediction
          ?.prediction_id === predictionId
      ) {
        console.log(
          "Existing health report found in localStorage."
        );

        setReport(
          existingHealthReport
        );

        setLoading(false);

        return;
      }

      // =================================================
      // MARK REQUEST AS IN PROGRESS
      // =================================================

      reportRequestInProgress.current =
        true;

      generatedForPrediction.current =
        predictionId;

      console.log(
        "Generating report for prediction:",
        predictionId
      );

      // =================================================
      // Generate Health Report
      // =================================================

      const response = await axios.post(
        "http://127.0.0.1:8000/report/generate",
        {
          prediction_id: predictionId,
        }
      );

      // =================================================
      // Debug Response
      // =================================================

      console.log(
        "HEALTH REPORT RESPONSE:",
        response.data
      );

      // =================================================
      // Save Report
      // =================================================

      localStorage.setItem(
        "healthReport",
        JSON.stringify(response.data)
      );

      setReport(response.data);

    } catch (error) {
      console.error(
        "REPORT ERROR:",
        error
      );

      if (error.response) {
        console.error(
          "REPORT SERVER RESPONSE:",
          error.response.data
        );
      }

      alert(
        "Unable to Generate Health Report"
      );

      // =================================================
      // Allow retry if request actually failed
      // =================================================

      reportRequestInProgress.current =
        false;

      generatedForPrediction.current =
        null;

    } finally {
      setLoading(false);

      // =================================================
      // Request is no longer in progress
      // =================================================

      reportRequestInProgress.current =
        false;
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <FaFileMedical
          style={{
            fontSize: "50px",
            color: "#2563eb",
          }}
        />

        <h3>
          Generating Professional Health Report...
        </h3>
      </div>
    );
  }

  // =====================================================
  // NO REPORT
  // =====================================================

  if (!report) {
    return (
      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h2>
          Report Not Available
        </h2>

        <button
          className="records-btn"
          onClick={() =>
            navigate("/records")
          }
          style={{
            marginTop: "20px",
          }}
        >
          <FaHistory />
          Medical Records
        </button>
      </div>
    );
  }

  // =====================================================
  // SAFE DATA EXTRACTION
  // =====================================================

  const reportInfo =
    report?.report || {};

  const patient =
    report?.patient || {};

  const prediction =
    report?.prediction || {};

  const risk =
    report?.risk || {};

  const recommendation =
    report?.recommendation || {};

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadReport = () => {
    if (!reportInfo?.report_path) {
      alert(
        "PDF is not available for this medical record."
      );

      return;
    }

    let reportPath =
      reportInfo.report_path;

    reportPath =
      reportPath.replace(/\\/g, "/");

    if (
      reportPath.startsWith("reports/")
    ) {
      reportPath =
        reportPath.substring(
          "reports/".length
        );
    }

    if (
      reportPath.startsWith("/reports/")
    ) {
      reportPath =
        reportPath.substring(
          "/reports/".length
        );
    }

    const pdfUrl =
      `http://127.0.0.1:8000/reports/${reportPath}`;

    console.log(
      "Opening PDF:",
      pdfUrl
    );

    window.open(
      pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    try {
      return new Date(
        dateValue
      ).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  // =====================================================
  // FORMAT CONFIDENCE
  // =====================================================

  const formatConfidence = (
    confidence
  ) => {
    if (
      confidence === null ||
      confidence === undefined ||
      confidence === "" ||
      confidence === "-"
    ) {
      return "-";
    }

    const numericConfidence =
      Number(confidence);

    if (
      Number.isNaN(
        numericConfidence
      )
    ) {
      return confidence;
    }

    return `${numericConfidence}%`;
  };

  // =====================================================
  // FORMAT RISK SCORE
  // =====================================================

  const formatRiskScore = (
    score
  ) => {
    if (
      score === null ||
      score === undefined ||
      score === "" ||
      score === "-"
    ) {
      return "-";
    }

    return `${score}/100`;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <div className="hero-card">

        <div className="hero-left">

          <span className="hero-tag">
            AI GENERATED HEALTH REPORT
          </span>

          <h1>
            Professional Medical Report
          </h1>

          <p>
            This report has been generated by
            MedAssist AI after analyzing your
            symptoms, disease prediction,
            risk assessment and treatment
            recommendation.
          </p>

        </div>

        <div className="hero-right">

          <div className="report-circle">

            <FaFileMedical
              className="report-icon"
            />

            <h2>
              {reportInfo?.report_id ||
                "N/A"}
            </h2>

            <span>
              Report ID
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          REPORT SUMMARY
      ===================================================== */}

      <div className="summary-grid">

        <div className="summary-card">

          <h5>
            Report ID
          </h5>

          <h3>
            {reportInfo?.report_id ||
              "-"}
          </h3>

        </div>

        <div className="summary-card">

          <h5>
            Patient ID
          </h5>

          <h3>
            {patient?.patient_id ||
              "-"}
          </h3>

        </div>

        <div className="summary-card">

          <h5>
            Prediction ID
          </h5>

          <h3>
            {prediction?.prediction_id ||
              "-"}
          </h3>

        </div>

        <div className="summary-card">

          <h5>
            Generated Date
          </h5>

          <h3>
            {formatDate(
              reportInfo?.generated_date
            )}
          </h3>

        </div>

      </div>

      {/* =====================================================
          PATIENT INFORMATION
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <FaUser />

          <h2>
            Patient Information
          </h2>

        </div>

        <div className="patient-grid">

          <div>
            <label>
              Patient Name
            </label>

            <span>
              {patient?.patient_name ||
                "-"}
            </span>
          </div>

          <div>
            <label>
              Age
            </label>

            <span>
              {patient?.age ?? "-"}
            </span>
          </div>

          <div>
            <label>
              Gender
            </label>

            <span>
              {patient?.gender || "-"}
            </span>
          </div>

          <div>
            <label>
              Blood Group
            </label>

            <span>
              {patient?.blood_group ||
                "-"}
            </span>
          </div>

          <div>
            <label>
              Email
            </label>

            <span>
              {patient?.email || "-"}
            </span>
          </div>

          <div>
            <label>
              Phone
            </label>

            <span>
              {patient?.phone || "-"}
            </span>
          </div>

          <div className="full-width">

            <label>
              Address
            </label>

            <span>
              {patient?.address || "-"}
            </span>

          </div>

          <div className="full-width">

            <label>
              Emergency Contact
            </label>

            <span>
              {patient?.emergency_contact ||
                "-"}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          DISEASE PREDICTION
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <FaHeartbeat />

          <h2>
            Disease Prediction
          </h2>

        </div>

        <div className="patient-grid">

          <div>

            <label>
              Predicted Disease
            </label>

            <span className="highlight">
              {prediction?.disease ||
                "-"}
            </span>

          </div>

          <div>

            <label>
              Confidence
            </label>

            <span>
              {formatConfidence(
                prediction?.confidence
              )}
            </span>

          </div>

          <div className="full-width">

            <label>
              Symptoms
            </label>

            <span>
              {prediction?.symptoms ||
                "-"}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          RISK ASSESSMENT
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <FaShieldAlt />

          <h2>
            Risk Assessment
          </h2>

        </div>

        <div className="patient-grid">

          <div>

            <label>
              Risk Score
            </label>

            <span>
              {formatRiskScore(
                risk?.risk_score
              )}
            </span>

          </div>

          <div>

            <label>
              Risk Level
            </label>

            <span
              className={
                `risk-${
                  risk?.risk_level
                    ?.toLowerCase() ||
                  ""
                }`
              }
            >
              {risk?.risk_level || "-"}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          TREATMENT RECOMMENDATION
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <FaFileMedical />

          <h2>
            Treatment Recommendation
          </h2>

        </div>

        <div className="patient-grid">

          <div className="full-width">

            <label>
              Disease Description
            </label>

            <span>
              {
                recommendation?.Description ||
                "Not available"
              }
            </span>

          </div>

          <div className="full-width">

            <label>
              Doctor Advice
            </label>

            <span>
              {
                recommendation?.[
                  "Doctor Advice"
                ] ||
                "Not available"
              }
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          MEDICINES
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            Recommended Medicines
          </h2>

        </div>

        <div className="item-grid">

          {
            Array.isArray(
              recommendation?.Medications
            ) &&
            recommendation.Medications.length >
              0
              ? (
                recommendation.Medications.map(
                  (item, index) => (
                    <div
                      className="item-card medicine"
                      key={index}
                    >
                      {item}
                    </div>
                  )
                )
              )
              : (
                <p>
                  No medicines available
                </p>
              )
          }

        </div>

      </div>

      {/* =====================================================
          DIET
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            Recommended Diet
          </h2>

        </div>

        <div className="item-grid">

          {
            Array.isArray(
              recommendation?.Diet
            ) &&
            recommendation.Diet.length >
              0
              ? (
                recommendation.Diet.map(
                  (item, index) => (
                    <div
                      className="item-card diet"
                      key={index}
                    >
                      {item}
                    </div>
                  )
                )
              )
              : (
                <p>
                  No diet recommendation available
                </p>
              )
          }

        </div>

      </div>

      {/* =====================================================
          WORKOUT / LIFESTYLE
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            Lifestyle & Workout
          </h2>

        </div>

        <div className="item-grid">

          {
            Array.isArray(
              recommendation?.Workout
            ) &&
            recommendation.Workout.length >
              0
              ? (
                recommendation.Workout.map(
                  (item, index) => (
                    <div
                      className="item-card workout"
                      key={index}
                    >
                      {item}
                    </div>
                  )
                )
              )
              : (
                <p>
                  No workout recommendation available
                </p>
              )
          }

        </div>

      </div>

      {/* =====================================================
          PRECAUTIONS
      ===================================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            Precautions
          </h2>

        </div>

        <div className="item-grid">

          {
            Array.isArray(
              recommendation?.Precautions
            ) &&
            recommendation.Precautions.length >
              0
              ? (
                recommendation.Precautions.map(
                  (item, index) => (
                    <div
                      className="item-card precaution"
                      key={index}
                    >
                      {item}
                    </div>
                  )
                )
              )
              : (
                <p>
                  No precautions available
                </p>
              )
          }

        </div>

      </div>

      {/* =====================================================
          ACTION BUTTONS
      ===================================================== */}

      <div className="button-area">

        <button
          className="download-btn"
          onClick={downloadReport}
        >
          <FaDownload />

          Download PDF
        </button>

        <button
          className="records-btn"
          onClick={() => {

            localStorage.removeItem(
              "selectedMedicalRecord"
            );

            navigate("/records");

          }}
        >
          <FaHistory />

          Medical Records
        </button>

      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

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

export default HealthReport; 