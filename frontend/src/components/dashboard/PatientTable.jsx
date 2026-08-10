import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, Filter, Users, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const RISK_CONFIG = {
  Low:      { label: 'Low',      cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  Medium:   { label: 'Medium',   cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  High:     { label: 'High',     cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  Critical: { label: 'Critical', cls: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
};

const STATUS_CONFIG = {
  Stable:     { cls: 'bg-emerald-500/15 text-emerald-400' },
  Monitoring: { cls: 'bg-amber-500/15 text-amber-400' },
  Critical:   { cls: 'bg-rose-500/15 text-rose-400' },
  Discharged: { cls: 'bg-slate-500/15 text-slate-400' },
};

const PAGE_SIZE = 5;

const PatientTable = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortField, setSortField] = useState('visitDate');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/patients/');
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.full_name || p.name || 'Anonymous Patient',
          avatar: (p.full_name || p.name || 'P').split(' ').map((n) => n[0]).join('').substring(0, 2),
          age: p.age || 35,
          gender: p.gender || 'Not specified',
          visitDate: p.created_at ? new Date(p.created_at).toISOString().split('T')[0] : 'Today',
          disease: p.primary_condition || 'General Evaluation',
          symptoms: p.symptoms || ['General Checkup'],
          risk: p.risk_level || 'Low',
          status: p.status || 'Stable',
        }));
        setPatients(mapped);
      } else {
        setPatients([]);
      }
    } catch {
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const filtered = patients
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.disease.toLowerCase().includes(q) ||
        (Array.isArray(p.symptoms) && p.symptoms.join(' ').toLowerCase().includes(q));
      const matchRisk = riskFilter === 'all' || p.risk.toLowerCase() === riskFilter.toLowerCase();
      return matchSearch && matchRisk;
    })
    .sort((a, b) => {
      let va = a[sortField] ?? '', vb = b[sortField] ?? '';
      if (typeof va === 'string') va = va.toLowerCase();
      if (typeof vb === 'string') vb = vb.toLowerCase();
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortBtn = ({ field, label }) => (
    <button onClick={() => handleSort(field)} className="flex items-center gap-1 hover:text-white transition-colors group">
      {label}
      <span className={`text-[8px] ${sortField === field ? 'opacity-100' : 'opacity-30 group-hover:opacity-70'}`}>
        {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
      </span>
    </button>
  );

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-cyan-400" /> Patient Clinical Registry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} active records in database</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Refresh */}
          <button
            onClick={fetchPatients}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all"
            title="Refresh patient records"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search patients..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-44 transition-all"
            />
          </div>
          {/* Risk filter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <Filter size={11} className="text-slate-500 ml-1" />
            {['all', 'low', 'medium', 'high', 'critical'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRiskFilter(r);
                  setPage(1);
                }}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize transition-all ${
                  riskFilter === r ? 'bg-cyan-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 bg-white/3">
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">
                  <SortBtn field="name" label="Patient" />
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider hidden sm:table-cell">
                  <SortBtn field="age" label="Age" />
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider hidden md:table-cell">Gender</th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider hidden lg:table-cell">
                  <SortBtn field="visitDate" label="Registered Date" />
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider hidden xl:table-cell">Condition</th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">
                  <SortBtn field="risk" label="Risk" />
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <AnimatePresence mode="wait">
              <motion.tbody
                key={page + search + riskFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw size={24} className="animate-spin text-cyan-400 opacity-60" />
                        <p className="font-semibold text-slate-400">Loading patient records...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-30 text-cyan-400" />
                        <p className="font-bold text-slate-200">No Patients Found</p>
                        <p className="text-[11px] text-slate-400">
                          {search || riskFilter !== 'all'
                            ? 'No patient records match the selected filter parameters.'
                            : 'No patient accounts registered in the database.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((patient, idx) => {
                    const riskKey = patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1).toLowerCase();
                    const risk = RISK_CONFIG[riskKey] || RISK_CONFIG.Low;
                    const statusKey = patient.status.charAt(0).toUpperCase() + patient.status.slice(1).toLowerCase();
                    const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.Stable;

                    return (
                      <motion.tr
                        key={patient.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
                      >
                        {/* Patient */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-[10px] shrink-0">
                              {patient.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-slate-100">{patient.name}</p>
                              <p className="text-[10px] text-slate-500">{patient.disease}</p>
                            </div>
                          </div>
                        </td>
                        {/* Age */}
                        <td className="px-4 py-3 text-slate-300 font-semibold hidden sm:table-cell">{patient.age}y</td>
                        {/* Gender */}
                        <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{patient.gender}</td>
                        {/* Visit Date */}
                        <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{patient.visitDate}</td>
                        {/* Condition */}
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/8 text-slate-300 font-medium">
                            {patient.disease}
                          </span>
                        </td>
                        {/* Risk */}
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${risk.cls}`}>
                            {risk.label}
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${status.cls}`}>
                            {patient.status}
                          </span>
                        </td>
                        {/* Action */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all opacity-90 group-hover:opacity-100"
                          >
                            View <ArrowUpRight size={10} />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/8 bg-white/2">
            <p className="text-[11px] text-slate-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${
                    page === p ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PatientTable;
