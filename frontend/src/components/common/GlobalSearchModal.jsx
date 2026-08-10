import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, X, Users, Stethoscope, FileText, Brain, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const ICON_MAP = {
  Patient: Users,
  Doctor: Stethoscope,
  Report: FileText,
  Prediction: Brain,
  Appointment: Calendar,
};

export const GlobalSearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          /* Trigger via global handler if configured */
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/search/', { params: { q: query.trim() } });
        setResults(data.results);
      } catch (err) {
        console.error('Global search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const categories = [
    { key: 'patients', title: 'Patients', icon: Users, color: 'text-cyan-400' },
    { key: 'doctors', title: 'Doctors', icon: Stethoscope, color: 'text-indigo-400' },
    { key: 'reports', title: 'Reports', icon: FileText, color: 'text-amber-400' },
    { key: 'predictions', title: 'AI Predictions', icon: Brain, color: 'text-rose-400' },
    { key: 'appointments', title: 'Appointments', icon: Calendar, color: 'text-emerald-400' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="glass-card rounded-3xl border border-white/10 w-full max-w-2xl overflow-hidden shadow-2xl space-y-0"
        >
          {/* Top search bar */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-white/3">
            <Search size={18} className="text-cyan-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients, doctors, reports, predictions, appointments..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none font-medium"
            />
            {loading ? (
              <RefreshCw size={16} className="animate-spin text-slate-400 shrink-0" />
            ) : query ? (
              <button onClick={() => setQuery('')} className="p-1 text-slate-500 hover:text-white rounded-lg">
                <X size={16} />
              </button>
            ) : null}
            <button
              onClick={onClose}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider"
            >
              ESC
            </button>
          </div>

          {/* Results Area */}
          <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
            {!query.trim() ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Search size={32} className="mx-auto opacity-30 text-cyan-400" />
                <p className="text-xs font-bold text-slate-300">Global Clinical Intelligence Search</p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  Type a name, specialty, disease diagnosis, report title, or appointment note to query the platform.
                </p>
              </div>
            ) : results && Object.values(results).every((arr) => arr.length === 0) ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <X size={32} className="mx-auto opacity-30 text-rose-400" />
                <p className="text-xs font-bold text-slate-300">No Matching Records Found</p>
                <p className="text-[11px] text-slate-500">
                  No records match "{query}". Try checking your spelling or searching for a broader term.
                </p>
              </div>
            ) : (
              categories.map(({ key, title, icon: Icon, color }) => {
                const items = results?.[key] || [];
                if (items.length === 0) return null;

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-2">
                      <Icon size={12} className={color} /> {title} ({items.length})
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={`${key}_${item.id}`}
                          onClick={() => handleSelect(item.url)}
                          className="w-full text-left p-3 rounded-2xl bg-white/3 hover:bg-white/8 border border-white/5 hover:border-white/12 transition-all flex items-center justify-between group"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                              {item.title}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.subtitle}</p>
                          </div>
                          <ArrowRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSearchModal;
