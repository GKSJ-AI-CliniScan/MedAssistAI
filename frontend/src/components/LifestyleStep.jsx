import {
  FaArrowLeft,
  FaArrowRight,
  FaHeartbeat,
} from "react-icons/fa";

function LifestyleStep({
  analysisData,
  setAnalysisData,
  nextStep,
  previousStep,
}) {

  const lifestyle = analysisData.lifestyle;

  const updateLifestyle = (field, value) => {

    setAnalysisData({

      ...analysisData,

      lifestyle: {

        ...lifestyle,

        [field]: value,

      },

    });

  };

  return (

    <div className="health-card">

      {/* ================= Header ================= */}

      <div className="health-header">

        <div>

          <h2>Lifestyle Factors</h2>

          <p>

            Step 3 of 4 • Tell us about your daily lifestyle

          </p>

        </div>

      </div>

      {/* ================= Form ================= */}

      <div className="history-grid">

        {/* Smoking */}

        <div className="history-item">

          <label>Do you Smoke?</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={lifestyle.smoking === true}
                onChange={() =>
                  updateLifestyle("smoking", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={lifestyle.smoking === false}
                onChange={() =>
                  updateLifestyle("smoking", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Alcohol */}

        <div className="history-item">

          <label>Do you Consume Alcohol?</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={lifestyle.alcohol === true}
                onChange={() =>
                  updateLifestyle("alcohol", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={lifestyle.alcohol === false}
                onChange={() =>
                  updateLifestyle("alcohol", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Exercise */}

        <div className="history-item">

          <label>Do you Exercise Regularly?</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={lifestyle.exercise === true}
                onChange={() =>
                  updateLifestyle("exercise", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={lifestyle.exercise === false}
                onChange={() =>
                  updateLifestyle("exercise", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Sleep */}

        <div className="history-item">

          <label>Sleep Quality</label>

          <select
            value={lifestyle.sleep}
            onChange={(e) =>
              updateLifestyle("sleep", e.target.value)
            }
          >

            <option value="good">
              Good (7-8 Hours)
            </option>

            <option value="poor">
              Poor (Less than 6 Hours)
            </option>

          </select>

        </div>

        {/* Travel */}

        <div className="history-item">

          <label>Recent Travel?</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={lifestyle.recent_travel === true}
                onChange={() =>
                  updateLifestyle("recent_travel", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={lifestyle.recent_travel === false}
                onChange={() =>
                  updateLifestyle("recent_travel", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Job */}

        <div className="history-item">

          <label>High Risk Occupation?</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={lifestyle.high_risk_job === true}
                onChange={() =>
                  updateLifestyle("high_risk_job", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={lifestyle.high_risk_job === false}
                onChange={() =>
                  updateLifestyle("high_risk_job", false)
                }
              />

              No

            </label>

          </div>

        </div>

      </div>

      {/* ================= Info Card ================= */}

      <div className="info-card">

        <FaHeartbeat className="info-icon" />

        <div>

          <h4>Healthy Lifestyle Improves Prediction</h4>

          <p>

            Lifestyle factors help MedAssist AI estimate
            disease severity and calculate an accurate
            health risk score based on your habits.

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
          className="next-button"
          onClick={nextStep}
        >

          Review

          <FaArrowRight />

        </button>

      </div>

    </div>

  );

}

export default LifestyleStep;