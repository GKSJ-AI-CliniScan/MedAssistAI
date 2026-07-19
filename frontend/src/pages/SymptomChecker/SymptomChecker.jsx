import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import api from "../../services/api";
import toast from "react-hot-toast";

function SymptomChecker() {

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomOptions, setSymptomOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.get("/api/symptoms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      setSymptomOptions(response.data);
    } catch (error) {
      console.log(error);

      if (error.response) {
        console.log("Backend Response:", error.response.data);

        toast.error(
          error.response.data.detail || "Unable to analyze symptoms."
        );
      } else {
        toast.error("Cannot connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

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
  if (selectedSymptoms.length === 0) {
    toast.error("Please select at least one symptom.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/api/history/check",
      {
        symptoms: selectedSymptoms,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    console.log("Navigation Data:", response.data);

    navigate("/prediction", {
      state: {
        result: response.data,
      },
    });

  } catch (error) {
    console.log(error);

    if (error.response) {
      console.log("Backend Response:", error.response.data);

      toast.error(
        error.response.data.detail || "Unable to analyze symptoms."
      );
    } else {
      toast.error("Cannot connect to backend.");
    }
  }
};

const filteredSymptoms = symptomOptions.filter((symptom) =>
  symptom.display_name
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <Layout>
      <div className="max-w-3xl bg-white rounded-3xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-2">
          Symptom Checker
        </h1>

        <p className="text-gray-500 mb-8">
          Select your symptoms and let AI analyze them.
        </p>

        <input
          type="text"
          placeholder="Search symptoms (e.g. fever, cough, headache...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-3 mb-6"
        />

        {selectedSymptoms.length > 0 && (
  <div className="mb-6">
    <h3 className="font-semibold mb-2">Selected Symptoms</h3>

    <div className="flex flex-wrap gap-2">
      {selectedSymptoms.map((symptom) => (
        <span
          key={symptom}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
        >
          {symptom}

          <button
            onClick={() => handleCheckboxChange(symptom)}
            className="font-bold"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  </div>
)}

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

          {filteredSymptoms.map((symptom) => (
            <label
              key={symptom.key}
              className="flex items-center gap-3 border rounded-xl p-3 cursor-pointer hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom.key)}
                onChange={() => handleCheckboxChange(symptom.key)}
              />

              {symptom.display_name}
            </label>
          ))}

          {filteredSymptoms.length === 0 && (
            <p className="col-span-2 text-center text-gray-500 mt-4">
              No symptoms found.
            </p>
          )}

        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Analyzing..." : "Analyze Symptoms"}
        </button>

      </div>
    </Layout>
  );
}

export default SymptomChecker;