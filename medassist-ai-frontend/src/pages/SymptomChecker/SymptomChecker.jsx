import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Search,
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Activity,
  Brain,
  HeartPulse,
  Eye,
  Bone,
  Wind,
  Thermometer,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Progress from '../../components/ui/Progress';
import Badge from '../../components/ui/Badge';
import { symptomApi } from '../../services/api';
import { useDebounce } from '../../hooks/useDebounce';

const categoryIcons = {
  General: Activity,
  Neurological: Brain,
  Cardiac: HeartPulse,
  Respiratory: Wind,
  'ENT & Throat': Eye,
  Musculoskeletal: Bone,
  Fever: Thermometer,
};

export default function SymptomChecker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);
  const [catError, setCatError] = useState(null);
  const [activeCat, setActiveCat] = useState('General');

  const [allSymptoms, setAllSymptoms] = useState([]);
  const [symptomsLoading, setSymptomsLoading] = useState(true);
  const [symptomsError, setSymptomsError] = useState(null);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState([]);
  const [duration, setDuration] = useState('1-3 days');
  const [severity, setSeverity] = useState('moderate');
  const [analyzing, setAnalyzing] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  // Load categories on mount
  useEffect(() => {
    let active = true;
    setCatLoading(true);
    symptomApi
      .getCategories()
      .then((d) => {
        if (!active) return;
        const cats = Array.isArray(d) ? d : d?.categories || d?.items || [];
        setCategories(cats);
        if (cats.length) setActiveCat(cats[0]);
      })
      .catch((e) => active && setCatError(e.message || 'Could not load categories.'))
      .finally(() => active && setCatLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // Load symptoms for the active category
  useEffect(() => {
    if (!activeCat) return;
    let active = true;
    setSymptomsLoading(true);
    setSymptomsError(null);
    symptomApi
      .getAllSymptoms()
      .then((d) => {
        if (!active) return;
        const items = (Array.isArray(d) ? d : d?.symptoms || d?.items || []).map(
          (item, index) => ({
            id: item.id || item.key || index,
            name: item.name || item.display_name,
            category: item.category,
          })
        );

        setAllSymptoms(items);
        setAllSymptoms(items);
      })
      .catch((e) => {
        if (!active) return;
        setSymptomsError(e.message || 'Could not load symptoms.');
        setAllSymptoms([]);
      })
      .finally(() => active && setSymptomsLoading(false));
    return () => {
      active = false;
    };
  }, [activeCat]);

  // Search symptoms (debounced)
  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    symptomApi
      .searchSymptoms(debouncedSearch)
      .then((d) => {
        const items = (Array.isArray(d) ? d : d?.symptoms || d?.items || []).map(
  (item, index) => ({
    id: item.id || item.key || index,
    name:
      item.name ||
      item.symptom ||
      item.display_name ||
      item.label ||
      item.key,

    category:
      item.category ||
      item.group ||
      item.type ||
      "General",
  })
);

console.log(items);

        setSearchResults(items);
      })
      .catch(() => setSearchResults([]))
      .finally(() => setSearching(false));
  }, [debouncedSearch]);

  const categoryKeywords = {
  General: [],
  Cardiology: ["chest", "heart", "palpitations", "pulse", "cardiac"],
  Pulmonology: ["cough", "breath", "breathing", "lung", "asthma", "wheezing"],
  Dermatology: ["skin", "rash", "itch", "eczema", "acne", "blister"],
  Gastroenterology: ["stomach", "abdomen", "nausea", "vomit", "diarrhea", "constipation"],
};

console.log("Active Category:", activeCat);
console.log(
  allSymptoms.filter((s) => s.category === activeCat)
);

const displaySymptoms = allSymptoms.filter((s) => {
  const searchText = (s.name || "").toLowerCase();

const matchesSearch =
  search.trim() === "" ||
  searchText.includes(search.toLowerCase());

  const matchesCategory =
  !activeCat || s.category === activeCat;

  return matchesSearch && matchesCategory;
});

  const toggle = (sym) => {
    const key = sym.id ?? sym.name;

    const exists = selected.find(
      (s) => (s.id ?? s.name) === key
    );

    if (exists) {
      setSelected(
        selected.filter((s) => (s.id ?? s.name) !== key)
      );
    } else {
      setSelected([...selected, sym]);
    }
  };

  const isSelected = (sym) =>
    selected.some(
      (s) => (s.id ?? s.name) === (sym.id ?? sym.name)
    );

  const handleAnalyze = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one symptom');
      return;
    }
    setAnalyzing(true);
    try {
      const payload = {
        symptoms: selected.map((s) => s.name || s.id),
        symptom_ids: selected.map((s) => s.id),
        duration,
        severity,
      };
      const res = await symptomApi.predict(payload);
      const id = res.id || res.prediction_id;
      if (id) {
        navigate(`/prediction/${id}`);
      } else {
        // If backend returns inline result, stash and navigate
        sessionStorage.setItem('last_prediction', JSON.stringify(res));
        navigate('/prediction/result');
      }
    } catch (e) {
      toast.error(e.message || 'Could not analyze symptoms. Is the backend running?');
    } finally {
      setAnalyzing(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          <Stethoscope className="h-3.5 w-3.5" /> Symptom Checker
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-ink-900">Let's analyze your symptoms</h1>
        <p className="mt-1 text-ink-500">Tell us how you're feeling and our AI will assess possible conditions.</p>
      </div>

      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-500">
          <span>Step {step} of 3</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      <AnimatePresence mode="wait">
        {/* ---- Step 1: Select symptoms ---- */}
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symptoms (e.g. headache, fever)…"
                className="input-base h-12 pl-12 text-base"
                autoFocus
              />
              {searching && <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-ink-400" />}
            </div>

            {/* Categories */}
            {!search.trim() && (
              <>
                {catLoading ? (
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="skeleton h-10 w-24 rounded-xl" />
                    ))}
                  </div>
                ) : catError ? (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    <AlertCircle className="h-4 w-4" /> {catError}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => {
                      const Icon = categoryIcons[c] || Activity;
                      const active = activeCat === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setActiveCat(c)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${active
                              ? 'border-brand-600 bg-brand-50 text-brand-700'
                              : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                            }`}
                        >
                          <Icon className="h-4 w-4" /> {c}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Symptom cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {symptomsLoading && !search.trim() ? (
                [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton h-16 w-full rounded-xl" />)
              ) : symptomsError && !search.trim() ? (
                <div className="col-span-full flex items-center gap-2 py-12 text-center text-sm text-amber-600">
                  <AlertCircle className="h-5 w-5" /> {symptomsError}
                </div>
              ) : displaySymptoms.length === 0 ? (
                <div className="col-span-full py-12 text-center text-sm text-ink-400">
                  {search.trim() ? 'No symptoms found. Try a different term.' : 'No symptoms in this category.'}
                </div>
              ) : (
                displaySymptoms.map((s, i) => {
                  const sel = isSelected(s);
                  return (
                    <motion.button
                      key={s.id ?? s.name ?? i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => toggle(s)}
                      className={`group relative flex items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${sel
                          ? 'border-brand-600 bg-brand-50 shadow-glow'
                          : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50'
                        }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${sel ? 'border-brand-600 bg-brand-600' : 'border-ink-300 bg-white'
                          }`}
                      >
                        {sel && <Check className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${sel ? 'text-brand-700' : 'text-ink-700'}`}>
                        {s.name}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Selected summary */}
            {selected.length > 0 && (
              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-800">
                    Selected ({selected.length})
                  </span>
                  <button onClick={() => setSelected([])} className="text-xs font-medium text-brand-600 hover:text-brand-700">
                    Clear all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.map((s) => (
                    <span key={s.id ?? s.name} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-ink-700 shadow-soft">
                      {s.name}
                      <button onClick={() => toggle(s)} className="text-ink-400 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="gradient" size="lg" disabled={selected.length === 0} onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- Step 2: Duration & severity ---- */}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
              <h3 className="text-base font-semibold text-ink-900">How long have you had these symptoms?</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {['< 1 day', '1-3 days', '4-7 days', '> 1 week'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`rounded-xl border p-4 text-sm font-medium transition-all ${duration === d ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
              <h3 className="text-base font-semibold text-ink-900">How severe are your symptoms?</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { val: 'mild', label: 'Mild', desc: 'Noticeable but not disruptive', tone: 'success' },
                  { val: 'moderate', label: 'Moderate', desc: 'Affects daily activities', tone: 'warning' },
                  { val: 'severe', label: 'Severe', desc: 'Significantly impacting life', tone: 'error' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSeverity(s.val)}
                    className={`rounded-xl border p-4 text-left transition-all ${severity === s.val ? 'border-brand-600 bg-brand-50 shadow-glow' : 'border-ink-200 bg-white hover:bg-ink-50'
                      }`}
                  >
                    <Badge tone={s.tone}>{s.label}</Badge>
                    <p className="mt-2 text-xs text-ink-500">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" size="lg" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="gradient" size="lg" onClick={() => setStep(3)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ---- Step 3: Review & analyze ---- */}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-600" />
                <h3 className="text-base font-semibold text-ink-900">Review your assessment</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Symptoms</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.map((s) => (
                      <Badge key={s.id} tone="brand">{s.name}</Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-ink-100 pt-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Duration</p>
                    <p className="mt-1 text-sm font-semibold text-ink-800">{duration}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Severity</p>
                    <p className="mt-1 text-sm font-semibold capitalize text-ink-800">{severity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs text-amber-700">
              This AI assessment is for informational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional.
            </div>

            <div className="flex justify-between">
              <Button variant="secondary" size="lg" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="gradient" size="lg" loading={analyzing} onClick={handleAnalyze}>
                <Sparkles className="h-4 w-4" /> Analyze with AI
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
