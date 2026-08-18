import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';
import { notificationApi } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * DashboardLayout — persistent shell for all authenticated pages.
 */
export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setNotifLoading(true);
    notificationApi
      .list()
      .then((data) => active && setNotifications(Array.isArray(data) ? data : data?.items || []))
      .catch(() => {})
      .finally(() => active && setNotifLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const handleMarkAll = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (e) {
      toast.error(e.message || 'Could not update notifications');
    }
  };

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Navbar
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          notifications={notifications}
          onMarkAll={handleMarkAll}
          notifLoading={notifLoading}
        />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
