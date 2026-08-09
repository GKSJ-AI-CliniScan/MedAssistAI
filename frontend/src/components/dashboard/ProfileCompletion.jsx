import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import RingProgress from '../ui/RingProgress';

/**
 * ProfileCompletion — circular progress + checklist of missing items.
 * Props: value (0-100), items: [{ label, done }], loading (bool).
 * No fallback data — shows an empty state when no items are provided.
 */
export default function ProfileCompletion({ value = 0, items = [], loading }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <h3 className="mb-1 text-base font-semibold text-ink-900">Profile Completion</h3>
      <p className="mb-4 text-xs text-ink-400">Complete your profile for better AI insights</p>

      <div className="flex items-center gap-5">
        <RingProgress
          value={value}
          size={104}
          stroke={9}
          tone="#10b981"
          label={loading ? '…' : `${value}%`}
          sublabel="complete"
        />
        <div className="flex-1 space-y-2">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-5 w-3/4 rounded-md" />
            ))
          ) : items.length === 0 ? (
            <p className="text-sm text-ink-400">
              {value >= 100
                ? 'Your profile is complete!'
                : 'Completion details will appear here once available.'}
            </p>
          ) : (
            items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 text-sm"
              >
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald2-500" />
                ) : (
                  <Circle className="h-4 w-4 text-ink-300" />
                )}
                <span className={item.done ? 'text-ink-400 line-through' : 'text-ink-700'}>
                  {item.label}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
