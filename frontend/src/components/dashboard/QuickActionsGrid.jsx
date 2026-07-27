import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Brain, ShieldAlert, Heart, FileText, BarChart3, User, History } from 'lucide-react';

const actions = [
  {
    title: 'Analyze Symptoms',
    desc: 'AI-powered symptom checker',
    icon: Stethoscope,
    path: '/symptoms',
    gradient: 'from-cyan-500 to-cyan-700',
    glow: 'rgba(6,182,212,0.35)',
    badge: 'AI Powered',
  },
  {
    title: 'Disease Prediction',
    desc: 'Predict likely conditions',
    icon: Brain,
    path: '/prediction',
    gradient: 'from-indigo-500 to-indigo-700',
    glow: 'rgba(99,102,241,0.35)',
    badge: 'ML Model',
  },
  {
    title: 'Risk Assessment',
    desc: 'Evaluate patient risk score',
    icon: ShieldAlert,
    path: '/risk',
    gradient: 'from-rose-500 to-rose-700',
    glow: 'rgba(244,63,94,0.35)',
    badge: 'Risk Engine',
  },
  {
    title: 'Treatment Advice',
    desc: 'Evidence-based recommendations',
    icon: Heart,
    path: '/recommendations',
    gradient: 'from-emerald-500 to-emerald-700',
    glow: 'rgba(16,185,129,0.35)',
    badge: 'Smart Rx',
  },
  {
    title: 'Health Reports',
    desc: 'Generate & export PDF reports',
    icon: FileText,
    path: '/reports',
    gradient: 'from-amber-500 to-amber-700',
    glow: 'rgba(245,158,11,0.35)',
    badge: 'PDF Ready',
  },
  {
    title: 'Analytics',
    desc: 'Charts & trends dashboard',
    icon: BarChart3,
    path: '/analytics',
    gradient: 'from-purple-500 to-purple-700',
    glow: 'rgba(168,85,247,0.35)',
    badge: 'Insights',
  },
  {
    title: 'Patient Records',
    desc: 'Browse all patient data',
    icon: User,
    path: '/profile',
    gradient: 'from-sky-500 to-sky-700',
    glow: 'rgba(14,165,233,0.35)',
    badge: 'Records',
  },
  {
    title: 'Medical History',
    desc: 'Full treatment timeline',
    icon: History,
    path: '/medical-history',
    gradient: 'from-teal-500 to-teal-700',
    glow: 'rgba(20,184,166,0.35)',
    badge: 'History',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const QuickActionsGrid = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Quick Access</h2>
          <p className="text-xs text-slate-400 mt-0.5">Jump directly to any module</p>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
      >
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.title}
              variants={item}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(action.path)}
              className="relative group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/8 hover:border-white/20 transition-all duration-300 text-center focus:outline-none overflow-hidden"
              style={{ '--glow': action.glow }}
            >
              {/* Glow bg on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{ background: `radial-gradient(circle at center, ${action.glow} 0%, transparent 70%)` }}
              />

              {/* Icon circle */}
              <div className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} className="text-white" />
              </div>

              <div className="relative z-10">
                <p className="text-[11px] font-bold text-white leading-tight">{action.title}</p>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-tight hidden sm:block">{action.desc}</p>
              </div>

              {/* Badge */}
              <span className={`relative z-10 text-[8px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${action.gradient} text-white opacity-80`}>
                {action.badge}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
};

export default QuickActionsGrid;
