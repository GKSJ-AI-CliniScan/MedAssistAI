import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Sparkles, Shield, ChevronDown } from 'lucide-react';
import RippleButton from '../../../components/ui/RippleButton';

// Floating medical icon component
const FloatingIcon = ({ icon: Icon, className, delay = 0, size = 20 }) => (
  <motion.div
    className={`absolute z-0 rounded-2xl flex items-center justify-center ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: 'easeOut' }}
  >
    <motion.div
      animate={{
        y: [0, -12, 0],
        rotate: [0, 5, -5, 0],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className="w-full h-full flex items-center justify-center"
    >
      <Icon size={size} />
    </motion.div>
  </motion.div>
);

// Animated badge
const BadgePill = ({ text }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
      bg-gradient-to-r from-cyan-500/10 to-indigo-600/10
      border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6"
  >
    <motion.div
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="w-2 h-2 rounded-full bg-cyan-400"
    />
    {text}
    <Sparkles size={12} className="text-indigo-400" />
  </motion.div>
);

// Stat chip below headline
const StatChip = ({ value, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, ease: 'backOut' }}
    className="flex flex-col items-center px-5 py-3 rounded-2xl
      bg-white/5 border border-white/10 backdrop-blur-sm"
  >
    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400">
      {value}
    </span>
    <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">{label}</span>
  </motion.div>
);

// Animated gradient orb
const GradientOrb = ({ className, color = 'cyan' }) => {
  const colors = {
    cyan: 'from-cyan-500/20 to-cyan-500/0',
    indigo: 'from-indigo-600/20 to-indigo-600/0',
    rose: 'from-rose-500/15 to-rose-500/0',
    emerald: 'from-emerald-500/15 to-emerald-500/0',
  };

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial ${colors[color]} blur-3xl pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.6, 0.9, 0.6],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
};

const HeroSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-4"
    >
      {/* Background Gradient Orbs */}
      <GradientOrb className="w-[600px] h-[600px] top-[-200px] right-[-100px]" color="indigo" />
      <GradientOrb className="w-[500px] h-[500px] bottom-[-150px] left-[-100px]" color="cyan" />
      <GradientOrb className="w-[300px] h-[300px] top-[40%] left-[10%]" color="rose" />

      {/* Floating Medical Icons */}
      <FloatingIcon
        icon={() => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-cyan-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        className="w-12 h-12 top-[20%] left-[8%] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
        delay={0.2}
      />
      <FloatingIcon
        icon={() => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-indigo-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )}
        className="w-14 h-14 top-[15%] right-[12%] bg-indigo-500/10 border border-indigo-500/20"
        delay={0.4}
      />
      <FloatingIcon
        icon={() => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )}
        className="w-12 h-12 bottom-[30%] left-[5%] bg-emerald-500/10 border border-emerald-500/20"
        delay={0.6}
      />
      <FloatingIcon
        icon={() => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-rose-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        className="w-11 h-11 bottom-[25%] right-[8%] bg-rose-500/10 border border-rose-500/20"
        delay={0.8}
      />
      <FloatingIcon
        icon={() => (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-amber-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )}
        className="w-10 h-10 top-[45%] right-[5%] bg-amber-500/10 border border-amber-500/20"
        delay={1.0}
      />

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <BadgePill text="AI-Powered Clinical Diagnostics Suite" />

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
        >
          <span className="text-slate-100">Your Health.</span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
            Intelligently
          </span>{' '}
          <span className="text-slate-100">Analyzed.</span>
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          MedAssist AI combines advanced symptom analysis, disease prediction models, and personalized
          risk assessments to give you comprehensive insights into your health — all in one premium platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
        >
          <RippleButton variant="primary" className="px-8 py-3.5 text-sm font-bold gap-2 group" onClick={() => navigate('/signin')}>
            Get Started Free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </RippleButton>
          <RippleButton variant="outline" className="px-8 py-3.5 text-sm font-bold" onClick={() => navigate('/signin')}>
            Sign In to Portal
          </RippleButton>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <StatChip value="200+" label="Symptoms Mapped" delay={0.6} />
          <StatChip value="50+" label="Disease Models" delay={0.7} />
          <StatChip value="98%" label="Uptime SLA" delay={0.8} />
          <StatChip value="256-bit" label="Data Encryption" delay={0.9} />
        </motion.div>

        {/* Medical Disclaimer badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-10 inline-flex items-center gap-2 text-[11px] text-slate-500 border border-white/5 rounded-full px-4 py-1.5 bg-white/3"
        >
          <Shield size={12} className="text-emerald-400 shrink-0" />
          For informational use only. Not a substitute for professional medical advice.
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <span className="text-[10px] tracking-widest uppercase font-semibold">Explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
