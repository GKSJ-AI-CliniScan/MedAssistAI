import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

/**
 * ChartContainer — wraps a Chart.js chart in a styled card.
 */
export default function ChartContainer({ title, subtitle, action, height = 260, children }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-ink-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-ink-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div style={{ height }}>
        {children}
      </div>
    </div>
  );
}
