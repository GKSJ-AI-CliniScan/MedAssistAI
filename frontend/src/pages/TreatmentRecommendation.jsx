import {
  FaUserMd,
  FaPills,
  FaAppleAlt,
  FaRunning,
  FaShieldAlt,
  FaArrowRight,
  FaHeartbeat,
  FaInfoCircle,
} from "react-icons/fa";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/TreatmentRecommendation.css";

function TreatmentRecommendation() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState({});

  useEffect(() => {
    loadRecommendation();
  }, []);

  const loadRecommendation = async () => {
    try {
      const prediction =
        JSON.parse(localStorage.getItem("prediction")) || {};

      const response = await axios.post(
        "http://127.0.0.1:8000/recommendation/get",
        {
          disease: prediction["Predicted Disease"],
        }
      );

      localStorage.setItem(
        "recommendation",
        JSON.stringify(response.data)
      );

      setRecommendation(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Unable to load Treatment Recommendation");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <h2>Generating AI Treatment Plan...</h2>
      </div>
    );
  }

  const {
    Disease = "",
    Description = "",
    Medications = [],
    Diet = [],
    Workout = [],
    Precautions = [],
    "Severity Category": severity = "Unknown",
    "Severity Weight": severityWeight = 0,
    "Doctor Advice": doctorAdvice = "",
  } = recommendation;

  const getSeverityColor = () => {
    switch (severity.toLowerCase()) {
      case "mild":
        return "#22c55e";

      case "moderate":
        return "#f59e0b";

      case "serious":
        return "#f97316";

      case "critical":
        return "#ef4444";

      default:
        return "#2563eb";
    }
  };

  const goToReport = () => {
    navigate("/report");
  };

  return (
    <div>

      {/* ===========================================
          HERO SECTION
      =========================================== */}

      <div className="hero-card">

        <div className="hero-left">

          <h1>
            Personalized Treatment Recommendation
          </h1>

          <p>
            Based on your predicted disease,
            MedAssist AI has generated a
            personalized treatment plan including
            medicines, diet, workout and
            precautions to help you recover safely.
          </p>

        </div>

        <div className="hero-right">

          <div className="risk-circle">

            <h2>{severityWeight}</h2>

            <span>/100</span>

            <div
              className="risk-level"
              style={{
                color: getSeverityColor(),
              }}
            >
              {severity}
            </div>

          </div>

        </div>

      </div>

      {/* ===========================================
          SUMMARY CARDS
      =========================================== */}

      <div className="summary-grid">

        <div className="score-card">

          <FaHeartbeat className="summary-icon" />

          <h5>Disease</h5>

          <h3>{Disease}</h3>

        </div>

        <div className="score-card">

          <FaShieldAlt className="summary-icon" />

          <h5>Severity</h5>

          <h3
            style={{
              color: getSeverityColor(),
            }}
          >
            {severity}
          </h3>

        </div>

        <div className="score-card">

          <FaUserMd className="summary-icon" />

          <h5>Recovery Score</h5>

          <h3>{severityWeight}/100</h3>

        </div>

        <div className="score-card">

          <FaInfoCircle className="summary-icon" />

          <h5>Status</h5>

          <h3>AI Generated</h3>

        </div>

      </div>

      {/* ===========================================
          DESCRIPTION
      =========================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            Disease Description
          </h2>

        </div>

        <p className="description-text">
          {Description}
        </p>

      </div>

      {/* ===========================================
          MEDICINES
      =========================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            <FaPills /> Recommended Medicines
          </h2>

        </div>

        <div className="item-grid">

          {Medications.length > 0 ? (

            Medications.map((medicine, index) => (

              <div
                className="item-card medicine"
                key={index}
              >

                <FaPills className="item-icon" />

                <span>{medicine}</span>

              </div>

            ))

          ) : (

            <p>No medicines available.</p>

          )}

        </div>

      </div>

      {/* ===========================================
          DIET
      =========================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            <FaAppleAlt />
            Recommended Diet
          </h2>

        </div>

        <div className="item-grid">

          {Diet.length > 0 ? (

            Diet.map((food, index) => (

              <div
                className="item-card diet"
                key={index}
              >

                <FaAppleAlt className="item-icon" />

                <span>{food}</span>

              </div>

            ))

          ) : (

            <p>
              No diet recommendations available.
            </p>

          )}

        </div>

      </div>

      {/* ===========================================
          WORKOUT
      =========================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            <FaRunning />
            Lifestyle & Workout
          </h2>

        </div>

        <div className="item-grid">

          {Workout.length > 0 ? (

            Workout.map((exercise, index) => (

              <div
                className="item-card workout"
                key={index}
              >

                <FaRunning className="item-icon" />

                <span>{exercise}</span>

              </div>

            ))

          ) : (

            <p>
              No workout recommendations available.
            </p>

          )}

        </div>

      </div>

      {/* ===========================================
          PRECAUTIONS
      =========================================== */}

      <div className="content-card">

        <div className="section-title">

          <h2>
            <FaShieldAlt />
            Precautions
          </h2>

        </div>

        <div className="item-grid">

          {Precautions.length > 0 ? (

            Precautions.map((item, index) => (

              <div
                className="item-card precaution"
                key={index}
              >

                <FaShieldAlt className="item-icon" />

                <span>{item}</span>

              </div>

            ))

          ) : (

            <p>
              No precautions available.
            </p>

          )}

        </div>

      </div>

      {/* ===========================================
          DOCTOR ADVICE
      =========================================== */}

      <div className="advice-card">

        <div className="advice-icon">

          <FaUserMd />

        </div>

        <div>

          <h3>
            Doctor Advice
          </h3>

          <p>
            {doctorAdvice}
          </p>

        </div>

      </div>

      {/* ===========================================
          GENERATE REPORT BUTTON
      =========================================== */}

      <div className="button-area">

        <button
          className="next-btn"
          onClick={goToReport}
        >
          Generate Health Report

          <FaArrowRight />

        </button>

      </div>

      {/* ===========================================
          FOOTER
      =========================================== */}

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

export default TreatmentRecommendation;