import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: 200, suffix: '+', label: 'Symptoms Catalogued', color: 'from-cyan-400 to-cyan-500' },
  { value: 50, suffix: '+', label: 'Disease Models', color: 'from-indigo-400 to-indigo-500' },
  { value: 99, suffix: '%', label: 'Analysis Accuracy', color: 'from-emerald-400 to-emerald-500' },
  { value: 256, suffix: '-bit', label: 'Data Encryption', color: 'from-amber-400 to-amber-500' },
  { value: 5, suffix: 'min', label: 'Avg. Analysis Time', color: 'from-rose-400 to-rose-500' },
  { value: 24, suffix: '/7', label: 'System Availability', color: 'from-purple-400 to-purple-500' },
];

// Counter hook
const useCounter = (target, started, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
};

const StatItem = ({ stat, started }) => {
  const count = useCounter(stat.value, started);

  return (
    <div className="text-center px-4 py-6 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 hover:bg-white/5 transition-all duration-300">
      <div className={`text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b ${stat.color} mb-2`}>
        {count}{stat.suffix}
      </div>
      <p className="text-slate-400 text-xs font-medium">{stat.label}</p>
    </div>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative py-16 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08, ease: 'backOut' }}
            >
              <StatItem stat={stat} started={inView} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
