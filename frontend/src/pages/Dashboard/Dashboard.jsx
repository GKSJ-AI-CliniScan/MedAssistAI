import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

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
  const [profile, setProfile] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const [profileResponse, reportsResponse] = await Promise.all([
      api.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      api.get("/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    setProfile(profileResponse.data);
    setReports(reportsResponse.data);
  } catch (error) {
    toast.error("Unable to load dashboard.");
  } finally {
    setLoading(false);
  }
};

  const cards = [
    {
      title: "Reports",
      value: reports.length,
      icon: "📄",
    },
    {
      title: "High Risk",
      value: reports.filter(
        (r) => r.risk_level === "high"
      ).length,
      icon: "⚠️",
    },
    {
      title: "Latest Prediction",
      value:
        reports[0]?.predicted_diseases?.[0]?.disease ||
        "N/A",
      icon: "🩺",
    },
    {
      title: "Profile",
      value:
        profile.first_name
          ? "Complete"
          : "Incomplete",
      icon: "👤",
    },
  ];


  const diseaseCounts = {};

  reports.forEach((report) => {
    const disease =
      report.predicted_diseases?.[0]?.disease;

    if (disease) {
      diseaseCounts[disease] =
        (diseaseCounts[disease] || 0) + 1;
    }
  });

  const chartData = {
    labels: Object.keys(diseaseCounts),

    datasets: [
      {
        label: "Predicted Diseases",

        data: Object.values(diseaseCounts),

        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#0ea5e9",
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

  if (loading) {
  return (
    <Layout>
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Loading Dashboard...
          </p>
        </div>
      </div>
    </Layout>
  );
}

  return (
    <Layout>



      {/* Main Content */}

      <div>

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back, {profile.first_name || "Patient"} 👋
            </h1>

            <p className="text-gray-500 mt-2">
              AI Healthcare Dashboard
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow px-6 py-3">
            <h3 className="font-semibold">
              {profile.first_name} {profile.last_name}
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
              {reports.length > 0 ? (
                reports.slice(0, 5).map((report) => (
                  <li
                    key={report.id}
                    className="border-b pb-3"
                  >
                    <p className="font-semibold">
                      🩺 {report.predicted_diseases?.[0]?.disease || "Unknown"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleString()}
                    </p>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">
                  No recent activity.
                </p>
              )}
            </ul>

          </div>

        </div>

        {/* Disease Prediction Chart */}

        <div className="mt-10 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Disease Prediction Analytics
          </h2>

          {reports.length > 0 ? (
            <Bar
              data={chartData}
              options={chartOptions}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-3">📊</div>
              <p>No prediction data available yet.</p>
              <p className="text-sm mt-2">
                Analyze symptoms to generate reports.
              </p>
            </div>
          )}

        </div>

        <div className="mt-10 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <button
              onClick={() => navigate("/symptom-checker")}
              className="bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-md"
            >
              🩺 Check Symptoms
            </button>

            <button
              onClick={() => navigate("/reports")}
              className="bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all duration-200 hover:scale-105 shadow-md"
            >
              📄 View Reports
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition-all duration-200 hover:scale-105 shadow-md"
            >
              👤 Edit Profile
            </button>

          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;