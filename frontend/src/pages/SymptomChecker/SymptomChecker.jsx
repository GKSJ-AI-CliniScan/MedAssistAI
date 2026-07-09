import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";

function SymptomChecker() {
  const symptomOptions = [
    "Fever",
    "Cough",
    "Headache",
    "Fatigue",
    "Chest Pain",
    "Shortness of Breath",
    "Vomiting",
    "Sore Throat",
    "Body Pain",
    "Nausea",
  ];

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(
        selectedSymptoms.filter((item) => item !== symptom)
      );
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAnalyze = async () => {
  try {
    // This will work once the FastAPI backend is ready
    // const response = await api.post("/predict", {
    //   symptoms: selectedSymptoms,
    // });

    // Temporary frontend navigation
    navigate("/prediction", {
      state: {
        symptoms: selectedSymptoms,
      },
    });

  } catch (error) {
    console.error(error);
    alert("Unable to connect to the server.");
  }
};

  return (
    <Layout>
      <div className="max-w-3xl bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Symptom Checker
        </h1>

        <p className="text-gray-500 mb-8">
          Select your symptoms and let AI analyze them.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">

            <input
                type="number"
                placeholder="Age"
                className="border rounded-xl p-3"
            />

            <select className="border rounded-xl p-3">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
            </select>

            <input
                type="number"
                placeholder="Height (cm)"
                className="border rounded-xl p-3"
            />

            <input
                type="number"
                placeholder="Weight (kg)"
                className="border rounded-xl p-3"
            />

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {symptomOptions.map((symptom) => (
            <label
              key={symptom}
              className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => handleCheckboxChange(symptom)}
              />

              {symptom}
            </label>
          ))}

        </div>

        <button
          onClick={handleAnalyze}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          Analyze Symptoms
        </button>

      </div>
    </Layout>
  );
}

export default SymptomChecker;