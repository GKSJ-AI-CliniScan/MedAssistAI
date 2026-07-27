import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Brain, ShieldAlert, FileText, CalendarDays, Pill, LogOut } from 'lucide-react';
import { mockActivities } from '../../data/mockDashboard';

const ICON_MAP = { UserPlus, Brain, ShieldAlert, FileText, CalendarDays, Pill, LogOut };

const COLOR_MAP = {
  cyan:    { dot: 'bg-cyan-400',    ring: 'border-cyan-400/30',  text: 'text-cyan-400' },
  indigo:  { dot: 'bg-indigo-400',  ring: 'border-indigo-400/30',text: 'text-indigo-400' },
  rose:    { dot: 'bg-rose-400',    ring: 'border-rose-400/30',  text: 'text-rose-400' },
  emerald: { dot: 'bg-emerald-400', ring: 'border-emerald-400/30',text: 'text-emerald-400' },
  amber:   { dot: 'bg-amber-400',   ring: 'border-amber-400/30', text: 'text-amber-400' },
  purple:  { dot: 'bg-purple-400',  ring: 'border-purple-400/30',text: 'text-purple-400' },
  slate:   { dot: 'bg-slate-400',   ring: 'border-slate-400/30', text: 'text-slate-400' },
};

const RecentActivity = () => (
  <section>
    <div className="mb-4">
      <h2 className="text-base font-bold text-white">Recent Activity</h2>
      <p className="text-xs text-slate-400 mt-0.5">Live system event log</p>
    </div>

    <div className="glass-card rounded-2xl border border-white/8 p-4">
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-3 top-3 bottom-3 w-px bg-gradient-to-b from-cyan-500/50 via-white/10 to-transparent" />

        <div className="space-y-4">
          {mockActivities.map((activity, idx) => {
            const Icon = ICON_MAP[activity.icon] || FileText;
            const color = COLOR_MAP[activity.color] || COLOR_MAP.slate;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="flex items-start gap-3 group"
              >
                {/* Timeline dot */}
                <div className={`absolute left-1 w-4 h-4 rounded-full ${color.dot} border-2 border-slate-950 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-125 transition-transform`}
                  style={{ marginTop: `${idx * 4 + 0.5}rem` }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>

                <div className={`w-7 h-7 rounded-lg border ${color.ring} bg-white/4 flex items-center justify-center shrink-0`}>
                  <Icon size={13} className={color.text} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-slate-200 font-semibold leading-tight">{activity.text}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

export default RecentActivity;
