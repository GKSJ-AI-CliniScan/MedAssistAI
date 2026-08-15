import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import { FileText, ArrowLeft, Download, Plus, Search, Filter, RefreshCw, FileCode, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import RippleButton from '../../components/ui/RippleButton';
import reportService from '../../services/reportService';

export const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  // Redirect non-patient users away from reports
  useEffect(() => {
    if (user && user.role !== 'patient') {
      toast.info('Reports are only available for patient accounts.', { icon: 'ℹ️' });
      navigate('/dashboard');
    }
  }, [user, navigate]);

  

  const fetchReports = async () => {
    if (!user || user.role !== 'patient') return;
    setLoading(true);
    try {
      const data = await reportService.getReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load reports:', err);
      toast.error(err?.response?.data?.detail || 'Could not retrieve report archives.', { icon: '🚫' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  const handleDownload = async (rep) => {
    setDownloadingId(rep.id);
    try {
      await reportService.downloadReportFile(rep.id, rep.file_name);
      toast.success(`Report downloaded: "${rep.file_name}"`, { icon: '📥' });
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download report PDF file.');
    } finally {
      setDownloadingId(null);
    }
  };

  const filtered = reports.filter((rep) => {
    const q = search.toLowerCase();
    const matchSearch = (rep.file_name || '').toLowerCase().includes(q) || (rep.report_type || '').toLowerCase().includes(q);
    const matchType = typeFilter === 'All' || rep.report_type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
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
              <FileText className="text-cyan-400" /> Diagnostic Reports Archive
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Clinical logs and generated PDF diagnostic documents</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReports}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all focus:outline-none flex items-center gap-1.5 text-xs font-bold"
            title="Refresh list"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <RippleButton
            variant="primary"
            onClick={() => navigate('/symptoms')}
            className="px-5 py-2.5 text-xs font-bold gap-1.5"
          >
            <Plus size={14} /> New Disease Analysis
          </RippleButton>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports by filename or type..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 shrink-0 overflow-x-auto">
          <Filter size={12} className="text-slate-500 ml-1.5 mr-0.5" />
          {['All', 'Clinical AI Summary', 'Lab Report', 'Pathology'].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
                ${typeFilter === type ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid / List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
            >
              <RefreshCw size={24} />
            </motion.div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">Loading Database Reports...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-3xl p-12 border border-white/8 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                  <FileCode size={32} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">No Reports Available</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    {search || typeFilter !== 'All'
                      ? 'No reports match your current search or filter criteria. Try resetting filters.'
                      : 'You do not have any saved medical reports yet. Generate a disease prediction report from the Symptom Analysis module.'}
                  </p>
                </div>
                {search || typeFilter !== 'All' ? (
                  <button
                    onClick={() => { setSearch(''); setTypeFilter('All'); }}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-cyan-400 transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/symptoms')}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-extrabold text-xs text-slate-950 uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
                  >
                    Start Symptom Analysis
                  </button>
                )}
              </motion.div>
            ) : (
              filtered.map((rep, idx) => (
                <motion.div
                  key={rep.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="glass-card rounded-2xl p-4 border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/15 transition-all group"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
                        {rep.file_name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 mt-1.5">
                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/8 font-medium">
                          Type: {rep.report_type || 'Clinical AI'}
                        </span>
                        <span className="bg-white/5 px-2 py-0.5 rounded border border-white/8 font-medium">
                          Size: {rep.size_kb ? `${rep.size_kb} KB` : 'PDF Document'}
                        </span>
                        <span className="text-slate-500">
                          Date: {new Date(rep.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                    <button
                      onClick={() => handleDownload(rep)}
                      disabled={downloadingId === rep.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/15 transition-all disabled:opacity-50"
                    >
                      {downloadingId === rep.id ? (
                        <>
                          <RefreshCw size={13} className="animate-spin" /> Downloading...
                        </>
                      ) : (
                        <>
                          <Download size={14} /> Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
