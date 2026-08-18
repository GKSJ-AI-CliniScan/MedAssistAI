import { useEffect, useRef } from 'react';
import Chart from "chart.js/auto";
import ChartContainer from './ChartContainer';

/**
 * DiseaseAnalyticsChart — line chart showing disease risk over time.
 * Props: labels (string[]), data (number[]), loading (bool).
 * No fallback data — renders an empty state when no data is provided.
 */
export default function DiseaseAnalyticsChart({ labels = [], data = [], loading }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || loading || labels.length === 0) return;
    const ctx = canvasRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.25)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Risk Score',
            data,
            borderColor: '#2563eb',
            backgroundColor: gradient,
            fill: true,
            tension: 0.4,
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#2563eb',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 12,
            cornerRadius: 10,
            titleFont: { weight: 600 },
            displayColors: false,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            max: 100,
            grid: { color: 'rgba(15,23,42,0.06)' },
            ticks: { color: '#94a3b8', font: { size: 11 }, stepSize: 25 },
            border: { display: false },
          },
        },
        interaction: { intersect: false, mode: 'index' },
      },
    });

    return () => chartRef.current?.destroy();
  }, [labels, data, loading]);

  return (
    <ChartContainer
      title="Disease Analytics"
      subtitle="Risk score trend over the last 7 months"
      height={260}
    >
      {loading ? (
        <div className="skeleton h-full w-full rounded-xl" />
      ) : labels.length === 0 ? (
        <EmptyChart />
      ) : (
        <canvas ref={canvasRef} />
      )}
    </ChartContainer>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-2 h-12 w-12 rounded-full bg-ink-100" />
      <p className="text-sm font-medium text-ink-400">No analytics data yet</p>
      <p className="text-xs text-ink-300">Analytics will appear after your first assessment</p>
    </div>
  );
}
