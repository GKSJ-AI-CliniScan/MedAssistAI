import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, RefreshCw, UserCheck, ShieldAlert, Sparkles, BookOpen, Coffee, Flame, Droplet, Moon, Eye } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import RippleButton from '../../components/ui/RippleButton';

export const RecommendationsPage = () => {
  const { symptomSession } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const recs = symptomSession.recommendations;
  const hasRecs = recs !== null && recs !== undefined;

  // Fallback default recommendations
  const displayRecs = hasRecs ? recs : {
    lifestyle: "Maintain a balanced daily routine, avoid high-stress triggers, and practice regular hand-washing.",
    diet: "Eat a nutrient-dense diet consisting of fresh vegetables, lean proteins, and antioxidant-rich fruits.",
    exercise: "Engage in 30 minutes of moderate aerobic activity (e.g., walking, cycling) at least 5 days a week.",
    waterIntake: "Consume 2.5 to 3.0 liters of pure water daily to maintain proper cellular function.",
    sleep: "Aim for 7.5 to 8.5 hours of uninterrupted sleep. Sleep in a dark, cool, and quiet room.",
    followUp: "Schedule routine physical checks once a year.",
    doctor: "General Physician"
  };

  const sections = [
    { title: 'Lifestyle Advice', text: displayRecs.lifestyle, icon: Coffee, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { title: 'Diet & Nutrition', text: displayRecs.diet, icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { title: 'Exercise Guidance', text: displayRecs.exercise, icon: Flame, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
    { title: 'Hydration Intake', text: displayRecs.waterIntake, icon: Droplet, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
    { title: 'Sleep & Recovery', text: displayRecs.sleep, icon: Moon, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { title: 'Clinical Follow-up', text: displayRecs.followUp, icon: Eye, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

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
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Consulting Clinical Database...</p>
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
            <Heart className="text-emerald-400 animate-pulse" /> Treatment Recommendations
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Clinical treatment maps and lifestyle guidance</p>
        </div>
      </div>

      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 border border-white/8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-indigo-650/5 to-transparent pointer-events-none" />
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
            <Sparkles size={11} /> AI Physician Guidance
          </div>
          <h2 className="text-lg font-black text-white">Clinical Directive Profile</h2>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            These directives are automatically compiled based on active symptom sessions and matching diagnostics. Double check critical treatments.
          </p>
        </div>
        <div className="z-10 bg-white/3 border border-white/5 rounded-2xl p-4 flex items-center gap-3 shrink-0">
          <UserCheck className="text-cyan-400" size={24} />
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Specialist Referrals</span>
            <span className="text-xs font-bold text-slate-200">{displayRecs.doctor || 'General Practitioner'}</span>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sect, idx) => {
          const Icon = sect.icon;
          return (
            <motion.div
              key={sect.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`glass-card rounded-3xl p-5 border ${sect.bg} flex gap-4`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/3 border border-white/5 ${sect.color}`}>
                <Icon size={16} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">{sect.title}</h3>
                <p className="text-xs text-slate-350 leading-relaxed font-medium">{sect.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center border-t border-white/5 pt-5">
        <RippleButton
          variant="outline"
          onClick={() => navigate('/prediction')}
          className="px-6 py-2.5 text-xs font-bold"
        >
          Back to Predictions
        </RippleButton>
        <RippleButton
          variant="primary"
          onClick={() => navigate('/reports')}
          className="px-6 py-2.5 text-xs font-bold"
        >
          Export Report
        </RippleButton>
      </div>
    </div>
  );
};

export default RecommendationsPage;
