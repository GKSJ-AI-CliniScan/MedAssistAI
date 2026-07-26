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
  const [activeCategory, setActiveCategory] = useState("General");


  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

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
          error.response.data.detail || "Unable to load symptoms."
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

    if (!age || !gender || !height || !weight) {
      toast.error("Please fill in all patient details.");
      return;
    }

    if (age <= 0 || age > 120) {
      toast.error("Please enter a valid age.");
      return;
    }

    if (height <= 0 || height > 250) {
      toast.error("Please enter a valid height.");
      return;
    }

    if (weight <= 0 || weight > 500) {
      toast.error("Please enter a valid weight.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await api.post(
        "/api/history/check",
        {
          symptoms: selectedSymptoms,
          age: Number(age),
          gender: gender,
          height: Number(height),
          weight: Number(weight),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Prediction Response:", response.data);

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
          error.response.data.detail ||
            "Unable to analyze symptoms."
        );
      } else {
        toast.error("Cannot connect to backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Group symptoms by category
  const groupedByCategory = symptomOptions.reduce((acc, symptom) => {
    const cat = symptom.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(symptom);
    return acc;
  }, {});

  const categories = Object.keys(groupedByCategory).sort();

  // Reset active category when symptoms load, if current selection is not in list
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeCategory)) {
      setActiveCategory(categories[0]);
    }
  }, [symptomOptions]);

  const filteredSymptoms = symptomOptions.filter((symptom) =>
    symptom.display_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getSelectedCountForCategory = (cat) => {
    return (groupedByCategory[cat] || []).filter(s => selectedSymptoms.includes(s.key)).length;
  };

  const displayedSymptoms = search
    ? filteredSymptoms
    : (groupedByCategory[activeCategory] || []);

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
          className="w-full border rounded-xl p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />

        {selectedSymptoms.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              Selected Symptoms
            </h3>

            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((symptom) => {
                const opt = symptomOptions.find(o => o.key === symptom);
                const dispName = opt ? opt.display_name : symptom;
                return (
                  <span
                    key={symptom}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium"
                  >
                    {dispName}

                    <button
                      onClick={() => handleCheckboxChange(symptom)}
                      className="font-bold hover:text-blue-900 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            min="1"
            max="120"
          />

          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            placeholder="Height (cm)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            min="1"
            max="250"
          />

          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            min="1"
            max="500"
          />
        </div>

        {/* Category Tabs (shown only when not searching) */}
        {!search && categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 border-b border-gray-100 scrollbar-thin">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              const count = getSelectedCountForCategory(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-gray-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                  {count > 0 && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Symptoms Grid */}
        <div>
          {search && (
            <h3 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">
              Search Results
            </h3>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            {displayedSymptoms.map((symptom) => (
              <label
                key={symptom.key}
                className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all hover:bg-slate-50 ${
                  selectedSymptoms.includes(symptom.key)
                    ? 'border-blue-500 bg-blue-50/30'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSymptoms.includes(symptom.key)}
                  onChange={() =>
                    handleCheckboxChange(symptom.key)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm font-medium text-gray-700">
                  {symptom.display_name}
                </span>
              </label>
            ))}

            {displayedSymptoms.length === 0 && (
              <p className="col-span-2 text-center text-gray-500 mt-4">
                No symptoms found.
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold"
        >
          {loading ? "Analyzing..." : "Analyze Symptoms"}
        </button>
      </div>
    </Layout>

  );
}

export default SymptomChecker;