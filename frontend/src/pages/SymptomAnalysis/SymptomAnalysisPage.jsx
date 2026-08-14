import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Stethoscope, Activity, ChevronRight, X, Info, AlertCircle,
  Check, ArrowRight, Sparkles, RefreshCw, Search, Shield
} from 'lucide-react';
import RippleButton from '../../components/ui/RippleButton';

// Full symptom registry
const SYMPTOM_CATEGORIES = [
  {
    category: 'General',
    symptoms: [
      { id: 'fever', label: 'Fever', description: 'Elevated body temperature (above 38°C / 100.4°F)' },
      { id: 'fatigue', label: 'Fatigue', description: 'Persistent tiredness or lack of energy' },
      { id: 'weakness', label: 'Body Weakness', description: 'General loss of muscle strength' },
      { id: 'loss_appetite', label: 'Loss of Appetite', description: 'Decreased desire to eat or drink' },
      { id: 'weight_loss', label: 'Unintentional Weight Loss', description: 'Losing weight without trying' },
      { id: 'night_sweats', label: 'Night Sweats', description: 'Excessive sweating during sleep' }
    ]
  },
  {
    category: 'Respiratory',
    symptoms: [
      { id: 'cough', label: 'Cough', description: 'Persistent dry or productive cough' },
      { id: 'cold', label: 'Cold / Runny Nose', description: 'Nasal congestion or discharge' },
      { id: 'sore_throat', label: 'Sore Throat', description: 'Pain or irritation in the throat' },
      { id: 'shortness_breath', label: 'Shortness of Breath', description: 'Difficulty breathing or breathlessness' },
      { id: 'wheezing', label: 'Wheezing', description: 'High-pitched whistling sound while breathing' }
    ]
  },
  {
    category: 'Neurological',
    symptoms: [
      { id: 'headache', label: 'Headache', description: 'Mild to severe head pain or pressure' },
      { id: 'dizziness', label: 'Dizziness', description: 'Feeling lightheaded, unsteady, or faint' },
      { id: 'insomnia', label: 'Sleep Disturbance', description: 'Difficulty falling or staying asleep' },
      { id: 'confusion', label: 'Confusion / Brain Fog', description: 'Difficulty thinking clearly or concentrating' },
      { id: 'numbness', label: 'Numbness / Tingling', description: 'Loss of sensation or tingling in limbs' }
    ]
  },
  {
    category: 'Musculoskeletal',
    symptoms: [
      { id: 'body_pain', label: 'Body Pain / Aches', description: 'Widespread muscle soreness and pain' },
      { id: 'joint_pain', label: 'Joint Pain', description: 'Pain or stiffness in one or more joints' },
      { id: 'back_pain', label: 'Back Pain', description: 'Pain in the upper, middle, or lower back' },
      { id: 'swollen_joints', label: 'Swollen Joints', description: 'Visible swelling around joint areas' }
    ]
  },
  {
    category: 'Gastrointestinal',
    symptoms: [
      { id: 'nausea', label: 'Nausea', description: 'Feeling of queasiness or urge to vomit' },
      { id: 'vomiting', label: 'Vomiting', description: 'Forceful expulsion of stomach contents' },
      { id: 'diarrhea', label: 'Diarrhea', description: 'Loose or watery stools more than 3 times daily' },
      { id: 'abdominal_pain', label: 'Abdominal Pain', description: 'Pain or cramps in the stomach area' },
      { id: 'bloating', label: 'Bloating', description: 'Feeling of fullness or swollen abdomen' }
    ]
  },
  {
    category: 'Cardiovascular',
    symptoms: [
      { id: 'chest_pain', label: 'Chest Pain or Tightness', description: 'Pressure, squeezing, or discomfort in chest' },
      { id: 'palpitations', label: 'Heart Palpitations', description: 'Rapid, fluttering, or pounding heartbeat' },
      { id: 'swollen_legs', label: 'Swollen Legs / Ankles', description: 'Unusual fluid retention in lower extremities' }
    ]
  },
  {
    category: 'Skin',
    symptoms: [
      { id: 'skin_rash', label: 'Skin Rash', description: 'Redness, bumps, or irritated skin patches' },
      { id: 'itching', label: 'Itching', description: 'Persistent uncomfortable itching sensation' },
      { id: 'skin_discoloration', label: 'Skin Discoloration', description: 'Yellow tint (jaundice) or pale/bluish skin' }
    ]
  }
];

