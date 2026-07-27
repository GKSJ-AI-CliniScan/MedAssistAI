import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Brain, AlertTriangle, ArrowRight, Activity, Stethoscope,
  Heart, ShieldCheck, ChevronDown, ChevronUp, RefreshCw,
  Compass, Plus, FileText, CheckCircle2
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import RippleButton from '../../components/ui/RippleButton';

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' } })
};

const DiseaseCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const getRiskStyles = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'high':   return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
      case 'medium': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:       return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
    }
  };

  const confidence = item.confidence ?? 60;
  const matchColor = confidence >= 80 ? '#06b6d4' : confidence >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="glass-card rounded-3xl p-6 border border-white/8 hover:border-white/12 transition-all duration-200 group"
    >
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-2">
            <h3 className="text-base font-extrabold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
              {item.name}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getRiskStyles(item.riskLevel)}`}>
              {item.riskLevel} Risk
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            {item.description}
          </p>

          {/* Symptom Matches */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Symptom Match Profile</h4>
            <div className="flex flex-wrap gap-1.5">
              {item.matchedSymptoms?.map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-300 font-semibold">
                  ✓ {s}
                </span>
              ))}
              {item.symptoms?.filter(s => !item.matchedSymptoms?.includes(s)).map(s => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/3 border border-white/5 text-slate-500">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence Circle */}
        <div className="flex flex-col items-center gap-2 shrink-0 self-center sm:self-start">
          <div className="relative w-16 h-16">
            <svg className="-rotate-90 w-16 h-16">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4.5" />
              <motion.circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke={matchColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 26}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - confidence / 100) }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: index * 0.1 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-extrabold text-slate-200 leading-none">{confidence}%</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden mt-5 pt-4 border-t border-white/5 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={11} className="text-amber-400" /> Potential Causes
                </h4>
                <ul className="space-y-1">
                  {item.causes?.map((c, i) => (
                    <li key={i} className="text-[11px] text-slate-350 flex items-start gap-1.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40 shrink-0 mt-1.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <AlertTriangle size={11} className="text-rose-400" /> Complications
                </h4>
                <ul className="space-y-1">
                  {item.complications?.map((c, i) => (
                    <li key={i} className="text-[11px] text-slate-350 flex items-start gap-1.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500/40 shrink-0 mt-1.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Referral Info */}
            <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Recommended Specialist</p>
                <p className="text-xs font-bold text-slate-200 mt-0.5">{item.recommendations?.doctor || 'General Practitioner'}</p>
              </div>
              <RippleButton
                variant="outline"
                className="px-4 py-2 text-[10px] font-bold h-8 self-start sm:self-auto"
                onClick={() => navigate('/recommendations')}
              >
                View Recommendations <ArrowRight size={10} />
              </RippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accordion toggle footer */}
      <div className="flex justify-center mt-4 border-t border-white/3 pt-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-bold text-slate-500 hover:text-slate-350 transition-colors uppercase tracking-widest flex items-center gap-1 focus:outline-none"
        >
          {expanded ? (
            <>Hide Clinical Profile <ChevronUp size={12} /></>
          ) : (
            <>View Clinical Profile <ChevronDown size={12} /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export const DiseasePredictionPage = () => {
  const { symptomSession } = useUser();
  const navigate = useNavigate();

  const predictions = symptomSession.predictionResult;
  const hasPredictions = predictions && predictions.length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Brain className="text-indigo-400" /> Disease Prediction
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Clinical pattern recognition results</p>
        </div>

        {hasPredictions && (
          <RippleButton
            variant="secondary"
            onClick={() => navigate('/symptoms')}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold self-start md:self-auto"
          >
            <RefreshCw size={13} /> Restart Analysis
          </RippleButton>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {!hasPredictions ? (
          /* ── Empty State ── */
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-3xl p-12 border border-white/8 text-center max-w-lg mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-glow-secondary">
              <Brain size={30} className="text-indigo-400" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-200">No active symptom analysis found</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Run a symptom check to map clinical symptoms and predict matching conditions.
              </p>
            </div>

            <RippleButton
              variant="primary"
              onClick={() => navigate('/symptoms')}
              className="px-8 py-3.5 text-xs font-bold gap-2 mx-auto"
            >
              Analyze Symptoms <Stethoscope size={14} />
            </RippleButton>
          </motion.div>
        ) : (
          /* ── Results Dashboard ── */
          <motion.div
            key="results-view"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-6"
          >
            {/* Session Overview Card */}
            <motion.div
              variants={cardVariants}
              className="glass-card rounded-3xl p-5 border border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden"
            >
              {/* Card light reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/1 to-white/3 pointer-events-none" />

              <div className="flex-1 space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Diagnostic Session</h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {symptomSession.selectedSymptoms?.map(s => (
                    <span key={s.id} className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-slate-300 font-semibold">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-xs text-slate-400 relative z-10 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Severity</span>
                  <span className="font-bold text-slate-200 capitalize">{symptomSession.severity}</span>
                </div>
                <div className="w-px h-6 bg-white/5" />
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Duration</span>
                  <span className="font-bold text-slate-200">{symptomSession.duration} {symptomSession.duration === 1 ? 'day' : 'days'}</span>
                </div>
              </div>
            </motion.div>

            {/* List of matches */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Predicted Diseases ({predictions.length})</h3>
              
              {predictions.map((item, i) => (
                <DiseaseCard key={item.id} item={item} index={i} />
              ))}
            </div>

            {/* Action Buttons to next modules */}
            <motion.div
              variants={cardVariants}
              className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/5"
            >
              <RippleButton
                variant="outline"
                onClick={() => navigate('/risk')}
                className="px-6 py-3 text-xs font-bold gap-1.5 w-full sm:w-auto"
              >
                Assess Risk Levels <Activity size={14} />
              </RippleButton>
              <RippleButton
                variant="primary"
                onClick={() => navigate('/recommendations')}
                className="px-8 py-3 text-xs font-bold gap-1.5 w-full sm:w-auto"
              >
                Get Treatment Recommendations <Heart size={14} />
              </RippleButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseasePredictionPage;
