import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getSymptoms } from '../../services/api/symptoms';
import { runPrediction } from '../../services/api/predictions';

export default function SymptomCheckerPage() {
  const navigate = useNavigate();

  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSymptoms()
      .then((data) => setAvailableSymptoms(data))
      .catch(() => setAvailableSymptoms([]))
      .finally(() => setLoadingSymptoms(false));
  }, []);

  const addSymptom = (name) => {
    const trimmed = name.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms([...selectedSymptoms, trimmed]);
    }
    setInputValue('');
  };

  const removeSymptom = (name) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== name));
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      setError('Please add at least one symptom before running the diagnostic.');
      return;
    }
    setError('');
    setPredicting(true);
    try {
      await runPrediction(selectedSymptoms);
      navigate('/dashboard/prediction');
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Prediction failed. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Symptom Checker</h1>

      <Card title="Symptom Checkup Engine" subtitle="Record and identify your health concerns">
        <div className="space-y-4">
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addSymptom(inputValue)}
              placeholder="Type a symptom and press Enter or Add..."
              className="flex-1 border border-slate-300 rounded px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button variant="outline" onClick={() => addSymptom(inputValue)} disabled={!inputValue.trim()}>
              Add
            </Button>
          </div>

          {loadingSymptoms ? (
            <p className="text-xs text-slate-400">Loading symptom library...</p>
          ) : availableSymptoms.length > 0 ? (
            <div>
              <p className="text-xs text-slate-500 mb-2">Quick-select from library:</p>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {availableSymptoms.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => addSymptom(s.name)}
                    disabled={selectedSymptoms.includes(s.name)}
                    className="px-2 py-1 text-xs rounded border border-teal-300 text-teal-700 hover:bg-teal-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {selectedSymptoms.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-600 mb-2">
                Selected Symptoms ({selectedSymptoms.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSymptoms.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800"
                  >
                    {s}
                    <button
                      onClick={() => removeSymptom(s)}
                      className="ml-1 text-teal-500 hover:text-red-500 font-bold leading-none"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={predicting || selectedSymptoms.length === 0}
            >
              {predicting ? 'Running Diagnostic...' : 'Run Diagnostic'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
