import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, Check, Trash2, ShieldAlert, FileText, CalendarDays, RefreshCw } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import RippleButton from '../../components/ui/RippleButton';

const ICON_MAP = {
  info:      CalendarDays,
  warning:   ShieldAlert,
  emergency: ShieldAlert,
  lab:       FileText,
  health:    ShieldAlert,
  success:   Check,
};

const COLOR_MAP = {
  emergency: { dot: 'bg-rose-500', text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  lab:       { dot: 'bg-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  info:      { dot: 'bg-indigo-500', text: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  health:    { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  warning:   { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  success:   { dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotification } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
        >
          <RefreshCw size={24} />
        </motion.div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Alerts Catalog...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Bell className="text-cyan-400" /> Notifications & Alerts
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">{notifications.length} notifications logged</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <RippleButton
            variant="secondary"
            onClick={markAllNotificationsRead}
            className="px-4 py-2.5 text-xs font-bold gap-1.5 self-start sm:self-auto"
          >
            <Check size={13} /> Mark All Read
          </RippleButton>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-12 border border-white/8 text-center"
            >
              <Bell size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-550 mt-0.5">No new system messages or patient alerts.</p>
            </motion.div>
          ) : (
            notifications.map((notif, idx) => {
              const theme = COLOR_MAP[notif.type] || COLOR_MAP.info;
              const Icon = ICON_MAP[notif.type] || Bell;

              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`glass-card rounded-2xl p-4.5 border ${theme.bg} flex gap-4 items-start group relative
                    ${!notif.read ? 'ring-1 ring-cyan-500/20' : ''}`}
                >
                  {/* Read/Unread dot indicator */}
                  {!notif.read && (
                    <span className={`absolute top-4.5 right-4.5 w-2 h-2 rounded-full ${theme.dot} animate-pulse`} />
                  )}

                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl bg-white/4 flex items-center justify-center shrink-0 border border-white/5 ${theme.text}`}>
                    <Icon size={16} />
                  </div>

                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-100 leading-tight">{notif.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">{notif.message}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{notif.time || 'Logged recently'}</p>
                  </div>

                  {/* Single actions */}
                  <div className="flex items-center gap-1.5 self-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notif.read && (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white transition-all focus:outline-none"
                        title="Mark as read"
                      >
                        <Check size={12} />
                      </button>
                    )}
                    <button
                      onClick={() => clearNotification(notif.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-all focus:outline-none"
                      title="Clear alert"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
