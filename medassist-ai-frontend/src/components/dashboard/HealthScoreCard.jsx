import { HeartPulse, TrendingUp, ArrowUpRight } from "lucide-react";
import RingProgress from "../ui/RingProgress";
import Badge from "../ui/Badge";

export default function HealthScoreCard({
  score = 0,
  trend = 0,
  loading,
}) {

  const status =
    score >= 90
      ? "Excellent"
      : score >= 75
      ? "Good"
      : score >= 50
      ? "Average"
      : "Needs Attention";

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-brand p-6 text-white shadow-soft">

      <div className="flex items-center justify-between">

        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5" />
            <span className="text-sm font-medium">
              Health Score
            </span>
          </div>

          <p className="text-xs text-white/70">
            AI Powered Analysis
          </p>
        </div>

        <Badge
          tone="neutral"
          className="border-0 bg-white/15 text-white"
        >
          <TrendingUp className="h-3 w-3" />

          {trend >= 0 ? `+${trend}` : trend}%
        </Badge>

      </div>

      <div className="mt-6 flex items-center gap-6">

        <RingProgress
          value={score}
          size={130}
          stroke={12}
          tone="#ffffff"
          track="rgba(255,255,255,.15)"
          label={loading ? "..." : `${score}`}
          sublabel="/100"
          labelClassName="text-white"
        />

        <div>

          <h2 className="text-3xl font-bold">
            {loading ? "Loading..." : status}
          </h2>

          <p className="mt-2 text-sm text-white/80">

            {loading
              ? "Calculating..."
              : score >= 75
              ? "Your health looks good. Keep maintaining a healthy lifestyle."
              : score >= 50
              ? "Your health is stable. Follow the recommendations to improve."
              : "High health risk detected. Please consult a medical professional."}

          </p>

          <div className="mt-4 flex items-center gap-2 font-medium">
            View Insights
            <ArrowUpRight size={18} />
          </div>

        </div>

      </div>

    </div>
  );
}