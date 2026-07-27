import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Brain, ShieldAlert, Heart, FileText, LineChart } from 'lucide-react';

const actions = [
  {
    icon: Stethoscope,
    label: 'Analyze Symptoms',
    description: 'Log and check new symptoms',
    path: '/symptoms',
    gradient: 'from-cyan-500/20 to-cyan-600/5',
    border: 'border-cyan-500/25',
    iconColor: 'text-cyan-400',
    glow: 'shadow-cyan-500/15',
  },
  {
    icon: Brain,
    label: 'View Predictions',
    description: 'See disease match results',
    path: '/prediction',
    gradient: 'from-indigo-500/20 to-indigo-600/5',
    border: 'border-indigo-500/25',
    iconColor: 'text-indigo-400',
    glow: 'shadow-indigo-500/15',
  },
  {
    icon: ShieldAlert,
    label: 'Risk Assessment',
    description: 'Check your health risk level',
    path: '/risk',
    gradient: 'from-amber-500/20 to-amber-600/5',
    border: 'border-amber-500/25',
    iconColor: 'text-amber-400',
    glow: 'shadow-amber-500/15',
  },
  {
    icon: Heart,
    label: 'Recommendations',
    description: 'Diet, exercise & lifestyle tips',
    path: '/recommendations',
    gradient: 'from-rose-500/20 to-rose-600/5',
    border: 'border-rose-500/25',
    iconColor: 'text-rose-400',
    glow: 'shadow-rose-500/15',
  },
  {
    icon: FileText,
    label: 'Health Reports',
    description: 'Generate & download reports',
    path: '/reports',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-500/25',
    iconColor: 'text-emerald-400',
    glow: 'shadow-emerald-500/15',
  },
  {
    icon: LineChart,
    label: 'Analytics',
    description: 'Trends, charts & statistics',
    path: '/analytics',
    gradient: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/25',
    iconColor: 'text-purple-400',
    glow: 'shadow-purple-500/15',
  },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-200 tracking-wide">Quick Actions</h3>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Portal Shortcuts</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {actions.map(({ icon: Icon, label, description, path, gradient, border, iconColor, glow }, i) => (
          <motion.button
            key={label}
            onClick={() => navigate(path)}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.35 }}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`
              relative flex flex-col items-start gap-2.5 p-4 rounded-2xl
              bg-gradient-to-br ${gradient} border ${border}
              shadow-md ${glow} text-left group
              transition-all duration-200 focus:outline-none overflow-hidden
            `}
          >
            {/* Hover shimmer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/2 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

            <div className={`w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${iconColor}`}>
              <Icon size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 leading-tight">{label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{description}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
