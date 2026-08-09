import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/**
 * StatCard — small KPI card with icon, value, label, trend.
 */
export default function StatCard({ icon: Icon, label, value, sub, tone = 'brand', index = 0, loading }) {
  const tones = {
    brand: 'from-brand-500 to-brand-600 text-brand-600 bg-brand-50',
    emerald: 'from-emerald2-500 to-emerald2-600 text-emerald2-600 bg-emerald2-50',
    amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50',
    rose: 'from-rose-500 to-rose-600 text-rose-600 bg-rose-50',
  };
  const t = tones[tone] || tones.brand;
  const [iconTone, iconBg] = t.split(' ').slice(-2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft card-hover"
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', iconBg)}>
          {Icon && <Icon className={cn('h-5 w-5', iconTone)} />}
        </div>
        {sub && (
          <span className="text-xs font-medium text-ink-400">{sub}</span>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-ink-900">
        {loading ? <span className="skeleton inline-block h-7 w-16" /> : value}
      </p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </motion.div>
  );
}
