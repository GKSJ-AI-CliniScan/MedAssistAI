import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  History, Plus, Trash2, X, Edit3, Save, CheckCircle,
  Clock, AlertCircle, Activity, Pill, Syringe, Heart,
  ChevronDown, ChevronUp, Calendar, FileText, Filter
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import CustomModal from '../../components/common/CustomModal';

/* ─── Status config ─────────────────────────────────────────── */
const statusConfig = {
  Active:    { color: 'text-rose-400',    bg: 'bg-rose-500/10',    border: 'border-rose-500/25',    icon: AlertCircle, dot: 'bg-rose-400' },
  Chronic:   { color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/25',   icon: Clock,       dot: 'bg-amber-400' },
  Resolved:  { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', icon: CheckCircle, dot: 'bg-emerald-400' },
  Managed:   { color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    border: 'border-cyan-500/25',    icon: Activity,    dot: 'bg-cyan-400' },
};

/* ─── Category config ───────────────────────────────────────── */
const categoryConfig = {
  Condition:  { icon: Heart,   color: 'text-rose-400',    bg: 'bg-rose-500/10' },
  Surgery:    { icon: Syringe, color: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
  Medication: { icon: Pill,    color: 'text-amber-400',   bg: 'bg-amber-500/10' },
  Procedure:  { icon: FileText,color: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
};

const ALL_FILTERS = ['All', 'Active', 'Chronic', 'Resolved', 'Managed'];

/* ─── Timeline connector ────────────────────────────────────── */
const TimelineConnector = () => (
  <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
);

/* ─── History Entry Card ────────────────────────────────────── */
const HistoryEntry = ({ item, onDelete, index }) => {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[item.status] || statusConfig.Resolved;
  const category = categoryConfig[item.category] || categoryConfig.Condition;
  const StatusIcon = status.icon;
  const CategoryIcon = category.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="relative"
    >
      <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-white/12 transition-all duration-200 ml-2 group">
        {/* Timeline dot */}
        <div className={`absolute -left-1 top-6 w-3 h-3 rounded-full border-2 border-slate-900 ${status.dot}`} />

        <div className="flex items-start justify-between gap-3">
          {/* Left: Icon + Content */}
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-xl ${category.bg} border border-white/10 flex items-center justify-center shrink-0`}>
              <CategoryIcon size={18} className={category.color} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-bold text-slate-200 truncate">{item.condition}</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${status.bg} ${status.border} ${status.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {item.status}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 mb-2">
                <span className="flex items-center gap-1"><Calendar size={10} /> {item.diagnosedYear}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className={`font-semibold ${category.color}`}>{item.category}</span>
              </div>

              {item.notes && !expanded && (
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-1">{item.notes}</p>
              )}

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    <p className="text-xs text-slate-400 leading-relaxed">{item.notes}</p>
                    {item.medications && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.medications.map(m => (
                          <span key={m} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
                            💊 {m}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.doctor && (
                      <p className="text-[10px] text-slate-500">
                        <span className="text-slate-400 font-semibold">Treating Physician:</span> {item.doctor}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1.5 rounded-lg hover:bg-white/5 focus:outline-none"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="text-slate-600 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-rose-500/10 focus:outline-none opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Add Entry Form (inside modal) ────────────────────────── */
const AddEntryForm = ({ onAdd, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    onAdd({
      id: `h_${Date.now()}`,
      condition: data.condition,
      diagnosedYear: data.year,
      status: data.status,
      category: data.category,
      notes: data.notes,
      medications: data.medications ? data.medications.split(',').map(m => m.trim()).filter(Boolean) : [],
      doctor: data.doctor,
    });
    onClose();
    toast.success('Medical record added successfully!', { icon: '📋' });
  };

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all";
  const selectClass = "w-full bg-[#0d1425] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500/50 transition-all";
  const labelClass = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelClass}>Condition / Diagnosis *</label>
          <input {...register('condition', { required: true })} placeholder="e.g. Type 2 Diabetes" className={`${inputClass} ${errors.condition ? 'border-rose-500/50' : ''}`} />
          {errors.condition && <p className="text-xs text-rose-400 mt-1">This field is required</p>}
        </div>
        <div>
          <label className={labelClass}>Year Diagnosed *</label>
          <input {...register('year', { required: true })} type="number" min="1900" max={new Date().getFullYear()} placeholder="e.g. 2020" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Status *</label>
          <select {...register('status', { required: true })} className={selectClass}>
            <option value="" className="bg-slate-900">Select status</option>
            {['Active','Chronic','Resolved','Managed'].map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select {...register('category')} className={selectClass}>
            <option value="Condition" className="bg-slate-900">Condition</option>
            <option value="Surgery" className="bg-slate-900">Surgery</option>
            <option value="Medication" className="bg-slate-900">Medication</option>
            <option value="Procedure" className="bg-slate-900">Procedure</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Treating Doctor</label>
          <input {...register('doctor')} placeholder="Dr. Name" className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Medications (comma-separated)</label>
          <input {...register('medications')} placeholder="e.g. Metformin, Aspirin" className={inputClass} />
        </div>
        <div className="col-span-2">
          <label className={labelClass}>Clinical Notes</label>
          <textarea {...register('notes')} rows={3} placeholder="Additional clinical notes or observations..." className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all focus:outline-none">
          Cancel
        </button>
        <motion.button type="submit"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 focus:outline-none">
          Add Record
        </motion.button>
      </div>
    </form>
  );
};

/* ══════════════════════════════════════════════════════════════
   Main Medical History Page
══════════════════════════════════════════════════════════════ */
export const MedicalHistoryPage = () => {
  const { medicalHistory, addHistoryItem, deleteHistoryItem } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = medicalHistory.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.status === activeFilter;
    const matchesSearch = item.condition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total:    medicalHistory.length,
    active:   medicalHistory.filter(h => h.status === 'Active').length,
    chronic:  medicalHistory.filter(h => h.status === 'Chronic').length,
    resolved: medicalHistory.filter(h => h.status === 'Resolved').length,
  };

  return (
    <div className="space-y-6 pb-8">
      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Medical History</h1>
          <p className="text-slate-400 text-sm mt-0.5">Your complete clinical condition timeline</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 focus:outline-none"
        >
          <Plus size={15} /> Add Medical Record
        </motion.button>
      </motion.div>

      {/* ── Stat cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Records',    value: stats.total,    color: 'border-white/8',         textColor: 'text-slate-200' },
          { label: 'Active Conditions',value: stats.active,   color: 'border-rose-500/25',     textColor: 'text-rose-400' },
          { label: 'Chronic',          value: stats.chronic,  color: 'border-amber-500/25',    textColor: 'text-amber-400' },
          { label: 'Resolved',         value: stats.resolved, color: 'border-emerald-500/25',  textColor: 'text-emerald-400' },
        ].map(({ label, value, color, textColor }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`glass-card rounded-2xl p-4 border ${color}`}
          >
            <div className={`text-2xl font-extrabold ${textColor}`}>{value}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Search + Filter ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-4 border border-white/8 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conditions, notes…"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          {ALL_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all focus:outline-none
                ${activeFilter === f
                  ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Timeline ────────────────────────────────────── */}
      <div className="relative pl-8">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-white/10 to-transparent" />

        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-2xl p-12 border border-white/8 text-center"
            >
              <History size={40} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-semibold text-sm">No medical records found</p>
              <p className="text-slate-600 text-xs mt-1">
                {searchQuery || activeFilter !== 'All' ? 'Try a different filter or search.' : 'Add your first medical record using the button above.'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item, i) => (
                <HistoryEntry
                  key={item.id}
                  item={item}
                  index={i}
                  onDelete={(id) => {
                    deleteHistoryItem(id);
                    toast.info('Record removed.', { icon: '🗑️' });
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Add Record Modal ─────────────────────────── */}
      <CustomModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Medical Record"
        size="lg"
      >
        <AddEntryForm
          onAdd={addHistoryItem}
          onClose={() => setShowModal(false)}
        />
      </CustomModal>
    </div>
  );
};

export default MedicalHistoryPage;
