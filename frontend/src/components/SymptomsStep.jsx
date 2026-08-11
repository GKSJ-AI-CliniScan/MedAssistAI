import { useMemo, useState } from "react";
import {
  FaSearch,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

function SymptomsStep({
  analysisData,
  setAnalysisData,
  nextStep,
}) {

  const [search, setSearch] = useState("");

  const symptoms = [

    "Itching",
    "Skin Rash",
    "Continuous Sneezing",
    "Shivering",
    "Chills",
    "Joint Pain",
    "Stomach Pain",
    "Acidity",
    "Ulcers On Tongue",
    "Muscle Wasting",
    "Vomiting",
    "Burning Micturition",
    "Spotting Urination",
    "Fatigue",
    "Weight Gain",
    "Anxiety",
    "Cold Hands And Feet",
    "Mood Swings",
    "Weight Loss",
    "Restlessness",
    "Lethargy",
    "Patches In Throat",
    "Irregular Sugar Level",
    "Cough",
    "High Fever",
    "Sunken Eyes",
    "Breathlessness",
    "Sweating",
    "Dehydration",
    "Indigestion",
    "Headache",
    "Yellowish Skin",
    "Dark Urine",
    "Nausea",
    "Loss Of Appetite",
    "Pain Behind The Eyes",
    "Back Pain",
    "Constipation",
    "Abdominal Pain",
    "Diarrhoea",
    "Mild Fever",
    "Yellow Urine",
    "Yellowing Of Eyes",
    "Acute Liver Failure",
    "Fluid Overload",
    "Swelling Of Stomach",
    "Swelled Lymph Nodes",
    "Malaise",
    "Blurred Vision",
    "Chest Pain",
    "Fast Heart Rate",
    "Dizziness",
    "Loss Of Balance",
    "Weakness",
    "Neck Pain",
    "Stiff Neck",
    "Pain During Bowel Movements",
    "Pain In Anal Region",
    "Bloody Stool",
    "Irritation In Anus"

  ];

  const filteredSymptoms = useMemo(() => {

    return symptoms.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );

  }, [search]);

  const toggleSymptom = (symptom) => {

    let selected = [...analysisData.symptoms];

    if (selected.includes(symptom)) {

      selected = selected.filter(
        (item) => item !== symptom
      );

    } else {

      if (selected.length >= 17) return;

      selected.push(symptom);

    }

    setAnalysisData({

      ...analysisData,

      symptoms: selected,

    });

  };
    return (

    <div className="health-card">

      {/* ================= Header ================= */}

      <div className="health-header">

        <div>

          <h2>Health Analysis</h2>

          <p>
            Step 1 of 4 • Select the symptoms you are currently experiencing
          </p>

        </div>

        <div className="secure-box">

          <FaShieldAlt />

          Secure Analysis

        </div>

      </div>

      {/* ================= Search ================= */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* ================= Counter ================= */}

      <div className="selected-count">

        Selected

        <span>

          {analysisData.symptoms.length}

        </span>

        /17 Symptoms

      </div>

      {/* ================= Layout ================= */}

      <div className="symptoms-layout">

        {/* Left Side */}

        <div className="symptoms-grid">

          {filteredSymptoms.map((symptom) => {

            const selected =
              analysisData.symptoms.includes(symptom);

            return (

              <div
                key={symptom}
                className={
                  selected
                    ? "symptom-card selected"
                    : "symptom-card"
                }
                onClick={() =>
                  toggleSymptom(symptom)
                }
              >

                <div className="symptom-checkbox">

                  {selected && <FaCheckCircle />}

                </div>

                <span>{symptom}</span>

              </div>

            );

          })}

        </div>

        {/* Right Side */}

        <div className="selected-panel">

          <h4>Selected Symptoms</h4>

          {analysisData.symptoms.length === 0 ? (

            <div className="empty-selected">

              No symptoms selected

            </div>

          ) : (

            <div className="selected-list">

              {analysisData.symptoms.map((symptom) => (

                <div
                  key={symptom}
                  className="selected-item"
                >

                  <FaCheckCircle />

                  <span>{symptom}</span>

                </div>

              ))}

            </div>

          )}
                    {/* ================= Information Card ================= */}

          <div className="info-card">

            <FaShieldAlt className="info-icon" />

            <div>

              <h4>Your Health Data is Protected</h4>

              <p>
                Your selected symptoms are securely stored and will
                only be used for AI-powered disease prediction,
                risk assessment, treatment recommendation,
                and professional health report generation.
              </p>

            </div>

          </div>

          {/* ================= Next Button ================= */}

          <div className="step-buttons">

            <button
              className="next-button"
              disabled={analysisData.symptoms.length === 0}
              onClick={nextStep}
            >

              Next Step

              <FaArrowRight />

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default SymptomsStep;