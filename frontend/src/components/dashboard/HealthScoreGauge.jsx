import React from 'react';
import { motion } from 'framer-motion';

/**
 * Animated radial health score gauge (SVG-based circle progress).
 * Renders a glowing circular arc from 0→score.
 */
export const HealthScoreGauge = ({ score = 84, size = 160, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return ['#10b981', '#06b6d4'];   // emerald → cyan (good)
    if (s >= 50) return ['#f59e0b', '#f97316'];    // amber → orange (moderate)
    return ['#f43f5e', '#dc2626'];                 // rose → red (poor)
  };
  const [from, to] = getColor(score);
  const gradId = `hsg-${score}`;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${from}60)` }}
        />
      </svg>

      {/* Center score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold text-white leading-none"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">/ 100</span>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
