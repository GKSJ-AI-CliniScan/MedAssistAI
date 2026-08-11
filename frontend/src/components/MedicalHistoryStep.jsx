import {
  FaArrowLeft,
  FaArrowRight,
  FaNotesMedical,
} from "react-icons/fa";

function MedicalHistoryStep({
  analysisData,
  setAnalysisData,
  nextStep,
  previousStep,
}) {

  const history = analysisData.history;

  const updateHistory = (field, value) => {

    setAnalysisData({

      ...analysisData,

      history: {

        ...history,

        [field]: value,

      },

    });

  };

  return (

    <div className="health-card">

      {/* ================= Header ================= */}

      <div className="health-header">

        <div>

          <h2>Medical History</h2>

          <p>
            Step 2 of 4 • Tell us about your previous medical conditions
          </p>

        </div>

      </div>

      {/* ================= Form ================= */}

      <div className="history-grid">

        {/* Diabetes */}

        <div className="history-item">

          <label>Diabetes</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={history.diabetes === true}
                onChange={() =>
                  updateHistory("diabetes", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={history.diabetes === false}
                onChange={() =>
                  updateHistory("diabetes", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Hypertension */}

        <div className="history-item">

          <label>Hypertension</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={history.hypertension === true}
                onChange={() =>
                  updateHistory("hypertension", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={history.hypertension === false}
                onChange={() =>
                  updateHistory("hypertension", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Heart Disease */}

        <div className="history-item">

          <label>Heart Disease</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={history.heartDisease === true}
                onChange={() =>
                  updateHistory("heartDisease", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={history.heartDisease === false}
                onChange={() =>
                  updateHistory("heartDisease", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Asthma */}

        <div className="history-item">

          <label>Asthma</label>

          <div className="radio-group">

            <label>

              <input
                type="radio"
                checked={history.asthma === true}
                onChange={() =>
                  updateHistory("asthma", true)
                }
              />

              Yes

            </label>

            <label>

              <input
                type="radio"
                checked={history.asthma === false}
                onChange={() =>
                  updateHistory("asthma", false)
                }
              />

              No

            </label>

          </div>

        </div>

        {/* Allergies */}

        <div className="history-item full-width">

          <label>Known Allergies</label>

          <textarea
            rows="3"
            placeholder="Enter allergies (if any)"
            value={history.allergies}
            onChange={(e) =>
              updateHistory("allergies", e.target.value)
            }
          />

        </div>

        {/* Medications */}

        <div className="history-item full-width">

          <label>Current Medications</label>

          <textarea
            rows="3"
            placeholder="Enter current medications"
            value={history.medications}
            onChange={(e) =>
              updateHistory("medications", e.target.value)
            }
          />

        </div>

        {/* Surgery */}

        <div className="history-item full-width">

          <label>Previous Surgeries</label>

          <textarea
            rows="3"
            placeholder="Mention previous surgeries (if any)"
            value={history.surgery}
            onChange={(e) =>
              updateHistory("surgery", e.target.value)
            }
          />

        </div>

      </div>

      {/* ================= Information ================= */}

      <div className="info-card">

        <FaNotesMedical className="info-icon" />

        <div>

          <h4>Medical History Matters</h4>

          <p>

            Your previous medical conditions help MedAssist AI
            improve disease prediction accuracy and calculate
            a more reliable health risk score.

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

          Next Step

          <FaArrowRight />

        </button>

      </div>

    </div>

  );

}

export default MedicalHistoryStep;