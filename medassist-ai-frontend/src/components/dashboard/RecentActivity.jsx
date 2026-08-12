import { motion } from 'framer-motion';
import { timeAgo } from '../../utils/helpers';

/**
 * RecentActivity — timeline of recent user activity.
 * Props: items: [{ id, title, time, tone }]
 */
const dotTones = {
  brand: 'bg-brand-500',
  emerald: 'bg-emerald2-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

export default function RecentActivity({ items = [], loading }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <h3 className="mb-4 text-base font-semibold text-ink-900">Recent Activity</h3>
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-3/4" />
                <div className="skeleton h-2 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-400">No recent activity.</p>
      ) : (
        <div className="relative space-y-5">
          {items.slice(0, 6).map((item, i) => (
            <motion.div
              key={item.id || i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative flex gap-3"
            >
              <div className="relative flex flex-col items-center">
                <span
                  className={`mt-1 h-3 w-3 rounded-full ring-4 ring-white ${dotTones[item.tone] || dotTones.brand}`}
                />
                {i < items.length - 1 && <span className="mt-1 w-px flex-1 bg-ink-100" />}
              </div>
              <div className="pb-1">
                <p className="text-sm font-medium text-ink-800">{item.title}</p>
                <p className="text-xs text-ink-400">{timeAgo(item.time || item.created_at)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
