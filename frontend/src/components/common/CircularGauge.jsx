import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated SVG circular progress gauge.
 * Props: value (0-100), size, strokeWidth, color, label, sublabel
 */
const CircularGauge = ({ value = 86, size = 120, strokeWidth = 10, color = '#06b6d4', label, sublabel, animate = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Track */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={center} cy={center} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : { strokeDashoffset: dashOffset }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-black text-white leading-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {value}%
          </motion.span>
          {sublabel && (
            <span className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{sublabel}</span>
          )}
        </div>
      </div>
      {label && (
        <p className="text-xs font-bold text-slate-300 text-center leading-tight">{label}</p>
      )}
    </div>
  );
};

export default CircularGauge;
