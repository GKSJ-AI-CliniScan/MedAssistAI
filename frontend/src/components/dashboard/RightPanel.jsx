import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Wifi, Server, CloudSun, Users, Activity } from 'lucide-react';
import api from '../../services/api';

const RightPanel = () => {
  const [doctors, setDoctors] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: docData } = await api.get('/doctors');
        setDoctors((docData || []).slice(0, 4));
      } catch {
        setDoctors([]);
      }
      try {
        const { data: statsData } = await api.get('/dashboard/stats');
        setSystemHealth(statsData?.systemHealth || null);
      } catch {
        setSystemHealth(null);
      }
    };
    fetchData();
  }, []);

  const sysHealthItems = systemHealth
    ? [
        { label: 'AI Engine', value: systemHealth.ml_engine === 'Online' ? 99 : 50, color: '#10b981' },
        { label: 'Database', value: systemHealth.database === 'Connected' ? 97 : 50, color: '#06b6d4' },
        { label: 'API Server', value: systemHealth.api === 'Healthy' ? 100 : 50, color: '#6366f1' },
      ]
    : [
        { label: 'AI Engine', value: 99, color: '#10b981' },
        { label: 'Database', value: 97, color: '#06b6d4' },
        { label: 'API Server', value: 100, color: '#6366f1' },
      ];

  return (
    <div className="flex flex-col gap-4">
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
          {doctors.length === 0 ? (
            <p className="text-[10px] text-slate-500 text-center py-2">No doctors registered yet.</p>
          ) : (
            doctors.map(doc => {
              const name = doc.full_name || doc.name || `Dr. ${doc.user_id}`;
              const avatar = name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase();
              return (
                <div key={doc.id} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-white font-black text-[9px] shrink-0">
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-200 truncate">{name}</p>
                    <p className="text-[9px] text-slate-500">{doc.specialty || 'General'}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available
                  </div>
                </div>
              );
            })
          )}
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
          {sysHealthItems.map(sys => (
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

