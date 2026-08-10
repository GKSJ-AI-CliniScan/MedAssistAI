import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, ChevronRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import predictionService from '../../services/predictionService';

const riskBadge = (level) => {
  switch (level?.toLowerCase()) {
    case 'high':   return { color: 'text-rose-400 bg-rose-500/10 border-rose-500/25', icon: AlertTriangle, dot: 'bg-rose-400' };
    case 'medium': return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/25', icon: AlertTriangle, dot: 'bg-amber-400' };
    default:       return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25', icon: CheckCircle, dot: 'bg-emerald-400' };
  }
};

export const PredictionHistoryCard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await predictionService.getPredictionHistory();
        if (Array.isArray(history)) {
          const mapped = history.slice(0, 5).map(p => ({
            id: p.id,
            disease: p.top_disease || 'Unknown',
            confidence: Math.round((p.top_confidence || 0) * 100),
            riskLevel: p.risk_level || 'Low',
            symptoms: p.symptoms || [],
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A',
          }));
          setItems(mapped);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={17} className="text-indigo-400" />
          <h3 className="text-base font-bold text-slate-200 tracking-wide">Recent Predictions</h3>
        </div>
        <button
          onClick={() => navigate('/prediction')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>

      {loading ? (
        <div className="glass-card rounded-2xl p-6 border border-white/5 text-center text-xs text-slate-400">Loading prediction history...</div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 border border-white/5 text-center space-y-1">
          <p className="text-sm font-bold text-slate-300">No Predictions Yet</p>
          <p className="text-xs text-slate-500">Run a symptom analysis to see your prediction history here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(({ id, disease, confidence, riskLevel, symptoms, date }, i) => {
            const { color, dot } = riskBadge(riskLevel);
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                whileHover={{ x: 3 }}
                onClick={() => navigate('/prediction')}
                className="glass-card rounded-2xl p-4 border border-white/5 cursor-pointer group hover:border-white/10 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse shrink-0`} />
                      <span className="text-sm font-bold text-slate-200 truncate">{disease}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {symptoms.slice(0, 3).map(s => (
                        <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-slate-400 font-semibold uppercase tracking-wide">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <Clock size={11} />
                      <span>{date}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div className="relative w-12 h-12">
                      <svg className="-rotate-90 w-12 h-12">
                        <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                        <motion.circle
                          cx="24" cy="24" r="19"
                          fill="none"
                          stroke={confidence >= 75 ? '#06b6d4' : confidence >= 50 ? '#f59e0b' : '#f43f5e'}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 19}
                          initial={{ strokeDashoffset: 2 * Math.PI * 19 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 19 * (1 - confidence / 100) }}
                          transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 + 0.3 }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-extrabold text-slate-200">{confidence}%</span>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${color}`}>
                      {riskLevel}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PredictionHistoryCard;

