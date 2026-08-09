import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, FileText, Activity, ArrowRight } from 'lucide-react';

const actions = [
  { to: '/symptom-checker', label: 'Symptom Checker', desc: 'Analyze symptoms', icon: Stethoscope, tone: 'brand' },
  { to: '/reports', label: 'View Reports', desc: 'Past analyses', icon: FileText, tone: 'emerald' },
  { to: '/profile', label: 'Update Profile', desc: 'Medical info', icon: Activity, tone: 'amber' },
];

const tones = {
  brand: 'bg-brand-50 text-brand-600',
  emerald: 'bg-emerald2-50 text-emerald2-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
};

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <motion.div
            key={a.to}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={a.to}
              className="group flex flex-col gap-3 rounded-2xl border border-ink-200/70 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[a.tone]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">{a.label}</p>
                <p className="text-xs text-ink-400">{a.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-500" />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
