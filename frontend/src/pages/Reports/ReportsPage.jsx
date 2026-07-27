import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Download, Eye, Plus, Search, Filter, RefreshCw, FileCode, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import RippleButton from '../../components/ui/RippleButton';

const mockReports = [
  { id: 'rep_1', name: 'Comprehensive Symptom Assessment', date: '2026-07-17', size: '240 KB', type: 'Clinical AI', patient: 'Priya Sharma' },
  { id: 'rep_2', name: 'Cardiovascular Risk Report', date: '2026-07-17', size: '1.2 MB', type: 'Pathology', patient: 'Arjun Mehta' },
  { id: 'rep_3', name: 'HbA1c Blood Panel Summary', date: '2026-07-16', size: '420 KB', type: 'Lab Report', patient: 'Rohan Das' },
  { id: 'rep_4', name: 'Seasonal Influenza Diagnostics Mappings', date: '2026-07-16', size: '185 KB', type: 'Clinical AI', patient: 'Sunita Reddy' },
  { id: 'rep_5', name: 'Rheumatic Factor Analysis Log', date: '2026-07-15', size: '310 KB', type: 'Lab Report', patient: 'Meera Joshi' },
];

export const ReportsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = (name) => {
    toast.success(`📥 Report downloaded: "${name}"`, {
      style: { background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(16,185,129,0.3)', color: '#f8fafc' },
    });
  };

  const filtered = mockReports.filter(rep => {
    const q = search.toLowerCase();
    const matchSearch = rep.name.toLowerCase().includes(q) || rep.patient.toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || rep.type === typeFilter;
    return matchSearch && matchType;
  });

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
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Fetching Health Reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <FileText className="text-cyan-400" /> Health Reports
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Clinical logs and generated diagnostics archives</p>
          </div>
        </div>

        <RippleButton
          variant="primary"
          onClick={() => navigate('/symptoms')}
          className="px-5 py-2.5 text-xs font-bold gap-1.5"
        >
          <Plus size={14} /> Create Analysis Report
        </RippleButton>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search report archives..."
            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0 overflow-x-auto">
          <Filter size={11} className="text-slate-500 ml-1.5 mr-0.5" />
          {['All', 'Clinical AI', 'Lab Report', 'Pathology'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all whitespace-nowrap
                ${typeFilter === type ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-3xl p-12 border border-white/8 text-center"
            >
              <FileCode size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">No Reports Found</p>
              <p className="text-xs text-slate-550 mt-0.5">Try adjusting your query or filter parameters.</p>
            </motion.div>
          ) : (
            filtered.map((rep, idx) => (
              <motion.div
                key={rep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-2xl p-4 border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/15 transition-all group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
                      {rep.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 leading-none">
                      Patient: <span className="text-slate-400 font-semibold">{rep.patient}</span> · Type: <span className="text-slate-400 font-semibold">{rep.type}</span> · {rep.size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-bold text-slate-400">
                  <span className="text-[10px] text-slate-550 hidden md:block">{rep.date}</span>
                  <button
                    onClick={() => handleDownload(rep.name)}
                    className="p-2 rounded-xl bg-white/4 hover:bg-white/10 hover:text-white transition-all focus:outline-none"
                    title="Download Report"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    onClick={() => toast.info(`👁️ Pre-rendering file: "${rep.name}"`)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-all focus:outline-none"
                  >
                    <Eye size={13} /> View
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsPage;
