import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";

function Prediction() {
  const location = useLocation();

  const symptoms = location.state?.symptoms || [];

  const prediction = location.state?.prediction || {
    disease: "Influenza",
    confidence: "92%",
    severity: "Medium",
    recommendation: [
      "Drink plenty of water",
      "Take proper rest",
      "Consult a physician if symptoms continue",
    ],
  };

  return (
    <Layout>
      <div className="max-w-4xl bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-4xl font-bold mb-8">
          AI Disease Prediction
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Selected Symptoms
          </h2>

          <ul className="list-disc ml-6">
            {symptoms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <hr className="my-8" />

        <div className="space-y-5">

          <div>
            <h3 className="font-bold text-xl">
              Possible Disease
            </h3>

            <p className="text-blue-600 text-2xl">
              {prediction.disease}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              Confidence
            </h3>

            <p className="text-green-600">
              {prediction.confidence}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl">
              Severity
            </h3>

            <p className="text-orange-500">
              {prediction.severity}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-xl mb-3">
              Recommendation
            </h3>

            <ul className="list-disc ml-6">
              {prediction.recommendation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Prediction;