import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, HeartPulse } from 'lucide-react';
import RippleButton from '../../../components/ui/RippleButton';

const TrustBadge = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
    <Icon size={14} className="text-emerald-400 shrink-0" />
    {label}
  </div>
);

const CTASection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Top separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-3xl overflow-hidden p-12 text-center"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-indigo-600/20 to-purple-700/20" />
          <div className="absolute inset-0 border border-white/10 rounded-3xl" />
          {/* Glass blur overlay */}
          <div className="absolute inset-0 backdrop-blur-sm" />

          {/* Animated orbs */}
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-600/25 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-600/25 rounded-full blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Animated heartbeat icon */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-glow-primary"
            >
              <HeartPulse size={28} className="text-white" />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              Take control of your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-300">
                health journey
              </span>{' '}
              today
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of users who use MedAssist AI to stay informed,
              track their health data, and prepare for every medical appointment with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <RippleButton variant="primary" className="px-10 py-3.5 text-sm font-bold gap-2 group" onClick={() => navigate('/register')}>
                Create Free Account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </RippleButton>
              <RippleButton variant="secondary" className="px-10 py-3.5 text-sm font-bold" onClick={() => navigate('/signin')}>
                Sign In
              </RippleButton>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6">
              <TrustBadge icon={ShieldCheck} label="No credit card required" />
              <TrustBadge icon={Zap} label="Setup in under 2 minutes" />
              <TrustBadge icon={ShieldCheck} label="Client-side data encryption" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
