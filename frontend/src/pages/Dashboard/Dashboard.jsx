import { Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import RiskPieChart from "../../components/charts/RiskPieChart";
import PredictionLineChart from "../../components/charts/PredictionLineChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const cards = [
    { title: "Patients", value: "120", icon: "👨‍⚕️" },
    { title: "Predictions", value: "350", icon: "🤖" },
    { title: "Reports", value: "95", icon: "📄" },
    { title: "Accuracy", value: "97%", icon: "📊" },
  ];

  const chartData = {
  labels: [
    "Influenza",
    "COVID-19",
    "Migraine",
    "Typhoid",
    "Pneumonia",
  ],

  datasets: [
    {
      label: "Predicted Cases",
      data: [45, 28, 19, 12, 9],
      backgroundColor: [
        "#2563eb",
        "#0ea5e9",
        "#10b981",
        "#f59e0b",
        "#ef4444",
      ],
    },
  ],
};

const chartOptions = {
  responsive: true,

  plugins: {
    legend: {
      position: "top",
    },

    title: {
      display: true,
      text: "Disease Prediction Analytics",
    },
  },
};

  return (
    <Layout>

      

      {/* Main Content */}

      <div>

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back 👋
            </h1>

            <p className="text-gray-500 mt-2">
              AI Healthcare Dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow px-6 py-3">
            <h3 className="font-semibold">
              SHAIK DAIMEL BASITH
            </h3>

            <p className="text-sm text-gray-500">
              Patient
            </p>
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Statistics Cards */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">

            {cards.map((card) => (

              <div
                key={card.title}
                className="bg-white rounded-3xl shadow-lg p-8"
              >

                <div className="text-5xl mb-4">
                  {card.icon}
                </div>

                <h2 className="text-gray-500">
                  {card.title}
                </h2>

                <h1 className="text-4xl font-bold mt-2">
                  {card.value}
                </h1>

              </div>

            ))}

          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
              Recent Activity
            </h2>

            <ul className="space-y-4">

              <li>✅ Symptom analysis completed</li>

              <li>🤖 Disease prediction generated</li>

              <li>📄 Health report downloaded</li>

              <li>🩺 Patient profile updated</li>

              <li>📊 Risk assessment completed</li>

            </ul>

          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

  <div className="bg-white rounded-3xl shadow-lg p-8">

    <h2 className="text-2xl font-bold mb-6">
      Disease Prediction Analytics
    </h2>

    <Bar
      data={chartData}
      options={chartOptions}
    />

  </div>

  <RiskPieChart />

</div>
<PredictionLineChart />

      </div>
    </Layout>
  );
}

export default Dashboard;