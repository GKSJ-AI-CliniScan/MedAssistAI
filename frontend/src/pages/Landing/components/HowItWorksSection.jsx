import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create Your Profile',
    description:
      'Register in seconds and set up your patient profile — including personal information, medical history, known conditions, and lifestyle details.',
    color: 'cyan',
  },
  {
    step: '02',
    title: 'Log Your Symptoms',
    description:
      'Use our intuitive symptom selector to choose and describe what you\'re experiencing. The AI engine begins mapping symptom clusters immediately.',
    color: 'indigo',
  },
  {
    step: '03',
    title: 'Receive AI Analysis',
    description:
      'Within seconds, get a detailed disease prediction list with confidence scores, a full risk assessment matrix, and evidence-backed treatment recommendations.',
    color: 'emerald',
  },
  {
    step: '04',
    title: 'Track & Report',
    description:
      'Monitor your health trends over time through the analytics dashboard and generate PDF health reports to share with your healthcare provider.',
    color: 'rose',
  },
];

const colorMap = {
  cyan: {
    num: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    line: 'from-cyan-500/50',
    dot: 'bg-cyan-500',
  },
  indigo: {
    num: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    line: 'from-indigo-500/50',
    dot: 'bg-indigo-500',
  },
  emerald: {
    num: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    line: 'from-emerald-500/50',
    dot: 'bg-emerald-500',
  },
  rose: {
    num: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    line: 'from-rose-500/50',
    dot: 'bg-rose-500',
  },
};

const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const c = colorMap[step.color];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
      className="flex gap-6 group"
    >
      {/* Step number + vertical line */}
      <div className="flex flex-col items-center">
        <div
          className={`
            w-12 h-12 shrink-0 rounded-2xl border flex items-center justify-center
            font-extrabold text-sm tracking-wider ${c.num}
            group-hover:scale-110 transition-transform duration-300
          `}
        >
          {step.step}
        </div>
        {index < steps.length - 1 && (
          <div className={`w-[2px] flex-1 mt-3 bg-gradient-to-b ${c.line} to-transparent`} />
        )}
      </div>

      {/* Content */}
      <div className="pb-10">
        <h3 className="font-bold text-slate-100 text-base mb-2">{step.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md">{step.description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text Header + CTA */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="sticky top-32"
            >
              <p className="text-xs font-bold tracking-widest uppercase text-indigo-400 mb-3">
                How It Works
              </p>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-100 mb-5 leading-tight">
                From symptoms to{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                  insights
                </span>{' '}
                in minutes
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-lg">
                Our streamlined four-step workflow takes you from signing up to receiving a
                comprehensive AI health assessment in under five minutes.
              </p>

              {/* Dashboard preview card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="glass-card rounded-2xl p-5 border border-white/10 overflow-hidden relative"
              >
                {/* Simulated dashboard preview */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="w-20 h-2.5 rounded-full bg-white/10 mb-1.5" />
                    <div className="w-32 h-2 rounded-full bg-white/5" />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20" />
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20" />
                  </div>
                </div>
                {/* Clinical metrics preview */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['87%', '12', 'Low'].map((val, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className={`text-base font-extrabold ${i === 0 ? 'text-emerald-400' : i === 1 ? 'text-cyan-400' : 'text-indigo-400'}`}>
                        {val}
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        {i === 0 ? 'Confidence' : i === 1 ? 'Symptoms' : 'Risk Level'}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Risk trend preview bars */}
                <div className="flex items-end gap-1.5 h-16">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                      style={{ height: `${h}%`, originY: 1 }}
                      className={`flex-1 rounded-t-md ${
                        i % 3 === 0
                          ? 'bg-gradient-to-t from-cyan-500/60 to-cyan-400/20'
                          : i % 3 === 1
                          ? 'bg-gradient-to-t from-indigo-500/60 to-indigo-400/20'
                          : 'bg-gradient-to-t from-emerald-500/60 to-emerald-400/20'
                      }`}
                    />
                  ))}
                </div>

                {/* Glow accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
              </motion.div>

              <Link
                to="/register"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
              >
                Start your health analysis
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right: Steps */}
          <div className="pt-2">
            {steps.map((step, index) => (
              <StepCard key={step.step} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
