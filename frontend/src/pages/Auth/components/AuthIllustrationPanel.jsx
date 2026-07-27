import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HeartPulse, Brain, Activity, Microscope,
  Stethoscope, Cross, ShieldCheck
} from 'lucide-react';

/* ── Floating medical icon ──────────────────────────────── */
const FloatingMedIcon = ({ icon: Icon, style, color = 'text-cyan-400', delay = 0 }) => (
  <motion.div
    className={`absolute ${color} opacity-20 pointer-events-none`}
    style={style}
    animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  >
    <Icon size={28} />
  </motion.div>
);

/* ── Animated heartbeat line ────────────────────────────── */
const HeartbeatLine = ({ gradientId = 'hbGrad' }) => (
  <svg viewBox="0 0 200 40" className="w-full max-w-xs opacity-30" fill="none">
    <motion.polyline
      points="0,20 30,20 45,5 60,35 75,5 90,35 105,20 200,20"
      stroke={`url(#${gradientId})`}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
  </svg>
);

/**
 * Shared left-panel illustration for all Auth pages.
 * Pass `variant` to switch the center card and accent colour.
 *   - 'login'    → AI Analysis card, indigo accent
 *   - 'register' → Join users card, emerald accent
 *   - 'forgot'   → Security lock card, amber accent
 *   - 'reset'    → Shield card, cyan accent
 */
