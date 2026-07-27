import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Stethoscope, Brain, FileText, AlertTriangle, Activity,
  TrendingUp, TrendingDown, Heart, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { useCountUp } from '../../hooks/useCountUp';
import api from '../../services/api';

const makeSparkline = (base, len = 8) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.max(0, base + Math.round(Math.sin(i * 0.9) * base * 0.18 + (Math.random() - 0.5) * base * 0.12)),
  }));

const CARDS = [
  { key: 'patientsToday', label: 'Patients Today', icon: Users, color: 'cyan', trend: '+8.3%', up: true },
  { key: 'consultations', label: "Today's Consults", icon: Stethoscope, color: 'indigo', trend: '+5.1%', up: true },
  { key: 'aiPredictions', label: 'AI Predictions', icon: Brain, color: 'purple', trend: '+12.7%', up: true },
  { key: 'pendingReports', label: 'Pending Reports', icon: FileText, color: 'amber', trend: '-3.4%', up: false },
  { key: 'criticalCases', label: 'Critical Cases', icon: AlertTriangle, color: 'rose', trend: '+2', up: false },
  { key: 'avgHealthScore', label: 'Avg Health Score', icon: Activity, color: 'emerald', suffix: '%', trend: '+1.2%', up: true },
  { key: 'recoveryRate', label: 'Recovery Rate', icon: Heart, color: 'teal', suffix: '%', trend: '+0.8%', up: true },
  { key: 'predictionAccuracy', label: 'AI Accuracy', icon: Brain, color: 'sky', suffix: '%', trend: '+0.3%', up: true },
];

const colorMap = {
  cyan:   { border: 'border-cyan-500/20', grad: 'from-cyan-500/10 via-transparent to-transparent', text: 'text-cyan-400', stroke: '#06b6d4' },
  indigo: { border: 'border-indigo-500/20', grad: 'from-indigo-500/10 via-transparent to-transparent', text: 'text-indigo-400', stroke: '#6366f1' },
  purple: { border: 'border-purple-500/20', grad: 'from-purple-500/10 via-transparent to-transparent', text: 'text-purple-400', stroke: '#a855f7' },
  amber:  { border: 'border-amber-500/20', grad: 'from-amber-500/10 via-transparent to-transparent', text: 'text-amber-400', stroke: '#f59e0b' },
  rose:   { border: 'border-rose-500/20', grad: 'from-rose-500/10 via-transparent to-transparent', text: 'text-rose-400', stroke: '#f43f5e' },
  emerald:{ border: 'border-emerald-500/20', grad: 'from-emerald-500/10 via-transparent to-transparent', text: 'text-emerald-400', stroke: '#10b981' },
  teal:   { border: 'border-teal-500/20', grad: 'from-teal-500/10 via-transparent to-transparent', text: 'text-teal-400', stroke: '#14b8a6' },
  sky:    { border: 'border-sky-500/20', grad: 'from-sky-500/10 via-transparent to-transparent', text: 'text-sky-400', stroke: '#0ea5e9' },
};

const StatCard = ({ cfg, value }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 150); return () => clearTimeout(t); }, []);
  const count = useCountUp(typeof value === 'number' ? value : 0, 1400, ready);
  const theme = colorMap[cfg.color];
  const [sparkData] = useState(() => makeSparkline(value || 0));
  const Icon = cfg.icon;
  const Trend = cfg.up ? TrendingUp : TrendingDown;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 40px ${theme.stroke}20` }}
      transition={{ duration: 0.25 }}
      className={`relative glass-card rounded-2xl p-4 border ${theme.border} bg-gradient-to-br ${theme.grad} overflow-hidden group cursor-default`}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${theme.stroke}, transparent 70%)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${theme.grad} border ${theme.border} flex items-center justify-center`}>
          <Icon size={16} className={theme.text} />
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-bold ${cfg.up ? 'text-emerald-400' : 'text-rose-400'}`}>
          <Trend size={10} />
          {cfg.trend}
        </span>
      </div>

      <div className="mb-3">
        <div className="text-2xl font-black text-white tracking-tight">
          {count}{cfg.suffix || ''}
        </div>
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{cfg.label}</div>
      </div>

      <div className="h-8 w-full opacity-50 group-hover:opacity-80 transition-opacity duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
            <defs>
              <linearGradient id={`sg_${cfg.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.stroke} stopOpacity={0.5} />
                <stop offset="100%" stopColor={theme.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={theme.stroke} strokeWidth={1.5}
              fill={`url(#sg_${cfg.key})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-4 border border-white/5 animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="w-9 h-9 rounded-xl bg-white/5" />
      <div className="w-12 h-3 rounded bg-white/5" />
    </div>
    <div className="mb-3">
      <div className="w-16 h-7 rounded bg-white/5 mb-1" />
      <div className="w-24 h-2.5 rounded bg-white/5" />
    </div>
    <div className="h-8 w-full rounded bg-white/5" />
  </div>
);

const StatCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (err) {
      setError('Could not load dashboard stats.');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Health Overview</h2>
          <p className="text-xs text-slate-400 mt-0.5">Live metrics — updated every 5 minutes</p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <button
              onClick={fetchStats}
              className="flex items-center gap-1 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <RefreshCw size={10} /> Retry
            </button>
          )}
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            LIVE
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : CARDS.map((cfg) => (
              <StatCard key={cfg.key} cfg={cfg} value={stats?.[cfg.key] ?? 0} />
            ))
        }
      </div>

      {error && (
        <p className="text-xs text-rose-400/70 mt-2 text-center">{error}</p>
      )}
    </section>
  );
};

export default StatCards;
