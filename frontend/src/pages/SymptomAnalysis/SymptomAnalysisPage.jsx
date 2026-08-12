import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Search, Stethoscope, Activity, Sparkles, ChevronRight,
  ChevronLeft, Trash2, ShieldAlert, Thermometer, Calendar,
  FileText, Check, AlertCircle, HeartPulse, X
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { usePrediction } from '../../hooks/usePrediction';
import { symptomService } from '../../services/symptomService';
import RippleButton from '../../components/ui/RippleButton';

const BODY_PARTS = ['All', 'Head', 'Chest', 'Abdomen', 'Limbs', 'General'];

const StepIndicator = ({ step }) => (
  <div className="flex items-center justify-between max-w-xs mx-auto mb-8">
    {[1, 2, 3].map((num) => (
      <React.Fragment key={num}>
        <div className="flex items-center justify-center">
          <motion.div
            className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center border transition-all duration-300
              ${step === num
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-500 shadow-glow-primary'
                : step > num
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-white/5 border-white/10 text-slate-500'
              }`}
            animate={{ scale: step === num ? 1.1 : 1 }}
          >
            {step > num ? <Check size={14} /> : num}
          </motion.div>
        </div>
        {num < 3 && (
          <div className="flex-1 mx-2 h-px bg-white/10 relative">
            <motion.div
              className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: step > num ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}
      </React.Fragment>
    ))}
  </div>
);

export const SymptomAnalysisPage = () => {
  const { symptomSession, clearSymptomSession, updateSymptomSession } = useUser();
  const { analyzeSymptoms, loading: isAnalyzing } = usePrediction();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [allSymptoms, setAllSymptoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('All');
  
  // Intake state
  const [selectedSymptoms, setSelectedSymptoms] = useState(symptomSession.selectedSymptoms || []);
  const [severity, setSeverity] = useState(symptomSession.severity || 'mild');
  const [duration, setDuration] = useState(symptomSession.duration || 3);
  const [notes, setNotes] = useState(symptomSession.notes || '');

  // Load symptoms catalog
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const data = await symptomService.getSymptoms();
        setAllSymptoms(data);
      } catch (err) {
        toast.error('Failed to load symptoms catalog.');
      }
    };
    fetchSymptoms();
  }, []);

  // Filter symptoms based on search and body part
  const filteredSymptoms = allSymptoms.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.synonyms.some(syn => syn.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPart = selectedBodyPart === 'All' || s.bodyPart?.toLowerCase() === selectedBodyPart.toLowerCase();
    return matchesSearch && matchesPart;
  });

  const handleToggleSymptom = (symptom) => {
    if (selectedSymptoms.some(s => s.id === symptom.id)) {
      setSelectedSymptoms(prev => prev.filter(s => s.id !== symptom.id));
    } else {
      if (selectedSymptoms.length >= 10) {
        toast.warning('You can select a maximum of 10 symptoms per analysis session.');
        return;
      }
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };

  const handleRemoveSymptom = (id) => {
    setSelectedSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
    clearSymptomSession();
    toast.info('Session inputs cleared.');
  };

  const handleNextStep = () => {
    if (step === 1 && selectedSymptoms.length === 0) {
      toast.warning('Please select at least one symptom to continue.');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => setStep(prev => prev - 1);

  const handleSubmitAnalysis = async () => {
    try {
      await analyzeSymptoms(selectedSymptoms, severity, duration, notes);
      toast.success('Clinical AI Analysis Complete!');
      navigate('/prediction');
    } catch (err) {
      console.error('Analysis error:', err);
      toast.error(err?.response?.data?.detail || 'Analysis failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Stethoscope className="text-cyan-400" /> Symptom Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Clinical diagnostic intake interface</p>
        </div>
        {selectedSymptoms.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-rose-400 font-bold transition-all focus:outline-none flex items-center gap-1.5 self-start md:self-auto"
          >
            <Trash2 size={13} /> Reset Intake Session
          </button>
        )}
      </div>

      {/* ── Stepper ── */}
      <StepIndicator step={step} />

      {/* ── Steps Card ── */}
      <div className="glass-card rounded-3xl p-6 border border-white/8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/1 to-white/3 pointer-events-none rounded-3xl" />

        <AnimatePresence mode="wait">
          {/* STEP 1: SYMPTOMS SELECTION */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-200">Select Symptoms</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select up to 10 clinical symptoms you are currently experiencing</p>
              </div>

              {/* Search & Body Part Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search symptoms (e.g. Migraine, Fever, Cough)..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {BODY_PARTS.map(part => (
                    <button
                      key={part}
                      onClick={() => setSelectedBodyPart(part)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all focus:outline-none
                        ${selectedBodyPart === part
                          ? 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      {part}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[250px] overflow-y-auto pr-1">
                {filteredSymptoms.map(symptom => {
                  const isSelected = selectedSymptoms.some(s => s.id === symptom.id);
                  return (
                    <motion.button
                      key={symptom.id}
                      onClick={() => handleToggleSymptom(symptom)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2
                        ${isSelected
                          ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/5 border-cyan-500/30 text-cyan-300'
                          : 'bg-white/3 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/5'
                        }`}
                    >
                      <span className="font-semibold truncate">{symptom.name}</span>
                      {isSelected && <Check size={13} className="text-cyan-400 shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Selected Symptoms list */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Selected Symptoms ({selectedSymptoms.length})
                  </span>
                  <span className="text-[10px] text-slate-500">Max: 10</span>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {selectedSymptoms.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No symptoms selected yet. Use the search catalog above.</p>
                  ) : (
                    selectedSymptoms.map(s => (
                      <motion.div
                        key={s.id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold"
                      >
                        {s.name}
                        <button
                          onClick={() => handleRemoveSymptom(s.id)}
                          className="text-cyan-400 hover:text-cyan-200 focus:outline-none"
                        >
                          <X size={12} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: DETAILS INTAKE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-200">Symptom Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Specify severity, duration, and observations</p>
              </div>

              {/* Severity Selector */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Thermometer size={12} /> Overall Severity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'mild', label: 'Mild', desc: 'Barely noticeable, stable', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' },
                    { val: 'medium', label: 'Moderate', desc: 'Noticeable, uncomfortable', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' },
                    { val: 'severe', label: 'Severe', desc: 'Intense pain, limits activity', color: 'border-rose-500/30 text-rose-400 bg-rose-500/5' }
                  ].map(item => {
                    const isSel = severity === item.val;
                    return (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setSeverity(item.val)}
                        className={`p-4 rounded-2xl border text-left transition-all duration-200 focus:outline-none flex flex-col gap-1
                          ${isSel
                            ? `${item.color} shadow-glass-sm ring-1 ring-current`
                            : 'bg-white/3 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/5'
                          }`}
                      >
                        <span className="text-sm font-bold">{item.label}</span>
                        <span className="text-[10px] opacity-70 leading-tight">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={12} /> Duration (Days)
                  </label>
                  <span className="text-xs font-bold text-cyan-400">{duration} {duration === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="flex items-center gap-4 bg-white/3 border border-white/5 rounded-2xl p-4">
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value))}
                    className="flex-1 accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDuration(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-slate-200"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuration(prev => Math.min(14, prev + 1))}
                      className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Observations / Notes */}
              <div className="space-y-2.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText size={12} /> Clinical Observations / Notes
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe your symptoms in more detail (e.g. starts after eating, worse in the morning, accompanied by dizziness)..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & TRIGGER ANALYSIS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-200">Review & Submit</h2>
                <p className="text-xs text-slate-500 mt-0.5">Please review your clinical session details below</p>
              </div>

              {/* Summary Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Symptom Checklist</h3>
                  <div className="flex flex-wrap gap-1.5 max-h-[140px] overflow-y-auto">
                    {selectedSymptoms.map(s => (
                      <span key={s.id} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-3.5">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assessment Criteria</h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Severity</span>
                    <span className={`text-xs font-bold uppercase ${
                      severity === 'severe' ? 'text-rose-400' : severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{severity}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-2">
                    <span className="text-xs text-slate-400">Duration</span>
                    <span className="text-xs font-bold text-cyan-400">{duration} {duration === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div className="border-t border-white/5 pt-2 flex flex-col gap-1">
                    <span className="text-xs text-slate-400">Notes</span>
                    <p className="text-xs text-slate-300 leading-relaxed italic truncate max-w-full">
                      {notes || 'No notes added'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secure Notice */}
              <div className="flex items-start gap-3 bg-cyan-500/5 border border-cyan-500/15 rounded-2xl p-4">
                <AlertCircle size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  <strong>Data Security Statement:</strong> Symptom logs are hashed and analyzed using local mock datasets. No clinical data leaves your local context.
                </p>
              </div>

              {/* Animated processing indicator */}
              {isAnalyzing && (
                <div className="flex flex-col items-center justify-center gap-4 py-6 border-t border-white/5">
                  <div className="relative w-14 h-14">
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-glow-primary"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <HeartPulse size={24} />
                    </motion.div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold text-slate-200">Executing Clinical AI Models</p>
                    <p className="text-xs text-slate-500">Mapping symptom correlations and scoring risk indicators...</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Actions Footer ── */}
        {!isAnalyzing && (
          <div className="flex justify-between items-center pt-5 border-t border-white/5 mt-6">
            {step > 1 ? (
              <RippleButton
                variant="secondary"
                onClick={handlePrevStep}
                className="px-5 py-2.5 text-xs font-bold gap-1.5"
              >
                <ChevronLeft size={14} /> Back
              </RippleButton>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <RippleButton
                variant="primary"
                onClick={handleNextStep}
                className="px-6 py-2.5 text-xs font-bold gap-1.5"
              >
                Next <ChevronRight size={14} />
              </RippleButton>
            ) : (
              <RippleButton
                variant="primary"
                onClick={handleSubmitAnalysis}
                className="px-8 py-3 text-xs font-bold gap-1.5"
              >
                Start AI Analysis <Sparkles size={14} />
              </RippleButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomAnalysisPage;
