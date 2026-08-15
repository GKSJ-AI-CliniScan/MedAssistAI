import React, { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import ModTag from '../../../components/ui/ModTag';
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle, 
  Search, 
  X, 
  Trash2, 
  Zap,
  Info
} from 'lucide-react';
import { getSymptoms } from '../../../services/api/symptoms';
import { runPredictionModel } from '../../../services/api/predictions';
import { useNavigate } from 'react-router-dom';

export default function PatientSymptomCheckerPage() {
  const navigate = useNavigate();
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAvailableSymptoms();
  }, []);

  const fetchAvailableSymptoms = async () => {
    try {
      setLoading(true);
      const data = await getSymptoms();
      setAvailableSymptoms(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Unable to load symptom database. Please try again later.');
      console.error('Error fetching symptoms:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleClearAll = () => {
    setSelectedSymptoms([]);
  };

  const filteredSymptoms = availableSymptoms.filter(symptom => {
    const symptomName = symptom.name || symptom;
    return String(symptomName).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to analyze.');
      return;
    }

    try {
      setAnalyzing(true);
      setError(null);
      
      const prediction = await runPredictionModel({ symptoms: selectedSymptoms });
      
      // Navigate to prediction results page with the prediction data and selected symptoms
      navigate('/patient/prediction', { state: { prediction, symptoms: selectedSymptoms } });
    } catch (err) {
      setError('Analysis failed. Please try again later.');
      console.error('Error analyzing symptoms:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[#06B6D4]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-clinical-textLight dark:text-clinical-textDark tracking-tight">
            Symptom Assessment
          </h1>
          <p className="text-xs text-clinical-mutedLight dark:text-clinical-mutedDark mt-0.5">
            AI-driven multi-symptom clinical evaluation and differential diagnostic screening
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ModTag variant="ai">AI Engine Active</ModTag>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Fast Inference
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <Button variant="primary" size="small" onClick={fetchAvailableSymptoms} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card 
            title="Symptom Selector" 
            subtitle="Choose your active clinical manifestations"
            variant="ai"
          >
            <div className="space-y-4">
              
              {/* Search bar + Quick actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clinical-mutedLight dark:text-clinical-mutedDark" />
                  <input
                    type="text"
                    placeholder="Search from 54 clinical symptoms (e.g. fever, headache, chest pain)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-clinical-tealDark/20 bg-white dark:bg-clinical-bgDarkSec text-xs text-clinical-textLight dark:text-clinical-textDark focus:outline-none focus:border-[#06B6D4]"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {selectedSymptoms.length > 0 && (
                  <Button
                    variant="outline"
                    size="small"
                    onClick={handleClearAll}
                    className="gap-1.5 text-xs text-red-500 border-red-200 dark:border-red-900 py-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear ({selectedSymptoms.length})</span>
                  </Button>
                )}
              </div>

              {/* Selected symptoms display tags */}
              {selectedSymptoms.length > 0 && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-[#06B6D4]/5 dark:bg-[#06B6D4]/10 border border-[#06B6D4]/20">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#06B6D4] uppercase tracking-wider">
                      Selected Clinical Indicators ({selectedSymptoms.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selectedSymptoms.map((symptom) => (
                      <div 
                        key={symptom} 
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#06B6D4]/15 text-[#06B6D4] text-xs font-semibold border border-[#06B6D4]/30"
                      >
                        <span>{symptom}</span>
                        <button 
                          onClick={() => toggleSymptom(symptom)} 
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available symptoms grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {filteredSymptoms.length > 0 ? (
                  filteredSymptoms.map((symptom, index) => {
                    const name = symptom.name || symptom;
                    const isSelected = selectedSymptoms.includes(name);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleSymptom(name)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#06B6D4]/15 border-[#06B6D4] text-[#06B6D4] font-semibold shadow-sm'
                            : 'bg-slate-50 dark:bg-clinical-bgDarkSec border-slate-200 dark:border-clinical-tealDark/20 text-clinical-textLight dark:text-clinical-textDark hover:border-[#06B6D4]/50'
                        }`}
                      >
                        <span className="text-xs truncate">{name}</span>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#06B6D4]' : 'text-slate-300 dark:text-slate-600'}`} />
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8 text-clinical-mutedLight dark:text-clinical-mutedDark text-xs">
                    {searchTerm ? 'No symptoms match your search.' : 'No symptoms available.'}
                  </div>
                )}
              </div>

              {/* Analyze Action Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Button 
                  variant="primary" 
                  onClick={handleAnalyze} 
                  disabled={analyzing || selectedSymptoms.length === 0}
                  className="gap-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white py-2.5 px-6 shadow-md"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Clinical Vectors...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4" />
                      <span>Analyze Symptoms ({selectedSymptoms.length})</span>
                    </>
                  )}
                </Button>
                
                <div className="flex items-center gap-1.5 text-[11px] text-clinical-mutedLight dark:text-clinical-mutedDark">
                  <Sparkles className="w-3.5 h-3.5 text-[#06B6D4]" />
                  <span>Ensemble AI Inference (~0.5s)</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Diagnostic Protocol" subtitle="How AI evaluates symptoms">
            <div className="space-y-3.5 text-xs text-clinical-mutedLight dark:text-clinical-mutedDark leading-relaxed">
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark block">Select Multiple Symptoms</span>
                  <span>Select all current indicators for higher multi-class diagnostic precision.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark block">Ensemble ML Scoring</span>
                  <span>RandomForest, XGBoost, and LightGBM models evaluate 773 condition pathways.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <span className="font-semibold text-clinical-textLight dark:text-clinical-textDark block">Physician Consultation</span>
                  <span>Results are automatically archived to share directly with your certified doctor.</span>
                </div>
              </div>
            </div>
          </Card>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
              <Info className="w-4 h-4 shrink-0" />
              <span>Clinical Notice</span>
            </div>
            <p className="text-[11px] text-amber-600 dark:text-amber-300/80 leading-relaxed">
              This AI assessment assists primary triage. If experiencing severe chest pain, shortness of breath, or loss of consciousness, seek immediate emergency medical care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
