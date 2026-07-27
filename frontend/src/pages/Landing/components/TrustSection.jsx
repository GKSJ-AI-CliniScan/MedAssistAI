import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, Lock, AlertTriangle, Eye } from 'lucide-react';

const pillars = [
  {
    icon: ShieldCheck,
    color: 'emerald',
    title: 'HIPAA-Inspired Principles',
    desc: 'We apply HIPAA-inspired data-handling principles to ensure your health information is treated with the highest degree of care and confidentiality.',
  },
  {
    icon: Lock,
    color: 'cyan',
    title: 'AES-256 Encryption',
    desc: 'All sensitive medical data is encrypted client-side using industry-standard AES-256 before any storage, ensuring zero-knowledge protection.',
  },
  {
    icon: Eye,
    color: 'indigo',
    title: 'Full Data Ownership',
    desc: 'You own your data entirely. Export, delete, or transfer your health records at any time — no data lock-in, no hidden retention.',
  },
  {
    icon: AlertTriangle,
    color: 'amber',
    title: 'Transparent Risk Communication',
    desc: 'Our predictions always include confidence caveats and professional consultation recommendations. We never overstate clinical certainty.',
  },
];

const colorMap = {
  emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  cyan: { icon: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  indigo: { icon: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  amber: { icon: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
};

const TrustSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">Privacy & Safety</p>
            <h2 className="text-4xl font-extrabold text-slate-100 mb-4 leading-tight">
              Built on a foundation of{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-rose-400">trust</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
              Your health data is deeply personal. We've designed every layer of MedAssist AI with
              privacy, security, and transparency as first-class citizens.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const c = colorMap[pillar.color];
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/8 flex gap-4 group hover:border-white/15 transition-all duration-300"
              >
                <div className={`w-11 h-11 shrink-0 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
                  <Icon size={20} className={c.icon} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm mb-1.5">{pillar.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Medical disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 rounded-2xl bg-rose-500/5 border border-rose-500/15 p-5 flex gap-4 items-start"
        >
          <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-rose-300 font-semibold text-xs mb-1">Medical Disclaimer</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              MedAssist AI is an informational and educational tool. It does{' '}
              <strong className="text-slate-300">not</strong> provide official medical diagnoses, treatment
              plans, or professional medical advice. Always consult a qualified healthcare professional
              for any medical concern. In emergencies, call your local emergency services immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