const AuthIllustrationPanel = ({ variant = 'login' }) => {
  const variantConfig = {
    login: {
      glowColor: 'rgba(99,102,241,0.12)',
      cardAccent: 'from-cyan-500/20 to-indigo-600/20',
      cardBorder: 'border-cyan-500/30',
      cardGlowBorder: 'border-cyan-500/20',
      cardIcon: Brain,
      cardIconColor: 'text-cyan-400',
      cardIconBg: 'bg-cyan-500/15 border-cyan-500/25',
      cardTitle: 'AI Analysis',
      cardSubtitle: 'Real-time symptom mapping with clinical-grade precision',
      cardTags: ['COVID-19', 'Flu', 'Hypertension'],
      tagColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      stats: [
        { label: 'Assessments', value: '340K+', color: 'text-cyan-400' },
        { label: 'Accuracy', value: '98.2%', color: 'text-indigo-400' },
        { label: 'Diseases', value: '1,200+', color: 'text-emerald-400' },
      ],
      footerLabel: 'Trusted By',
      footerItems: ['Harvard Medical', 'Johns Hopkins', 'Mayo Clinic', 'WHO'],
    },
    register: {
      glowColor: 'rgba(16,185,129,0.10)',
      cardAccent: 'from-emerald-500/15 to-cyan-600/15',
      cardBorder: 'border-emerald-500/25',
      cardGlowBorder: 'border-emerald-500/15',
      cardIcon: ShieldCheck,
      cardIconColor: 'text-emerald-400',
      cardIconBg: 'bg-emerald-500/15 border-emerald-500/25',
      cardTitle: 'Join 340K+ Users',
      cardSubtitle: 'Active clinical accounts across 120+ countries worldwide',
      cardTags: [],
      tagColor: '',
      stats: [
        { label: 'Countries', value: '120+', color: 'text-cyan-400' },
        { label: 'Hospitals', value: '2,400+', color: 'text-emerald-400' },
        { label: 'Uptime', value: '99.9%', color: 'text-indigo-400' },
      ],
      footerLabel: 'Compliant With',
      footerItems: ['HIPAA', 'HL7 FHIR', 'ISO 27001', 'SOC 2 Type II'],
    },
    forgot: {
      glowColor: 'rgba(245,158,11,0.10)',
      cardAccent: 'from-amber-500/15 to-cyan-600/15',
      cardBorder: 'border-amber-500/25',
      cardGlowBorder: 'border-amber-500/15',
      cardIcon: ShieldCheck,
      cardIconColor: 'text-amber-400',
      cardIconBg: 'bg-amber-500/15 border-amber-500/25',
      cardTitle: 'Secure Recovery',
      cardSubtitle: 'Military-grade encrypted reset links valid for 30 minutes',
      cardTags: ['AES-256', 'HIPAA', 'Zero-Knowledge'],
      tagColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      stats: [
        { label: 'Encrypted', value: '100%', color: 'text-amber-400' },
        { label: 'Reset Time', value: '<30s', color: 'text-cyan-400' },
        { label: 'Audit Trail', value: 'Full', color: 'text-emerald-400' },
      ],
      footerLabel: 'Security Standards',
      footerItems: ['HIPAA', 'ISO 27001', 'SOC 2', 'GDPR'],
    },
    reset: {
      glowColor: 'rgba(6,182,212,0.10)',
      cardAccent: 'from-cyan-500/20 to-indigo-600/20',
      cardBorder: 'border-cyan-500/30',
      cardGlowBorder: 'border-cyan-500/15',
      cardIcon: Activity,
      cardIconColor: 'text-cyan-400',
      cardIconBg: 'bg-cyan-500/15 border-cyan-500/25',
      cardTitle: 'Secure Reset',
      cardSubtitle: 'Your new password will be hashed and secured immediately',
      cardTags: ['Bcrypt Hash', 'Session Clear', 'Audit Log'],
      tagColor: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      stats: [
        { label: 'Hashed', value: 'bcrypt', color: 'text-cyan-400' },
        { label: 'Sessions', value: 'Cleared', color: 'text-rose-400' },
        { label: 'Logged', value: 'Always', color: 'text-emerald-400' },
      ],
      footerLabel: 'Security Standards',
      footerItems: ['HIPAA', 'ISO 27001', 'FIDO2', 'GDPR'],
    },
  };

  const cfg = variantConfig[variant];
  const CardIcon = cfg.cardIcon;

  return (
    <div className="hidden lg:flex w-1/2 flex-col justify-between p-14 relative overflow-hidden bg-gradient-to-br from-[#060913] via-[#0a1628] to-[#060913]">
      {/* Animated radial glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${cfg.glowColor} 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating medical icons */}
      <FloatingMedIcon icon={HeartPulse} style={{ top: '12%', left: '10%' }} color="text-rose-400" delay={0} />
      <FloatingMedIcon icon={Brain}      style={{ top: '18%', right: '15%' }} color="text-indigo-400" delay={1} />
      <FloatingMedIcon icon={Activity}   style={{ bottom: '30%', left: '8%' }} color="text-cyan-400" delay={2} />
      <FloatingMedIcon icon={Microscope} style={{ bottom: '18%', right: '12%' }} color="text-emerald-400" delay={1.5} />
      <FloatingMedIcon icon={Stethoscope} style={{ top: '42%', right: '8%' }} color="text-amber-400" delay={0.5} />
      <FloatingMedIcon icon={Cross}      style={{ top: '55%', left: '5%' }} color="text-rose-400" delay={2.5} />
      <FloatingMedIcon icon={ShieldCheck} style={{ top: '70%', left: '30%' }} color="text-cyan-400" delay={3} />

      {/* Brand */}
      <Link to="/" className="relative z-10 flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-sm shadow-lg shadow-cyan-500/30">
          MA
        </div>
        <div>
          <div className="font-extrabold text-base tracking-widest text-white uppercase">MedAssist AI</div>
          <div className="text-xs text-slate-400 tracking-wider">Clinical Diagnostic Suite</div>
        </div>
      </Link>

      {/* Center card */}
      <div className="relative z-10 flex flex-col items-center gap-6 py-8">
        <motion.div
          className={`relative glass-card border ${cfg.cardBorder} rounded-3xl p-8 w-72 text-center shadow-glass-lg`}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${cfg.cardAccent} border ${cfg.cardBorder} flex items-center justify-center mx-auto mb-4`}>
            <CardIcon size={30} className={cfg.cardIconColor} />
          </div>
          <div className="text-2xl font-extrabold text-white mb-1">{cfg.cardTitle}</div>
          <div className="text-xs text-slate-400 leading-relaxed mb-4">{cfg.cardSubtitle}</div>

          {cfg.cardTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {cfg.cardTags.map((tag) => (
                <span key={tag} className={`px-2 py-0.5 text-[9px] font-semibold rounded-full border ${cfg.tagColor}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Pulsing border shimmer */}
          <motion.div
            className={`absolute inset-0 rounded-3xl border ${cfg.cardGlowBorder} pointer-events-none`}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        <HeartbeatLine gradientId={`hbGrad_${variant}`} />

        {/* Stats row */}
        <div className="flex gap-8">
          {cfg.stats.map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <div className={`text-xl font-extrabold ${color}`}>{value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / trust badges */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{cfg.footerLabel}</span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-500">
          {cfg.footerItems.map((item) => (
            <span key={item} className="hover:text-slate-300 transition-colors uppercase tracking-widest">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthIllustrationPanel;
