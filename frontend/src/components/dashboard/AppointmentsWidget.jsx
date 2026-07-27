import React from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockAppointments } from '../../data/mockDashboard';

const PRIORITY_CONFIG = {
  urgent: { cls: 'bg-rose-500/15 text-rose-400 border-rose-500/30', label: 'Urgent' },
  normal: { cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', label: 'Normal' },
  low:    { cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30', label: 'Routine' },
};

const STATUS_CONFIG = {
  confirmed: { cls: 'text-emerald-400', dot: 'bg-emerald-400' },
  pending:   { cls: 'text-amber-400', dot: 'bg-amber-400' },
};

const AppointmentsWidget = () => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Upcoming Appointments</h2>
          <p className="text-xs text-slate-400 mt-0.5">{mockAppointments.length} scheduled today & tomorrow</p>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-white transition-colors"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/8 divide-y divide-white/5">
        {mockAppointments.map((appt, idx) => {
          const priority = PRIORITY_CONFIG[appt.priority] || PRIORITY_CONFIG.normal;
          const status = STATUS_CONFIG[appt.status] || STATUS_CONFIG.pending;

          return (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="flex items-center gap-3 p-4 hover:bg-white/3 transition-colors group"
            >
              {/* Doctor avatar */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-white font-black text-[11px] shrink-0">
                {appt.avatarDoctor}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[11px] font-bold text-slate-100 truncate">{appt.doctor}</p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${priority.cls}`}>
                    {priority.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">Patient: {appt.patient} · {appt.doctorSpecialty}</p>
              </div>

              {/* Time & status */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1.5 justify-end mb-1">
                  <Clock size={10} className="text-slate-500" />
                  <span className="text-[11px] font-bold text-slate-200">{appt.time}</span>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  <span className={`text-[10px] font-semibold capitalize ${status.cls}`}>{appt.status}</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-0.5">{appt.date}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default AppointmentsWidget;
