import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, BedDouble, UserCheck, Siren } from 'lucide-react';
import { toast } from 'react-toastify';

const EmergencyPanel = () => {
  const handleEmergencyAlert = () => {
    toast.error('🚨 Emergency Alert Dispatched! ICU team notified. EMS contacted.', {
      autoClose: 6000,
      style: { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(244,63,94,0.4)', color: '#f8fafc' },
    });
  };

  const stats = [
    { label: 'Critical Patients', value: '4', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/15' },
    { label: 'ICU Beds Available', value: '7', icon: BedDouble, color: 'text-amber-400', bg: 'bg-amber-500/15' },
    { label: 'Doctors On Call', value: '12', icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
    { label: 'Emergency Hotline', value: '108', icon: Phone, color: 'text-cyan-400', bg: 'bg-cyan-500/15' },
  ];

  return (
    <section>
      <div className="relative glass-card rounded-2xl border border-rose-500/25 overflow-hidden p-5 bg-gradient-to-br from-rose-500/8 via-transparent to-transparent">
        {/* Background pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #f43f5e 0%, transparent 50%)' }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
              className="w-11 h-11 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center"
            >
              <Siren size={22} className="text-rose-400" />
            </motion.div>
            <div>
              <h2 className="text-base font-bold text-white">Emergency Panel</h2>
              <p className="text-xs text-rose-400/80 font-semibold">Real-time critical monitoring active</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleEmergencyAlert}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-rose-500/25 transition-all"
          >
            <Siren size={14} />
            DISPATCH EMERGENCY ALERT
          </motion.button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col gap-3 p-4 rounded-xl ${stat.bg} border border-white/8`}
              >
                <Icon size={18} className={stat.color} />
                <div>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EmergencyPanel;
