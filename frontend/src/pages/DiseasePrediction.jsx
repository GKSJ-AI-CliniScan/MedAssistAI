import {
  FaBrain,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/DiseasePrediction.css";

function DiseasePrediction() {
  const navigate = useNavigate();

  // ==========================
  // Read Prediction Data
  // ==========================

  const prediction =
    JSON.parse(localStorage.getItem("prediction")) || {};

  const analysisData =
    JSON.parse(localStorage.getItem("analysisData")) || {};

  const {
    prediction_id,
    "Predicted Disease": predictedDisease,
    "Confidence Score": confidenceScore,
    "Selected Symptoms": selectedSymptoms,
    "Other Possible Diseases": otherDiseases,
  } = prediction;

  // ==========================
  // Risk Assessment
  // ==========================

  const goToRiskAssessment = async () => {
    try {
      // ==========================
      // Patient Age
      // ==========================

      const age = Number(localStorage.getItem("age"));

      // ==========================
      // Medical History
      // Backend expects List[str]
      // ==========================

      const history = [];

      if (analysisData.history?.diabetes)
        history.push("diabetes");

      if (analysisData.history?.hypertension)
        history.push("hypertension");

      if (analysisData.history?.heartDisease)
        history.push("heart disease");

      if (analysisData.history?.asthma)
        history.push("asthma");

      // ==========================
      // Lifestyle
      // Backend expects Dictionary
      // ==========================

      const lifestyle = {
        smoking:
          analysisData.lifestyle?.smoking || false,

        alcohol:
          analysisData.lifestyle?.alcohol || false,

        exercise:
          analysisData.lifestyle?.exercise || false,

        sleep: (
          analysisData.lifestyle?.sleep || "good"
        ).toLowerCase(),

        recent_travel:
          analysisData.lifestyle?.recent_travel || false,

        high_risk_job:
          analysisData.lifestyle?.high_risk_job || false,
      };

      // ==========================
      // Call Backend
      // ==========================

      const response = await axios.post(
        "http://127.0.0.1:8000/risk/assess",
        {
          prediction_id: prediction_id,
          disease: predictedDisease,
          symptoms: selectedSymptoms,
          age: age,
          history: history,
          lifestyle: lifestyle,
        }
      );

      console.log("Risk Response");
      console.log(response.data);

      // ==========================
      // Save Risk Result
      // ==========================

      localStorage.setItem(
        "riskAssessment",
        JSON.stringify(response.data)
      );

      // ==========================
      // Navigate
      // ==========================

      navigate("/risk");
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Risk Assessment Failed");
    }
  };

  return (
    <div>

      {/* ==========================
          Header
      ========================== */}

      <div className="prediction-header">
        <div>
          <h2>
            <FaBrain className="me-2" />
            AI Disease Prediction
          </h2>

          <p>
            Your health information has been successfully
            analyzed by MedAssist AI.
          </p>
        </div>

        <div className="prediction-status">
          <FaCheckCircle />
          Prediction Completed
        </div>
      </div>

      {/* ==========================
          Prediction Card
      ========================== */}

      <div className="prediction-card">
        <div className="prediction-item">
          <span>Predicted Disease</span>

          <h3>{predictedDisease}</h3>
        </div>

        <div className="prediction-item">
          <span>Confidence Score</span>

          <h3>{confidenceScore}%</h3>
        </div>

        <div className="prediction-item">
          <span>Prediction ID</span>

          <h3>{prediction_id}</h3>
        </div>
      </div>

      {/* ==========================
          Confidence
      ========================== */}

      <div className="confidence-card">
        <div className="confidence-header">
          <span>AI Confidence Level</span>

          <strong>{confidenceScore}%</strong>
        </div>

        <div className="confidence-bar">
          <div
            className="confidence-fill"
            style={{
              width: `${confidenceScore || 0}%`,
            }}
          ></div>
        </div>
      </div>

      {/* ==========================
          Symptoms
      ========================== */}

      <div className="prediction-section">
        <h4>Selected Symptoms</h4>

        <div className="symptom-tags">
          {selectedSymptoms?.length > 0 ? (
            selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="symptom-tag"
              >
                {symptom.replaceAll("_", " ")}
              </span>
            ))
          ) : (
            <p>No symptoms available.</p>
          )}
        </div>
      </div>

      {/* ==========================
          Other Diseases
      ========================== */}

      <div className="prediction-section">
        <h4>Other Possible Diseases</h4>

        <div className="other-disease-list">
          {otherDiseases?.map((item, index) => (
            <div
              key={index}
              className="other-disease-card"
            >
              <div>
                <h5>{item.Disease}</h5>
              </div>

              <span>{item.Probability}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ==========================
          Notice
      ========================== */}

      <div className="prediction-info">
        <FaBrain className="info-icon" />

        <div>
          <h4>Important Notice</h4>

          <p>
            This prediction is generated using an AI model
            trained on medical datasets. It is intended for
            educational purposes only and should not replace
            professional medical advice.
          </p>
        </div>
      </div>

      {/* ==========================
          Button
      ========================== */}

      <div className="prediction-buttons">
        <button
          className="next-button"
          onClick={goToRiskAssessment}
        >
          Proceed to Risk Assessment

          <FaArrowRight />
        </button>
      </div>

      {/* ==========================
          FOOTER
      ========================== */}

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

export default DiseasePrediction;