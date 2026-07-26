import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";

function Prediction() {
  const location = useLocation();

  const result = location.state?.result;
  console.log("Prediction State:", location.state);
  console.log("Prediction Result:", result);

  if (!result) {
    return (
      <Layout>
        <div className="bg-white rounded-3xl shadow-xl p-10">
          <h1 className="text-3xl font-bold">No Prediction Found</h1>
          <p className="mt-4 text-gray-500">
            Please go back and analyze your symptoms first.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          AI Disease Prediction
        </h1>

        {/* Patient Details */}

<div className="grid md:grid-cols-4 gap-4 mb-8">

  <div className="bg-blue-50 rounded-2xl p-5">
    <h3 className="text-gray-500 font-semibold mb-2">
      Age
    </h3>

    <p className="text-2xl font-bold text-slate-800">
      {result.age} years
    </p>
  </div>

  <div className="bg-purple-50 rounded-2xl p-5">
    <h3 className="text-gray-500 font-semibold mb-2">
      Gender
    </h3>

    <p className="text-2xl font-bold text-slate-800">
      {result.gender}
    </p>
  </div>

  <div className="bg-green-50 rounded-2xl p-5">
    <h3 className="text-gray-500 font-semibold mb-2">
      Height
    </h3>

    <p className="text-2xl font-bold text-slate-800">
      {result.height} cm
    </p>
  </div>

  <div className="bg-yellow-50 rounded-2xl p-5">
    <h3 className="text-gray-500 font-semibold mb-2">
      Weight
    </h3>

    <p className="text-2xl font-bold text-slate-800">
      {result.weight} kg
    </p>
  </div>

</div>

        {/* Symptoms */}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Selected Symptoms
          </h2>

          <ul className="list-disc ml-6">
            {result.symptoms.map((symptom) => (
              <li key={symptom}>{symptom}</li>
            ))}
          </ul>
        </div>

        <hr className="my-8" />

        {/* Diseases */}

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Predicted Diseases
          </h2>

          <div className="space-y-4">
            {result.predicted_diseases.map((item, index) => (
              <div
                key={index}
                className="border rounded-xl p-4"
              >
                <h3 className="text-xl font-bold text-blue-600">
                  {item.disease}
                </h3>

                <p>
                  Probability:
                  <span className="font-semibold ml-2">
                    {(item.probability * 100).toFixed(2)}%
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-8" />

        {/* Risk */}

        <div className="grid md:grid-cols-2 gap-6">

          <div className="border rounded-xl p-5">
            <h3 className="text-xl font-bold">
              Risk Level
            </h3>

            <p className="text-red-600 text-2xl">
              {result.risk_level || "N/A"}
            </p>
          </div>

          <div className="border rounded-xl p-5">
            <h3 className="text-xl font-bold">
              Risk Score
            </h3>

            <p className="text-green-600 text-2xl">
              {result.risk_score || "N/A"}
            </p>
          </div>

        </div>

        <hr className="my-8" />

        {/* Recommendations */}

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            AI Recommendations
          </h2>

          <ul className="list-disc ml-6 space-y-2">
            {result.recommendations.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Layout>
  );
}

export default Prediction;