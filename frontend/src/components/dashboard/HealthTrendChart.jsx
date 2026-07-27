import React from 'react';
import {
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const weekData = [
  { day: 'Mon', score: 76 },
  { day: 'Tue', score: 72 },
  { day: 'Wed', score: 79 },
  { day: 'Thu', score: 83 },
  { day: 'Fri', score: 80 },
  { day: 'Sat', score: 85 },
  { day: 'Sun', score: 84 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs shadow-glass-md backdrop-blur-sm">
        <p className="text-slate-400 font-semibold mb-0.5">{label}</p>
        <p className="text-cyan-400 font-bold">Score: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const HealthTrendChart = () => {
  const first = weekData[0].score;
  const last = weekData[weekData.length - 1].score;
  const improved = last >= first;
  const diff = Math.abs(last - first);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 tracking-wide">Health Score Trend</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">7-day overview</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
            improved
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}
        >
          {improved ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {improved ? '+' : '-'}{diff} pts this week
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="h-36"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weekData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#healthGrad)"
              dot={{ fill: '#06b6d4', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#06b6d4', stroke: '#0e7490', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default HealthTrendChart;