// Clinical symptom → condition mapping engine
const ANALYSIS_ENGINE = {
  // Infectious / General Illness
  patterns: [
    {
      symptoms: ['chest_pain', 'palpitations', 'swollen_legs', 'shortness_breath'],
      conditions: ['Cardiac Arrhythmia', 'Congestive Heart Failure', 'Coronary Artery Disease'],
      specialist: 'Cardiologist',
      riskLevel: 'High',
      urgency: 'Seek medical attention promptly'
    },
    {
      symptoms: ['chest_pain', 'shortness_breath'],
      conditions: ['Cardiovascular Concern', 'Pleurisy', 'Pulmonary Embolism'],
      specialist: 'Cardiologist',
      riskLevel: 'High',
      urgency: 'Consult a Cardiologist immediately'
    },
    {
      symptoms: ['skin_rash', 'itching', 'skin_discoloration'],
      conditions: ['Allergic Dermatitis', 'Eczema', 'Psoriasis', 'Contact Allergy'],
      specialist: 'Dermatologist',
      riskLevel: 'Low',
      urgency: 'Schedule a dermatology consultation'
    },
    {
      symptoms: ['headache', 'dizziness', 'confusion', 'numbness'],
      conditions: ['Migraine', 'Tension-Type Headache', 'Transient Ischemic Attack', 'Peripheral Neuropathy'],
      specialist: 'Neurologist',
      riskLevel: 'Moderate',
      urgency: 'Schedule a neurology consultation'
    },
    {
      symptoms: ['fever', 'cough', 'cold', 'sore_throat', 'fatigue'],
      conditions: ['Seasonal Influenza (Flu)', 'Upper Respiratory Infection', 'Viral Pharyngitis'],
      specialist: 'General Physician',
      riskLevel: 'Low',
      urgency: 'Schedule a general medicine consultation'
    },
    {
      symptoms: ['joint_pain', 'swollen_joints', 'back_pain', 'body_pain'],
      conditions: ['Rheumatoid Arthritis', 'Osteoarthritis', 'Ankylosing Spondylitis', 'Gout'],
      specialist: 'Orthopedic Surgeon',
      riskLevel: 'Moderate',
      urgency: 'Schedule an orthopedics consultation'
    },
    {
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal_pain'],
      conditions: ['Gastroenteritis', 'Irritable Bowel Syndrome', 'Peptic Ulcer Disease', 'Food Poisoning'],
      specialist: 'General Physician',
      riskLevel: 'Low',
      urgency: 'Consult a general physician or gastroenterologist'
    }
  ],

  analyze(selectedSymptomIds) {
    if (!selectedSymptomIds || selectedSymptomIds.length === 0) {
      return null;
    }

    // Score each pattern
    const scores = this.patterns.map(pattern => ({
      ...pattern,
      matchCount: pattern.symptoms.filter(s => selectedSymptomIds.includes(s)).length,
      totalSymptoms: selectedSymptomIds.length
    }));

    // Sort by relevance
    const sorted = scores.sort((a, b) => b.matchCount - a.matchCount);
    const best = sorted[0];

    if (best.matchCount === 0) {
      // Generic fallback
      return {
        conditions: ['Viral Infection', 'General Systemic Illness', 'Fatigue-Related Disorder'],
        specialist: 'General Physician',
        riskLevel: 'Low',
        urgency: 'Schedule a general physician consultation for clinical evaluation',
        matchScore: 0
      };
    }

    const riskMapping = { 'High': 3, 'Moderate': 2, 'Low': 1 };
    const overallRisk = best.riskLevel;

    return {
      conditions: best.conditions,
      specialist: best.specialist,
      riskLevel: overallRisk,
      urgency: best.urgency,
      matchScore: Math.round((best.matchCount / Math.max(best.symptoms.length, selectedSymptomIds.length)) * 100)
    };
  }
};

