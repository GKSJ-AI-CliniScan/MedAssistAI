import { Link } from 'react-router-dom';
import { FileText, Download, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import { formatDate, riskTone } from '../../utils/helpers';

/**
 * RecentReports — compact list of recent reports.
 * Props: reports: [{ id, title, date, risk_level, status }]
 */
export default function RecentReports({ reports = [], loading }) {
  return (
    <div className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink-900">Recent Reports</h3>
        <Link
          to="/reports"
          className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="py-8 text-center">
          <FileText className="mx-auto h-8 w-8 text-ink-300" />
          <p className="mt-2 text-sm text-ink-400">No reports yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {reports.slice(0, 4).map((r, i) => (
            <motion.div
              key={r.id || i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex items-center gap-3 rounded-xl border border-ink-100 p-3 transition-all hover:border-ink-200 hover:bg-ink-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">
                  {r.title || r.disease || 'Analysis Report'}
                </p>
                <p className="text-xs text-ink-400">{formatDate(r.date || r.created_at)}</p>
              </div>
              {r.risk_level && (
                <Badge tone={riskTone(r.risk_level)}>{r.risk_level}</Badge>
              )}
              <button
                className="rounded-lg p-1.5 text-ink-400 opacity-0 transition-all hover:bg-ink-100 hover:text-ink-700 group-hover:opacity-100"
                aria-label="Download"
              >
                <Download className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
