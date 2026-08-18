import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * AIRecommendations — list of AI-generated health recommendations.
 * Props: items: [{ title, body, tone }]
 */
const toneStyles = {
  brand: 'border-brand-200 bg-brand-50/60',
  emerald: 'border-emerald2-200 bg-emerald2-50/60',
  amber: 'border-amber-200 bg-amber-50/60',
  rose: 'border-rose-200 bg-rose-50/60',
};

export default function AIRecommendations({ items = [], loading }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-ink-900">AI Recommendations</h3>
          <p className="text-xs text-ink-400">Personalized for you</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-400">
            No recommendations yet. Complete your profile for personalized insights.
          </p>
        ) : (
          items.slice(0, 4).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border p-3.5 ${toneStyles[item.tone] || toneStyles.brand}`}
            >
              <p className="text-sm font-semibold text-ink-900">{item.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{item.body}</p>
            </motion.div>
          ))
        )}
      </div>

      <Link
        to="/symptom-checker"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-xl border border-ink-200 py-2.5 text-sm font-medium text-ink-600 transition-all hover:bg-ink-50"
      >
        Get new insights <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