export const SymptomAnalysisPage = () => {
  const navigate = useNavigate();

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [step, setStep] = useState('select'); // 'select' | 'result'
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // All symptoms flat list
  const allSymptoms = SYMPTOM_CATEGORIES.flatMap(c =>
    c.symptoms.map(s => ({ ...s, category: c.category }))
  );

  const toggleSymptom = useCallback((symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  }, []);

  const removeSymptom = useCallback((symptomId) => {
    setSelectedSymptoms(prev => prev.filter(id => id !== symptomId));
  }, []);

  const filteredCategories = SYMPTOM_CATEGORIES.map(cat => ({
    ...cat,
    symptoms: cat.symptoms.filter(s =>
      !searchQuery.trim() ||
      s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.symptoms.length > 0);

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      toast.warning('Please select at least one symptom.', { icon: '⚠️' });
      return;
    }
    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 1800));
    const result = ANALYSIS_ENGINE.analyze(selectedSymptoms);
    setAnalysisResult(result);
    setStep('result');
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAnalysisResult(null);
    setStep('select');
    setSearchQuery('');
  };

  const handleFindSpecialist = () => {
    if (analysisResult?.specialist) {
      navigate(`/appointments?specialty=${encodeURIComponent(analysisResult.specialist)}`);
    } else {
      navigate('/appointments');
    }
  };

  const riskColors = {
    'High': { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30', dot: 'bg-rose-400' },
    'Moderate': { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', dot: 'bg-amber-400' },
    'Low': { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', dot: 'bg-emerald-400' }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <Stethoscope className="text-cyan-400" /> AI Symptom Analysis
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">
            Select your symptoms for an AI-driven clinical triage and specialist referral
          </p>
        </div>
        {step === 'result' && (
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-bold hover:bg-white/10 flex items-center gap-1.5 self-start"
          >
            <RefreshCw size={13} /> Start New Analysis
          </button>
        )}
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-xs text-amber-300">
        <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
        <div>
          <span className="font-bold block text-amber-300">Important Medical Disclaimer</span>
          <span className="text-[11px] text-slate-300 leading-relaxed">
            This AI symptom analysis is for informational and triage purposes only. Results show <strong className="text-amber-300">Possible Conditions</strong> — not confirmed diagnoses. Always consult a licensed medical professional for clinical diagnosis and treatment.
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Selected Symptoms Summary Chips */}
            {selectedSymptoms.length > 0 && (
              <div className="glass-card rounded-3xl p-5 border border-cyan-500/25 bg-cyan-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Check size={14} /> Selected Symptoms ({selectedSymptoms.length})
                  </h3>
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="text-xs text-slate-400 hover:text-slate-200 font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(id => {
                    const symptom = allSymptoms.find(s => s.id === id);
                    if (!symptom) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-bold"
                      >
                        {symptom.label}
                        <button
                          onClick={() => removeSymptom(id)}
                          className="text-cyan-400 hover:text-white transition-colors ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Symptom Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptoms (e.g. Fever, Chest Pain, Skin Rash)..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Symptom Category Grids */}
            {filteredCategories.map(category => (
              <div key={category.category} className="space-y-2.5">
                <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" /> {category.category} Symptoms
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {category.symptoms.map(symptom => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    return (
                      <motion.button
                        key={symptom.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 group
                          ${isSelected
                            ? 'bg-cyan-500/15 border-cyan-500/40 text-slate-100 shadow-sm ring-1 ring-cyan-500/20'
                            : 'bg-white/3 border-white/8 text-slate-400 hover:bg-white/5 hover:border-white/15'}`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all
                          ${isSelected
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'bg-transparent border-white/20 group-hover:border-cyan-500/50'}`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold ${isSelected ? 'text-cyan-200' : 'text-slate-200 group-hover:text-slate-100'}`}>
                            {symptom.label}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                            {symptom.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Analyze Button */}
            <div className="pt-4">
              <RippleButton
                variant="primary"
                disabled={selectedSymptoms.length === 0 || isAnalyzing}
                onClick={handleAnalyze}
                className="w-full py-4 text-sm font-bold rounded-2xl flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" /> Analyzing {selectedSymptoms.length} Symptoms...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} /> Analyze {selectedSymptoms.length > 0 ? `${selectedSymptoms.length} Selected` : ''} Symptoms
                  </>
                )}
              </RippleButton>
              {selectedSymptoms.length === 0 && (
                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Select at least one symptom from the categories above to start analysis
                </p>
              )}
            </div>
          </motion.div>
        )}

        {step === 'result' && analysisResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Result Header */}
            <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 relative overflow-hidden space-y-4">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-transparent pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    <Sparkles size={11} /> AI Clinical Triage Report
                  </div>
                  <h2 className="text-xl font-extrabold text-white">Analysis Complete</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on {selectedSymptoms.length} selected symptoms
                  </p>
                </div>

                {/* Risk Level Badge */}
                <div className={`p-3 rounded-2xl border ${riskColors[analysisResult.riskLevel]?.bg} ${riskColors[analysisResult.riskLevel]?.border} text-center`}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Risk Level</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-2 h-2 rounded-full ${riskColors[analysisResult.riskLevel]?.dot} animate-pulse`} />
                    <span className={`text-sm font-extrabold ${riskColors[analysisResult.riskLevel]?.text}`}>
                      {analysisResult.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Analyzed Symptoms Chips */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Analyzed Symptoms</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSymptoms.map(id => {
                    const s = allSymptoms.find(sym => sym.id === id);
                    return s ? (
                      <span key={id} className="px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 text-slate-200 text-xs font-semibold">
                        {s.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            {/* Possible Conditions */}
            <div className="glass-card rounded-3xl p-6 border border-white/8 space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">
                  Possible Conditions
                </h3>
                <span className="text-[10px] text-slate-500 font-medium normal-case">
                  (Not confirmed diagnoses — informational triage only)
                </span>
              </div>

              <div className="space-y-2">
                {analysisResult.conditions.map((condition, idx) => (
                  <div key={condition} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/3 border border-white/8">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0
                      ${idx === 0 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'}`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-100">{condition}</p>
                    </div>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/20">
                        Most Likely
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong>Urgency Note:</strong> {analysisResult.urgency}. These are possible conditions identified through pattern-based clinical triage, not confirmed diagnoses.
                </span>
              </div>
            </div>

            {/* Specialist Referral Card */}
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 via-slate-900/40 to-slate-950/80 space-y-4">
              <h3 className="text-sm font-extrabold text-cyan-400 flex items-center gap-2">
                <Stethoscope size={16} /> Recommended Specialist
              </h3>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/8">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-primary shrink-0">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-white">{analysisResult.specialist}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    AI-suggested specialist category based on symptom pattern matching
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <RippleButton
                  variant="primary"
                  onClick={handleFindSpecialist}
                  className="w-full py-4 text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-glow-primary/30"
                >
                  <Stethoscope size={16} /> Find {analysisResult.specialist} Near Me
                  <ArrowRight size={15} />
                </RippleButton>

                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/8 text-slate-300 text-xs font-bold transition-all"
                >
                  Analyze More Symptoms
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SymptomAnalysisPage;
