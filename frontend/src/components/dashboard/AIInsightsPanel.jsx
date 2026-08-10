import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Thermometer, HeartPulse, ShieldAlert, Sparkles
} from 'lucide-react';
import predictionService from '../../services/predictionService';

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
  const [insights, setInsights] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const history = await predictionService.getPredictionHistory();
        if (Array.isArray(history) && history.length > 0) {
          const mapped = history.map(item => ({
            id: item.id,
            title: `Disease Match: ${item.top_disease}`,
            message: `Symptoms: ${(item.symptoms || []).join(', ')}. Severity: ${item.severity || 'Normal'}.`,
            confidence: Math.round((item.top_confidence || 0) * 100),
            tag: item.severity === 'severe' ? 'High Concern' : 'Analyzed',
            severity: item.severity === 'severe' ? 'critical' : 'info',
            icon: 'Sparkles',
          }));
          setInsights(mapped);
        } else {
          setInsights([]);
        }
      } catch (err) {
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  // Auto-rotate insights
  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setActive(a => (a + 1) % insights.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [insights.length]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-cyan-400" />
            AI Health Insights
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Live intelligence from backend ML model database</p>
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

      {loading ? (
        <div className="p-8 glass-card rounded-2xl border border-white/8 text-center text-xs text-slate-400">
          Loading AI Insights...
        </div>
      ) : insights.length === 0 ? (
        <div className="p-8 glass-card rounded-2xl border border-white/8 text-center space-y-1">
          <p className="text-sm font-bold text-slate-300">No Clinical Insights Yet</p>
          <p className="text-xs text-slate-500">Run a symptom analysis to generate AI diagnostic insights.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {insights.map((insight, idx) => {
              const Icon = ICON_MAP[insight.icon] || Sparkles;
              const sev = SEV_CONFIG[insight.severity] || SEV_CONFIG.info;
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

          {insights.length > 1 && (
            <div className="flex justify-center gap-1.5 mt-3">
              {insights.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActive(idx)}
                  className={`rounded-full transition-all duration-300 ${active === idx ? 'w-4 h-2 bg-cyan-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default AIInsightsPanel;

