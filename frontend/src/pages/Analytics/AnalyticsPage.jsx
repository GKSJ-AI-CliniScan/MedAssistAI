import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { ArrowLeft, RefreshCw, BarChart3, LineChart as LineIcon, Activity, Sparkles } from 'lucide-react';
import { weeklyPatientsData, diseaseDistributionData, monthlyTrendData, riskCategoryData } from '../../data/mockDashboard';
import RippleButton from '../../components/ui/RippleButton';

const COLORS = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-white/10 rounded-2xl p-3 text-xs shadow-xl">
      {label && <p className="text-slate-350 font-bold mb-1">{label}</p>}
      {payload.map((entry, idx) => (
        <p key={idx} style={{ color: entry.color }} className="font-semibold text-slate-100">
          {entry.name}: <span className="font-black text-white">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Analytics Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
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
            <BarChart3 className="text-indigo-400" /> Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Statistical health mappings and clinical indexes</p>
        </div>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Admissions and predictions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-5 border border-white/8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={15} className="text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weekly Consultation Rates</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPatientsData} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="patients" name="Consultations" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                <Bar dataKey="predictions" name="AI Predictions" fill="#6366f1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 2: Monthly trend Area */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-5 border border-white/8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <LineIcon size={15} className="text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Intake & Accuracy Index</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="patients" name="Monitored Cases" stroke="#06b6d4" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="accuracy" name="AI Accuracy Index" stroke="#10b981" fill="url(#anGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 3: Disease Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-3xl p-5 border border-white/8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-rose-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pathology Index Profiles</h3>
          </div>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={diseaseDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {diseaseDistributionData.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Chart 4: Risk categories Pie */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-3xl p-5 border border-white/8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Patient Risk Categories</h3>
          </div>
          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskCategoryData} cx="50%" cy="50%" outerRadius={80} paddingAngle={5} dataKey="value">
                  {riskCategoryData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
