import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';

const PRIORITY_CONFIG = {
  urgent: { cls: 'bg-rose-500/15 text-rose-400 border-rose-500/30', label: 'Urgent' },
  normal: { cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', label: 'Normal' },
  low:    { cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30', label: 'Routine' },
};

const STATUS_CONFIG = {
  confirmed: { cls: 'text-emerald-400', dot: 'bg-emerald-400' },
  scheduled: { cls: 'text-emerald-400', dot: 'bg-emerald-400' },
  pending:   { cls: 'text-amber-400', dot: 'bg-amber-400' },
};

const AppointmentsWidget = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const data = await appointmentService.listMyAppointments();
        setAppointments(data || []);
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppts();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-white">Upcoming Appointments</h2>
          <p className="text-xs text-slate-400 mt-0.5">{appointments.length} active in schedule</p>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-white transition-colors"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/8 divide-y divide-white/5">
        {loading ? (
          <div className="p-6 text-center text-xs text-slate-400">Loading schedule...</div>
        ) : appointments.length === 0 ? (
          <div className="p-6 text-center space-y-1">
            <p className="text-xs font-bold text-slate-300">No Appointments Scheduled</p>
            <p className="text-[10px] text-slate-500">Book your first doctor appointment in the Appointments tab.</p>
          </div>
        ) : (
          appointments.slice(0, 4).map((appt, idx) => {
            const prioKey = (appt.priority || 'normal').toLowerCase();
            const priority = PRIORITY_CONFIG[prioKey] || PRIORITY_CONFIG.normal;
            const statKey = (appt.status || 'pending').toLowerCase();
            const status = STATUS_CONFIG[statKey] || STATUS_CONFIG.pending;
            const docName = appt.doctor_name || appt.doctor || 'Dr. Specialist';
            const avatar = docName.split(' ').map(n => n[0]).join('').substring(0, 2);

            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="flex items-center gap-3 p-4 hover:bg-white/3 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600 flex items-center justify-center text-white font-black text-[11px] shrink-0">
                  {avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[11px] font-bold text-slate-100 truncate">{docName}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${priority.cls}`}>
                      {priority.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{appt.doctor_specialty || appt.notes || 'Consultation'}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end mb-1">
                    <Clock size={10} className="text-slate-500" />
                    <span className="text-[11px] font-bold text-slate-200">{appt.date_time || appt.date || 'Today'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-[10px] font-semibold capitalize ${status.cls}`}>{appt.status || 'Scheduled'}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AppointmentsWidget;

