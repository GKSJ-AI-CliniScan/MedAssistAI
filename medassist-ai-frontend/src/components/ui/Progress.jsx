import { motion } from 'framer-motion';

/**
 * Progress — animated progress bar.
 * @param {number} value 0..100
 * @param {string} tone brand | success | warning | error
 */
export default function Progress({ value = 0, tone = 'brand', className }) {
  const tones = {
    brand: 'bg-brand-600',
    success: 'bg-emerald2-600',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-ink-100 ${className || ''}`}>
      <motion.div
        className={`h-full rounded-full ${tones[tone] || tones.brand}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
