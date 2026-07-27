import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Thermometer, HeartPulse, ShieldAlert, Sparkles, ChevronRight
} from 'lucide-react';
import { mockAIInsights } from '../../data/mockDashboard';

const ICON_MAP = {
  TrendingUp,
  TrendingDown,
  Thermometer,
  HeartPulse,
  ShieldAlert,
  Sparkles,
};

const SEV_CONFIG = {
  warning:  { bar: 'from-amber-500 to-amber-600',   border: 'border-amber-500/25',  badge: 'bg-amber-500/15 text-amber-400',   ring: 'ring-amber-500/30' },
  info:     { bar: 'from-cyan-500 to-cyan-600',      border: 'border-cyan-500/25',   badge: 'bg-cyan-500/15 text-cyan-400',     ring: 'ring-cyan-500/30' },
  critical: { bar: 'from-rose-500 to-rose-600',      border: 'border-rose-500/25',   badge: 'bg-rose-500/15 text-rose-400',     ring: 'ring-rose-500/30' },
  success:  { bar: 'from-emerald-500 to-emerald-600',border: 'border-emerald-500/25',badge: 'bg-emerald-500/15 text-emerald-400',ring: 'ring-emerald-500/30' },
};

const AIInsightsPanel = () => {
  const [active, setActive] = useState(0);

  // Auto-rotate insights
  useEffect(() => {
    const timer = setInterval(() => {
      setActive(a => (a + 1) % mockAIInsights.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            AI Health Insights
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Live intelligence from prediction models</p>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          AI LIVE
        </motion.div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {mockAIInsights.map((insight, idx) => {
          const Icon = ICON_MAP[insight.icon] || Sparkles;
          const sev = SEV_CONFIG[insight.severity];
          const isActive = active === idx;

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -3 }}
              onClick={() => setActive(idx)}
              className={`relative glass-card rounded-2xl p-4 border ${sev.border} cursor-pointer transition-all duration-300 overflow-hidden group
                ${isActive ? `ring-2 ${sev.ring}` : ''}`}
            >
              {/* Active glow overlay */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${sev.bar} opacity-5 pointer-events-none`}
                  />
                )}
              </AnimatePresence>

              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sev.badge} group-hover:scale-110 transition-transform`}>
                  <Icon size={17} />
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${sev.badge}`}>{insight.tag}</span>
              </div>

              <p className="text-[11px] font-bold text-white mb-1.5">{insight.title}</p>
              <p className="text-[10px] text-slate-400 leading-relaxed mb-3">{insight.message}</p>

              {/* Confidence bar */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">AI Confidence</span>
                  <span className={`text-[10px] font-black ${sev.badge.split(' ')[1]}`}>{insight.confidence}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/8">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${sev.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.confidence}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {mockAIInsights.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`rounded-full transition-all duration-300 ${active === idx ? 'w-4 h-2 bg-cyan-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default AIInsightsPanel;
