import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight, ArrowUpRight, Filter } from 'lucide-react';
import { mockPatients } from '../../data/mockDashboard';

const RISK_CONFIG = {
  low:      { label: 'Low',      cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  medium:   { label: 'Medium',   cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  high:     { label: 'High',     cls: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  critical: { label: 'Critical', cls: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
};

const STATUS_CONFIG = {
  stable:     { cls: 'bg-emerald-500/15 text-emerald-400' },
  monitoring: { cls: 'bg-amber-500/15 text-amber-400' },
  critical:   { cls: 'bg-rose-500/15 text-rose-400' },
  discharged: { cls: 'bg-slate-500/15 text-slate-400' },
};

const PAGE_SIZE = 5;

const PatientTable = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortField, setSortField] = useState('visitDate');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const filtered = mockPatients
    .filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.disease.toLowerCase().includes(q) || p.symptoms.join(' ').toLowerCase().includes(q);
      const matchRisk = riskFilter === 'all' || p.risk === riskFilter;
      return matchSearch && matchRisk;
    })
    .sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
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
          <h2 className="text-base font-bold text-white">Recent Patients</h2>
          <p className="text-xs text-slate-400 mt-0.5">{filtered.length} patients found</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search patients..."
              className="pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-44 transition-all"
            />
          </div>
          {/* Risk filter */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            <Filter size={11} className="text-slate-500 ml-1" />
            {['all', 'low', 'medium', 'high', 'critical'].map(r => (
              <button
                key={r}
                onClick={() => { setRiskFilter(r); setPage(1); }}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize transition-all ${riskFilter === r ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
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
                  <SortBtn field="visitDate" label="Visit Date" />
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-bold uppercase tracking-wider hidden xl:table-cell">Symptoms</th>
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
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={28} className="opacity-30" />
                        <p className="font-semibold">No patients found</p>
                        <p className="text-[11px]">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((patient, idx) => {
                    const risk = RISK_CONFIG[patient.risk] || RISK_CONFIG.low;
                    const status = STATUS_CONFIG[patient.status] || STATUS_CONFIG.stable;
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
                        {/* Symptoms */}
                        <td className="px-4 py-3 hidden xl:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {patient.symptoms.slice(0, 2).map(s => (
                              <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-white/8 text-slate-300 font-medium">{s}</span>
                            ))}
                          </div>
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
                            className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-bold transition-all ${page === p ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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
