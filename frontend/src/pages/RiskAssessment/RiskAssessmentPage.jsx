import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, HeartPulse, Info, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import RippleButton from '../../components/ui/RippleButton';
import CircularGauge from '../../components/common/CircularGauge';

export const RiskAssessmentPage = () => {
  const { symptomSession } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const risk = symptomSession.riskResult;
  const hasRisk = risk !== null && risk !== undefined;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
        >
          <RefreshCw size={24} />
        </motion.div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Running Risk Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="text-rose-400 animate-pulse" /> Risk Assessment
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Clinical pathology risk scoring engine</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!hasRisk ? (
          /* Empty State */
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-3xl p-12 border border-white/8 text-center max-w-lg mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto shadow-glow-primary">
              <ShieldAlert size={30} className="text-rose-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-200">No Risk Score Calculated</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                You must complete a symptom analysis before the risk engine can calculate pathology scores.
              </p>
            </div>
            <RippleButton
              variant="primary"
              onClick={() => navigate('/symptoms')}
              className="px-8 py-3.5 text-xs font-bold gap-2 mx-auto"
            >
              Analyze Symptoms <HeartPulse size={14} />
            </RippleButton>
          </motion.div>
        ) : (
          /* Dashboard */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Risk Gauge */}
            <div className="glass-card rounded-3xl p-6 border border-white/8 flex flex-col items-center justify-center text-center gap-5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Calculated Risk Score</span>
              <CircularGauge
                value={risk.riskScore}
                size={140}
                strokeWidth={10}
                color={risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? '#f43f5e' : risk.riskLevel === 'Medium' ? '#f59e0b' : '#10b981'}
                label=""
                sublabel={risk.riskLevel}
              />
              <div className="space-y-1">
                <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border 
                  ${risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : risk.riskLevel === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                  {risk.riskLevel} Risk Profile
                </span>
                <p className="text-[10px] text-slate-500 pt-1">Evaluated at: {new Date(risk.evaluatedAt).toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Analysis details */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Alert details */}
              <div className={`p-5 rounded-3xl border flex items-start gap-4 bg-gradient-to-br
                ${risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? 'from-rose-500/10 border-rose-500/20 text-rose-300' : risk.riskLevel === 'Medium' ? 'from-amber-500/10 border-amber-500/20 text-amber-300' : 'from-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
                {risk.riskLevel === 'High' || risk.riskLevel === 'Critical' ? (
                  <AlertTriangle size={20} className="text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">Clinical Engine Summary</h3>
                  <p className="text-xs leading-relaxed opacity-90">{risk.message}</p>
                </div>
              </div>

              {/* Risk Factors breakdown */}
              <div className="glass-card rounded-3xl p-5 border border-white/8 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Info size={14} className="text-cyan-400" /> Patient Risk Factors Breakdown
                </h3>
                <div className="space-y-3.5">
                  {[
                    { label: 'Severity Index Adjustment', value: symptomSession.severity === 'severe' ? '+30' : symptomSession.severity === 'moderate' ? '+15' : '+0', status: symptomSession.severity, color: symptomSession.severity === 'severe' ? 'text-rose-400' : symptomSession.severity === 'moderate' ? 'text-amber-400' : 'text-emerald-400' },
                    { label: 'Symptom Duration Weight', value: symptomSession.duration > 14 ? '+15' : symptomSession.duration > 7 ? '+10' : '+0', status: `${symptomSession.duration} Days`, color: symptomSession.duration > 7 ? 'text-amber-400' : 'text-emerald-400' },
                    { label: 'Active Symptom Count Factor', value: `+${symptomSession.selectedSymptoms.length * 5}`, status: `${symptomSession.selectedSymptoms.length} Selected`, color: 'text-indigo-400' },
                    { label: 'Patient Age Vulnerability', value: '+0', status: 'Under 50', color: 'text-slate-400' },
                  ].map((factor, i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{factor.label}</p>
                        <p className={`text-[10px] mt-0.5 capitalize ${factor.color}`}>{factor.status}</p>
                      </div>
                      <span className="text-xs font-black text-slate-400">{factor.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next actions */}
              <div className="flex gap-3 justify-end">
                <RippleButton
                  variant="outline"
                  onClick={() => navigate('/prediction')}
                  className="px-6 py-2.5 text-xs font-bold"
                >
                  View Predictions
                </RippleButton>
                <RippleButton
                  variant="primary"
                  onClick={() => navigate('/recommendations')}
                  className="px-6 py-2.5 text-xs font-bold"
                >
                  Treatment Advice
                </RippleButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiskAssessmentPage;
