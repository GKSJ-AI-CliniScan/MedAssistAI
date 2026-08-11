import { FaArrowLeft, FaBrain, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ReviewStep({
  analysisData,
  previousStep,
}) {

  const navigate = useNavigate();

  const handlePrediction = async () => {

    try {

      // ==============================
      // Convert Symptoms
      // ==============================

      const formattedSymptoms = analysisData.symptoms.map((item) =>
        item
          .toLowerCase()
          .replace(/\s+/g, "_")
      );

      // ==============================
      // Get Patient ID
      // ==============================

      const patient_id =
        localStorage.getItem("patient_id") ||
        sessionStorage.getItem("patient_id");

      if (!patient_id) {

        alert("Patient session expired. Please login again.");

        navigate("/login");

        return;

      }

      console.log("Patient ID :", patient_id);
      console.log("Symptoms :", formattedSymptoms);

      // ==============================
      // API Call
      // ==============================

      const response = await axios.post(

        "http://127.0.0.1:8000/prediction/predict",

        {
          patient_id: patient_id,
          symptoms: formattedSymptoms,
        }

      );

      console.log("Prediction Success");
      console.log(response.data);
      

      // ==============================
      // Save Prediction
      // ==============================

      localStorage.setItem(
        "prediction",
        JSON.stringify(response.data)
      );

      // ==============================
      // Save Health Analysis
      // (Used by Risk Assessment)
      // ==============================

      localStorage.setItem(
        "analysisData",
        JSON.stringify(analysisData)
      );
      console.log("analysisData =", analysisData);
      console.log(
        "Saved =",
        localStorage.getItem("analysisData")
      );

      // ==============================
      // Navigate
      // ==============================

      navigate("/prediction");

    } catch (error) {

      console.error("Prediction Error :", error);

      if (error.response) {

        console.log("Status :", error.response.status);

        console.log("Backend Response :", error.response.data);

        alert(
          JSON.stringify(error.response.data, null, 2)
        );

      } else {

        alert("Unable to connect to backend.");

      }

    }

  };

  return (

    <div className="health-card">

      {/* ================= Header ================= */}

      <div className="health-header">

        <div>

          <h2>Review Your Information</h2>

          <p>
            Step 4 of 4 • Please verify all the details before starting AI analysis.
          </p>

        </div>

      </div>

      {/* ================= Symptoms ================= */}

      <div className="review-section">

        <h4>

          <FaCheckCircle />

          Selected Symptoms

        </h4>

        <div className="review-tags">

          {analysisData.symptoms.length > 0 ? (

            analysisData.symptoms.map((symptom) => (

              <span
                key={symptom}
                className="review-tag"
              >
                {symptom}
              </span>

            ))

          ) : (

            <span className="empty-tag">
              No symptoms selected
            </span>

          )}

        </div>

      </div>

      {/* ================= Medical History ================= */}

      <div className="review-section">

        <h4>

          <FaCheckCircle />

          Medical History

        </h4>

        <div className="review-grid">

          <div className="review-box">
            <span>Diabetes</span>
            <strong>
              {analysisData.history.diabetes === null
                ? "Not Selected"
                : analysisData.history.diabetes
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>Hypertension</span>
            <strong>
              {analysisData.history.hypertension === null
                ? "Not Selected"
                : analysisData.history.hypertension
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>Heart Disease</span>
            <strong>
              {analysisData.history.heartDisease === null
                ? "Not Selected"
                : analysisData.history.heartDisease
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>Asthma</span>
            <strong>
              {analysisData.history.asthma === null
                ? "Not Selected"
                : analysisData.history.asthma
                ? "Yes"
                : "No"}
            </strong>
          </div>

        </div>

        <div className="review-text">

          <p>
            <strong>Allergies :</strong>{" "}
            {analysisData.history.allergies || "None"}
          </p>

          <p>
            <strong>Current Medications :</strong>{" "}
            {analysisData.history.medications || "None"}
          </p>

          <p>
            <strong>Previous Surgeries :</strong>{" "}
            {analysisData.history.surgery || "None"}
          </p>

        </div>

      </div>

      {/* ================= Lifestyle ================= */}

      <div className="review-section">

        <h4>

          <FaCheckCircle />

          Lifestyle Factors

        </h4>

        <div className="review-grid">

          <div className="review-box">
            <span>Smoking</span>
            <strong>
              {analysisData.lifestyle.smoking === null
                ? "Not Selected"
                : analysisData.lifestyle.smoking
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>Alcohol</span>
            <strong>
              {analysisData.lifestyle.alcohol === null
                ? "Not Selected"
                : analysisData.lifestyle.alcohol
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>Exercise</span>
            <strong>
              {analysisData.lifestyle.exercise === null
                ? "Not Selected"
                : analysisData.lifestyle.exercise
                ? "Regular"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>Sleep</span>
            <strong>
              {analysisData.lifestyle.sleep}
            </strong>
          </div>

          <div className="review-box">
            <span>Recent Travel</span>
            <strong>
              {analysisData.lifestyle.recent_travel === null
                ? "Not Selected"
                : analysisData.lifestyle.recent_travel
                ? "Yes"
                : "No"}
            </strong>
          </div>

          <div className="review-box">
            <span>High Risk Job</span>
            <strong>
              {analysisData.lifestyle.high_risk_job === null
                ? "Not Selected"
                : analysisData.lifestyle.high_risk_job
                ? "Yes"
                : "No"}
            </strong>
          </div>

        </div>

      </div>

      {/* ================= AI Information ================= */}

      <div className="info-card">

        <FaBrain className="info-icon" />

        <div>

          <h4>Ready for AI Disease Prediction</h4>

          <p>

            MedAssist AI will securely analyze your symptoms,
            medical history, and lifestyle information to
            predict possible diseases and calculate your
            health risk score.

          </p>

        </div>

      </div>

      {/* ================= Buttons ================= */}

      <div className="step-buttons">

        <button
          className="previous-button"
          onClick={previousStep}
        >

          <FaArrowLeft />

          Previous

        </button>

        <button
          className="predict-button"
          onClick={handlePrediction}
        >

          <FaBrain />

          Predict Disease

        </button>

      </div>

    </div>

  );

}

export default ReviewStep;