import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";

function PredictionDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const report = location.state?.report;

  const riskColor =
    report?.risk_level === "high"
      ? "bg-red-100 text-red-700"
      : report?.risk_level === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-green-100 text-green-700";

  if (!report) {
    return (
      <Layout>
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">
            Report Not Found
          </h2>

          <button
            onClick={() => navigate("/reports")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Reports
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-slate-800">
          🩺 AI Prediction Details
        </h1>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* Top Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">

            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-gray-500 font-semibold mb-2">
                📅 Date
              </h3>

              <p className="text-lg font-bold text-slate-800">
                {new Date(report.created_at).toLocaleString()}
              </p>
            </div>

            <div className={`rounded-2xl p-6 ${riskColor}`}>
              <h3 className="font-semibold mb-2">
                ⚠ Risk Level
              </h3>

              <p className="text-2xl font-bold capitalize">
                {report.risk_level}
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-gray-500 font-semibold mb-2">
                ⭐ Risk Score
              </h3>

              <p className="text-3xl font-bold">
                {report.risk_score}
              </p>
            </div>

          </div>

          {/* Symptoms */}
          <div className="mb-10">

            <h2 className="text-2xl font-bold mb-4">
              🩺 Selected Symptoms
            </h2>

            <div className="flex flex-wrap gap-3">

              {report.symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full"
                >
                  {symptom}
                </span>
              ))}

            </div>

          </div>

          {/* Diseases */}
          <div className="mb-10">

            <h2 className="text-2xl font-bold mb-4">
              🧠 Predicted Diseases
            </h2>

            <div className="space-y-4">

              {report.predicted_diseases.map((disease) => (

                <div
                  key={disease.disease}
                  className="border rounded-2xl p-5 hover:shadow-md transition"
                >

                  <div className="flex justify-between items-center">

                    <h3 className="text-lg font-semibold">
                      {disease.disease}
                    </h3>

                    <span className="font-bold text-blue-600">
                      {(disease.probability * 100).toFixed(2)}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mt-4">

                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${(disease.probability * 100).toFixed(2)}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Recommendations */}
          <div className="mb-10">

            <h2 className="text-2xl font-bold mb-4">
              💡 AI Recommendations
            </h2>

            <div className="bg-green-50 rounded-2xl p-6">

              <ul className="space-y-3">

                {report.recommendations.map((item, index) => (

                  <li
                    key={index}
                    className="flex gap-3"
                  >
                    <span>✅</span>

                    <span>{item}</span>

                  </li>

                ))}

              </ul>

            </div>

          </div>

          <button
            onClick={() => navigate("/reports")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
          >
            ← Back to Reports
          </button>

        </div>

      </div>
    </Layout>
  );
}

export default PredictionDetails;