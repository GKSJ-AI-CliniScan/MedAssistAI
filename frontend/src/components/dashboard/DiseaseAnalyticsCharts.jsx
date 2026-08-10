import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Activity } from 'lucide-react';
import analyticsService from '../../services/analyticsService';

const TABS = [
  { id: 'disease', label: 'Disease Distribution', icon: PieIcon },
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
        </p>
      ))}
    </div>
  );
};

const DiseaseChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="py-12 text-center text-xs text-slate-400">No disease distribution data available yet.</div>;
  }
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="w-full md:w-auto" style={{ height: 220, minWidth: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
              paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={900}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color || '#06b6d4'} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 flex-1 w-full">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/4 hover:bg-white/8 transition-colors">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color || '#06b6d4' }} />
            <div>
              <p className="text-[11px] font-bold text-slate-200">{d.name}</p>
              <p className="text-[10px] text-slate-400">{d.value} cases ({d.percentage || 0}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RiskChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="py-12 text-center text-xs text-slate-400">No risk assessment data recorded yet.</div>;
  }
  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div style={{ height: 200, minWidth: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={85} paddingAngle={5}
              dataKey="value" animationBegin={0} animationDuration={900}>
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.color || '#10b981'} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 flex-1 w-full">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color || '#10b981' }} />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-300">{d.name}</span>
                <span className="text-[11px] font-bold text-white">{d.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthlyTrend = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return <div className="py-12 text-center text-xs text-slate-400">No monthly analysis trend data recorded yet.</div>;
  }
  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="grdPat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="patients" name="Patient Analyses" stroke="#06b6d4" strokeWidth={2} fill="url(#grdPat)" animationDuration={1000} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const DiseaseAnalyticsCharts = () => {
  const [tab, setTab] = useState('disease');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await analyticsService.getAnalyticsData();
        setAnalytics(res);
      } catch (err) {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Disease Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">Visualized healthcare data from database queries</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/8 p-5">
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

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading analytics charts...</div>
        ) : (
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'disease' && <DiseaseChart data={analytics?.diseaseStatistics || analytics?.diseaseDistribution || []} />}
            {tab === 'risk' && <RiskChart data={analytics?.riskDistribution || []} />}
            {tab === 'trend' && <MonthlyTrend data={analytics?.monthlyTrend || []} />}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DiseaseAnalyticsCharts;

