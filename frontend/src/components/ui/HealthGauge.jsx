import React from 'react';

export default function HealthGauge({ 
  score = 92, 
  title = "Health Index", 
  subtitle = "AI Diagnostic Baseline",
  statusText = "Optimal",
  size = 140,
  strokeWidth = 10,
  className = "" 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-4 bg-white/70 dark:bg-clinical-cardDark/70 border border-slate-200/80 dark:border-clinical-tealDark/20 rounded-xl shadow-sm backdrop-blur-sm ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background Track Circle */}
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-slate-100 dark:text-slate-800/80 stroke-current"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle with Green Gradient */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-clinical-green dark:text-clinical-greenDark stroke-current transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-clinical-textLight dark:text-clinical-textDark">
            {clampedScore}
            <span className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark font-normal">/100</span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-clinical-mint dark:bg-clinical-tealDark/20 text-clinical-green dark:text-clinical-tealDark mt-0.5">
            {statusText}
          </span>
        </div>
      </div>

      <div className="text-center mt-3">
        <h4 className="text-xs font-semibold text-clinical-textLight dark:text-clinical-textDark">{title}</h4>
        <p className="text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
