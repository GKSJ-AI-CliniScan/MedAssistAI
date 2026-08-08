import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * Animated circular progress ring with a label in the center.
 */
export default function RingProgress({
  value = 0,
  size = 120,
  stroke = 10,
  tone = '#2563eb',
  track = '#e2e8f0',
  label,
  sublabel,
  className,
  labelClassName,
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-2xl font-bold text-ink-900', labelClassName)}>{label ?? `${Math.round(value)}%`}</span>
        {sublabel && <span className={cn('text-xs text-ink-400', labelClassName)}>{sublabel}</span>}
      </div>
    </div>
  );
}
