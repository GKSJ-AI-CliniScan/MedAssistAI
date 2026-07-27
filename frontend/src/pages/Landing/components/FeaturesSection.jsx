import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Stethoscope, Brain, ShieldAlert, Heart,
  FileText, LineChart, Bell, User, History
} from 'lucide-react';

const features = [
  {
    icon: Stethoscope,
    color: 'cyan',
    title: 'Smart Symptom Analysis',
    description:
      'Select from 200+ medical symptoms and let our AI map correlations across clinical datasets, delivering instant pattern recognition for a broad range of conditions.',
  },
  {
    icon: Brain,
    color: 'indigo',
    title: 'AI Disease Prediction',
    description:
      'Our models evaluate your symptom clusters against known disease signatures, providing ranked predictions with confidence scores and supporting evidence.',
  },
  {
    icon: ShieldAlert,
    color: 'rose',
    title: 'Personalised Risk Assessment',
    description:
      'Beyond predictions, receive a multi-dimensional risk profile assessing cardiovascular, metabolic, and respiratory risk levels tailored to your health history.',
  },
  {
    icon: Heart,
    color: 'emerald',
    title: 'Treatment Recommendations',
    description:
      'Based on your assessment, get curated lifestyle adjustments, OTC care guidance, specialist referral advice, and watch-out warning signs.',
  },
  {
    icon: FileText,
    color: 'amber',
    title: 'Comprehensive Health Reports',
    description:
      'Generate PDF summaries of your sessions — complete with risk charts, predictions, and recommendations — ready to share with your physician.',
  },
  {
    icon: LineChart,
    color: 'purple',
    title: 'Health Analytics Dashboard',
    description:
      'Track symptom trends over time, monitor how your risk scores evolve, and spot patterns in your health data through interactive Recharts visualisations.',
  },
  {
    icon: History,
    color: 'teal',
    title: 'Medical History Tracking',
    description:
      'Maintain a structured health journal: log conditions, allergies, medications, surgeries, and family history to enrich future analysis sessions.',
  },
  {
    icon: Bell,
    color: 'orange',
    title: 'Smart Health Alerts',
    description:
      'Receive timely health reminders, medication prompts, and flagged risk escalations via an intelligent notification system built into the platform.',
  },
  {
    icon: User,
    color: 'pink',
    title: 'Secure Patient Profile',
    description:
      'Your personal health data is stored securely with client-side encryption, giving you full ownership of your medical information at all times.',
  },
];

const colorMap = {
  cyan: {
    icon: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    bar: 'bg-gradient-to-r from-cyan-500 to-cyan-400',
  },
  indigo: {
    icon: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
    bar: 'bg-gradient-to-r from-indigo-500 to-indigo-400',
  },
  rose: {
    icon: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    bar: 'bg-gradient-to-r from-rose-500 to-rose-400',
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    bar: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-400',
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    bar: 'bg-gradient-to-r from-purple-500 to-purple-400',
  },
  teal: {
    icon: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]',
    bar: 'bg-gradient-to-r from-teal-500 to-teal-400',
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    bar: 'bg-gradient-to-r from-orange-500 to-orange-400',
  },
  pink: {
    icon: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    glow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]',
    bar: 'bg-gradient-to-r from-pink-500 to-pink-400',
  },
};

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const c = colorMap[feature.color];
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12, ease: 'easeOut' }}
      className={`
        relative glass-card rounded-2xl p-6 border border-white/8 group overflow-hidden
        transition-all duration-300 ${c.glow}
        hover:-translate-y-1 cursor-default
      `}
    >
      {/* Top colour bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${c.bar} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
        <Icon size={22} className={c.icon} />
      </div>

      <h3 className="font-bold text-slate-100 text-sm mb-2 leading-snug">{feature.title}</h3>
      <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
    </motion.div>
  );
};

const SectionLabel = ({ children }) => (
  <p className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-3">{children}</p>
);

const FeaturesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Bg accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel>Platform Capabilities</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-4 leading-tight">
              Everything you need to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
                understand your health
              </span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              Nine deeply integrated modules work together to provide a holistic view of
              your health, powered by AI models and clinical knowledge bases.
            </p>
          </motion.div>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
