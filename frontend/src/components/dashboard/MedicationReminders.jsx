import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, CheckCircle2, Circle } from 'lucide-react';
import { mockMedications } from '../../data/mockDashboard';

const TYPE_COLOR = {
  diabetes: '#06b6d4',
  cardiac:  '#f43f5e',
  neuro:    '#6366f1',
  arthritis:'#f59e0b',
};

const MedicationReminders = () => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-base font-bold text-white">Medication Reminders</h2>
        <p className="text-xs text-slate-400 mt-0.5">Today's scheduled medications</p>
      </div>
      <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
        {mockMedications.filter(m => m.taken).length}/{mockMedications.length} Taken
      </span>
    </div>

    <div className="glass-card rounded-2xl border border-white/8 divide-y divide-white/5">
      {mockMedications.map((med, idx) => {
        const color = TYPE_COLOR[med.type] || '#94a3b8';
        return (
          <motion.div
            key={med.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.07 }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors group"
          >
            {/* Status icon */}
            {med.taken ? (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <Circle size={18} className="text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors" />
            )}

            {/* Med icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}20`, border: `1px solid ${color}30` }}
            >
              <Pill size={14} style={{ color }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-[11px] font-bold truncate ${med.taken ? 'text-slate-400 line-through' : 'text-slate-100'}`}>
                {med.medicine}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{med.patient} · {med.dosage}</p>
            </div>

            {/* Time chip */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg shrink-0">
              <Clock size={10} className="text-slate-500" />
              <span className="text-[10px] font-bold text-slate-300">{med.time}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </section>
);

export default MedicationReminders;
