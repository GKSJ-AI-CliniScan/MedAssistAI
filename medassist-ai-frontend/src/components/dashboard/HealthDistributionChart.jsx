import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartContainer from "./ChartContainer";

export default function HealthDistributionChart({
  data = [],
  loading,
}) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    if (!canvasRef.current || loading || data.length === 0) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "doughnut",
      data: {
        labels: [
          "Healthy",
          "High Risk",
          "Critical",
          "Monitoring",
        ],
        datasets: [
          {
            data,
            backgroundColor: [
              "#22c55e",
              "#f59e0b",
              "#ef4444",
              "#3b82f6",
            ],
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, loading]);

  return (
    <ChartContainer
      title="Health Distribution"
      subtitle="Based on your reports"
      height={260}
    >
      {loading ? (
        <div className="skeleton h-full w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          No Data Available
        </div>
      ) : (
        <canvas ref={canvasRef} />
      )}
    </ChartContainer>
  );
}