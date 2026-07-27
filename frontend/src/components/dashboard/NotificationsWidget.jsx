import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertTriangle, Info, CheckCircle, ChevronRight, Clock } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const typeConfig = {
  error:   { icon: AlertTriangle, color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
  success: { icon: CheckCircle,   color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
  info:    { icon: Info,          color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20' },
};

export const NotificationsWidget = () => {
  const { notifications, markNotificationRead } = useUser();
  const navigate = useNavigate();
  const recent = notifications.slice(0, 4);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell size={17} className="text-cyan-400" />
          <h3 className="text-base font-bold text-slate-200 tracking-wide">Notifications</h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="bg-cyan-500 text-slate-900 font-extrabold text-[9px] px-1.5 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
        >
          View all <ChevronRight size={13} />
        </button>
      </div>

      <div className="space-y-2.5">
        {recent.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 border border-white/5 text-center">
            <Bell size={28} className="text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-semibold">No new notifications</p>
          </div>
        ) : (
          recent.map(({ id, title, message, type, time, read }, i) => {
            const cfg = typeConfig[type] || typeConfig.info;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                onClick={() => markNotificationRead(id)}
                className={`
                  flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer
                  transition-all duration-200 hover:scale-[1.01]
                  ${read ? 'bg-white/2 border-white/5' : `${cfg.bg} ${cfg.border}`}
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                  <Icon size={15} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-bold ${read ? 'text-slate-400' : 'text-slate-200'} leading-tight`}>
                      {title}
                    </span>
                    {!read && <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-0.5 animate-pulse" />}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{message}</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[9px] text-slate-600">
                    <Clock size={9} /> {time}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsWidget;
