import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Wifi, Server, CloudSun, Users, Activity } from 'lucide-react';
import { mockHealthTips } from '../../data/mockDashboard';

const DOCTOR_STATUS = [
  { name: 'Dr. Yamini', specialty: 'General', available: true, avatar: 'YK' },
  { name: 'Dr. Patel', specialty: 'Cardiology', available: false, avatar: 'DP' },
  { name: 'Dr. Kumar', specialty: 'Endocrine', available: true, avatar: 'SK' },
];

const SYSTEM_HEALTH = [
  { label: 'AI Engine', value: 99, color: '#10b981' },
  { label: 'Database', value: 97, color: '#06b6d4' },
  { label: 'API Server', value: 100, color: '#6366f1' },
];

const RightPanel = () => {
  const tip = mockHealthTips[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % mockHealthTips.length];

  return (
    <div className="flex flex-col gap-4">
      {/* Today's Health Tip */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl border border-cyan-500/20 p-4 bg-gradient-to-br from-cyan-500/8 via-transparent to-transparent"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Lightbulb size={16} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-[11px] font-black text-white uppercase tracking-wider">Today's Health Tip</p>
            <p className="text-[9px] text-cyan-400 font-semibold">{tip.category}</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">{tip.tip}</p>
      </motion.div>

      {/* Doctor Availability */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl border border-white/8 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-indigo-400" />
          <p className="text-[11px] font-bold text-white uppercase tracking-wider">Doctor Availability</p>
        </div>
        <div className="space-y-2.5">
          {DOCTOR_STATUS.map(doc => (
            <div key={doc.name} className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-white font-black text-[9px] shrink-0">
                {doc.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-200 truncate">{doc.name}</p>
                <p className="text-[9px] text-slate-500">{doc.specialty}</p>
              </div>
              <div className={`flex items-center gap-1 text-[9px] font-bold ${doc.available ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {doc.available ? 'Available' : 'Busy'}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hospital Capacity */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl border border-white/8 p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-400" />
            <p className="text-[11px] font-bold text-white uppercase tracking-wider">Hospital Capacity</p>
          </div>
          <span className="text-[10px] font-bold text-amber-400">68% Full</span>
        </div>
        <div className="space-y-2.5">
          {[
            { label: 'General Ward', used: 72, total: 120, color: '#06b6d4' },
            { label: 'ICU', used: 11, total: 18, color: '#f43f5e' },
            { label: 'Emergency', used: 4, total: 8, color: '#f59e0b' },
          ].map(ward => (
            <div key={ward.label}>
              <div className="flex justify-between text-[10px] font-semibold mb-1">
                <span className="text-slate-400">{ward.label}</span>
                <span className="text-slate-300">{ward.used}/{ward.total}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: ward.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(ward.used / ward.total) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card rounded-2xl border border-white/8 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Server size={14} className="text-purple-400" />
          <p className="text-[11px] font-bold text-white uppercase tracking-wider">System Health</p>
        </div>
        <div className="space-y-2.5">
          {SYSTEM_HEALTH.map(sys => (
            <div key={sys.label} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: sys.color }} />
              <span className="text-[11px] text-slate-400 font-semibold flex-1">{sys.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-white/8">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: sys.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${sys.value}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white">{sys.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default RightPanel;
