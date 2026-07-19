import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PredictionLineChart() {

  const data = {

    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],

    datasets: [
      {
        label: "Predictions",

        data: [5, 8, 6, 10, 12, 9, 15],

        borderColor: "#2563eb",

        backgroundColor: "#93c5fd",

        tension: 0.4,
      },
    ],
  };

  return (

    <div className="bg-white rounded-3xl shadow-lg p-8 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Prediction History
      </h2>

      <Line data={data} />

    </div>

  );

}

export default PredictionLineChart;