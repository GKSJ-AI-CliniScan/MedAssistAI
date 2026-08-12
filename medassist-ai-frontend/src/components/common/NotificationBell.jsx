import { AnimatePresence, motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { timeAgo } from '../../utils/helpers';

/**
 * NotificationBell — dropdown showing notifications.
 * Fetches from /notifications when opened; gracefully handles empty/error.
 */
export default function NotificationBell({ notifications = [], onMarkAll, loading }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-all hover:bg-ink-50 hover:text-ink-800"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-glass"
          >
            <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
              <span className="text-sm font-semibold text-ink-900">Notifications</span>
              {unread > 0 && (
                <button
                  onClick={onMarkAll}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-8 text-center text-sm text-ink-400">Loading…</div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-ink-400">
                  You're all caught up.
                </div>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-ink-50 px-4 py-3 transition-colors hover:bg-ink-50 ${
                      !n.read ? 'bg-brand-50/40' : ''
                    }`}
                  >
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                        n.read ? 'bg-ink-200' : 'bg-brand-500'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink-800">{n.message || n.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{timeAgo(n.created_at || n.timestamp)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
