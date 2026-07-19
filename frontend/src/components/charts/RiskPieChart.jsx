import { Pie } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function RiskPieChart() {

  const data = {
    labels: ["Low", "Medium", "High"],

    datasets: [
      {
        data: [12, 7, 4],

        backgroundColor: [
          "#22c55e",
          "#facc15",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Risk Level Distribution
      </h2>

      <div className="w-72 mx-auto">
  <Pie
    data={data}
    options={{
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    }}
  />
</div>

    </div>
  );
}

export default RiskPieChart;