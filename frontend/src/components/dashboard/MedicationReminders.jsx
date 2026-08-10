import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, CheckCircle2, Circle } from 'lucide-react';
import api from '../../services/api';

const TYPE_COLOR = {
  diabetes: '#06b6d4',
  cardiac:  '#f43f5e',
  neuro:    '#6366f1',
  arthritis:'#f59e0b',
  default:  '#94a3b8',
};

const MedicationReminders = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const { data } = await api.get('/notifications');
        const meds = (data || [])
          .filter(n => n.type === 'medication' || n.category === 'medication')
          .slice(0, 5);
        setMedications(meds);
      } catch {
        setMedications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-base font-bold text-white mb-4">Medication Reminders</h2>
        <div className="glass-card rounded-2xl border border-white/8 p-6 text-center text-xs text-slate-400">Loading...</div>
      </section>
    );
  }

  if (medications.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">Medication Reminders</h2>
            <p className="text-xs text-slate-400 mt-0.5">No medication reminders</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl border border-white/8 p-6 text-center space-y-1">
          <p className="text-xs font-bold text-slate-300">No Active Medication Schedules</p>
          <p className="text-[10px] text-slate-500">Medication reminders will appear here after a diagnosis.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Medication Reminders</h2>
          <p className="text-xs text-slate-400 mt-0.5">Active medication schedule</p>
        </div>
        <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
          {medications.filter(m => m.is_read).length}/{medications.length} Acknowledged
        </span>
      </div>

      <div className="glass-card rounded-2xl border border-white/8 divide-y divide-white/5">
        {medications.map((med, idx) => {
          const color = TYPE_COLOR[med.type] || TYPE_COLOR.default;
          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors group"
            >
              {med.is_read ? (
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              ) : (
                <Circle size={18} className="text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
              )}

              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}
              >
                <Pill size={14} style={{ color }} />
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-bold truncate ${med.is_read ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                  {med.title || med.message}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{med.message}</p>
              </div>

              <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg shrink-0">
                <Clock size={10} className="text-slate-500" />
                <span className="text-[10px] font-bold text-slate-300">{med.created_at ? new Date(med.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MedicationReminders;

