import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { diseaseDistributionData, weeklyPatientsData, riskCategoryData, monthlyTrendData } from '../../data/mockDashboard';
import { BarChart3, PieChart as PieIcon, TrendingUp, Activity } from 'lucide-react';

const TABS = [
  { id: 'disease', label: 'Disease Distribution', icon: PieIcon },
  { id: 'weekly', label: 'Weekly Patients', icon: BarChart3 },
  { id: 'risk', label: 'Risk Categories', icon: Activity },
  { id: 'trend', label: 'Monthly Trend', icon: TrendingUp },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card border border-white/15 rounded-xl p-3 text-xs shadow-xl">
      {label && <p className="text-slate-300 font-bold mb-1.5">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill }} className="font-semibold">
          {entry.name}: <span className="text-white font-black">{entry.value}</span>
          {entry.name === 'accuracy' ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

const DiseaseChart = () => (
  <div className="flex flex-col md:flex-row items-center gap-6">
    <div className="w-full md:w-auto" style={{ height: 220, minWidth: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={diseaseDistributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
            paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={900}>
            {diseaseDistributionData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="grid grid-cols-2 gap-2 flex-1 w-full">
      {diseaseDistributionData.map(d => (
        <div key={d.name} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/4 hover:bg-white/8 transition-colors">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color, boxShadow: `0 0 8px ${d.color}60` }} />
          <div>
            <p className="text-[11px] font-bold text-slate-200">{d.name}</p>
            <p className="text-[10px] text-slate-400">{d.value}% of cases</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const WeeklyChart = () => (
  <div style={{ height: 220 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={weeklyPatientsData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }} barGap={4} barCategoryGap="25%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
        <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
        <Bar dataKey="patients" name="Patients" fill="#06b6d4" radius={[4, 4, 0, 0]} animationDuration={900} />
        <Bar dataKey="predictions" name="Predictions" fill="#6366f1" radius={[4, 4, 0, 0]} animationDuration={900} />
        <Bar dataKey="recovered" name="Recovered" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const RiskChart = () => (
  <div className="flex flex-col md:flex-row items-center gap-6">
    <div style={{ height: 200, minWidth: 200 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={riskCategoryData} cx="50%" cy="50%" outerRadius={85} paddingAngle={5}
            dataKey="value" animationBegin={0} animationDuration={900}>
            {riskCategoryData.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
    <div className="flex flex-col gap-2 flex-1 w-full">
      {riskCategoryData.map(d => (
        <div key={d.name} className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300">{d.name}</span>
              <span className="text-[11px] font-bold text-white">{d.value}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                animate={{ width: `${d.value}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MonthlyTrend = () => (
  <div style={{ height: 220 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={monthlyTrendData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="grdPat" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="grdAcc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 10, color: '#94a3b8' }} />
        <Area type="monotone" dataKey="patients" name="Patients" stroke="#06b6d4" strokeWidth={2} fill="url(#grdPat)" animationDuration={1000} />
        <Area type="monotone" dataKey="accuracy" name="accuracy" stroke="#10b981" strokeWidth={2} fill="url(#grdAcc)" animationDuration={1000} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const CHART_MAP = { disease: DiseaseChart, weekly: WeeklyChart, risk: RiskChart, trend: MonthlyTrend };

const DiseaseAnalyticsCharts = () => {
  const [tab, setTab] = useState('disease');
  const ActiveChart = CHART_MAP[tab];

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Disease Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Visualized healthcare data & trends</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/8 p-5">
        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-6 bg-white/5 p-1 rounded-xl flex-wrap">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold transition-all flex-1 sm:flex-none justify-center sm:justify-start
                  ${tab === t.id ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/8'}`}
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Chart */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveChart />
        </motion.div>
      </div>
    </section>
  );
};

export default DiseaseAnalyticsCharts;
