import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Download,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Activity,
  FlaskConical,
  Stethoscope,
  CheckCircle2,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import RingProgress from '../../components/ui/RingProgress';
import { symptomApi, downloadBlob } from '../../services/api';
import { riskTone, formatDate } from '../../utils/helpers';

export default function Prediction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const fetcher = id
      ? symptomApi.getPrediction(id)
      : Promise.resolve(JSON.parse(sessionStorage.getItem('last_prediction') || 'null'));

    fetcher
      .then((d) => {
        if (!active) return;
        if (!d) {
          setError('No prediction result found.');
          return;
        }
        setResult(d);
      })
      .catch((e) => active && setError(e.message || 'Could not load prediction.'))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [id]);

  const handleDownload = async () => {
    const predId = id || result?.id;
    if (!predId) {
      toast.error('Download requires a saved prediction from the backend.');
      return;
    }
    setDownloading(true);
    try {
      const blob = await symptomApi.downloadReport(predId);
      downloadBlob(blob, `medassist-report-${predId}.pdf`);
      toast.success('Report downloaded');
    } catch (e) {
      toast.error(e.message || 'Could not download report.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        <p className="text-sm text-ink-500">Analyzing your symptoms with AI…</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
        <h2 className="mt-4 text-xl font-semibold text-ink-900">No result available</h2>
        <p className="mt-1 text-sm text-ink-500">{error || 'We could not find a prediction to display.'}</p>
        <div className="mt-6">
          <Link to="/symptom-checker">
            <Button variant="gradient">
              <Stethoscope className="h-4 w-4" /> Run a new check
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const topPrediction = result?.predicted_diseases?.[0];

const disease =
  result.prediction ||
  result.disease ||
  result.predicted_disease ||
  topPrediction?.disease ||
  "Unknown condition";

let confidence =
  result.confidence ??
  result.probability ??
  topPrediction?.probability ??
  0;

  // Handle both 0.87 and 87 formats
  confidence = confidence <= 1 ? confidence * 100 : confidence;
  const riskLevel =
  result.risk ||
  result.risk_level ||
  result.severity ||
  "Low";
  const recommendations =
  result.recommendations ||
  topPrediction?.recommendations ||
  result.advice ||
  [];
  const suggestedTests =
  result.suggested_tests ||
  topPrediction?.suggested_tests ||
  result.tests ||
  [];
  const symptoms = result.symptoms || result.input_symptoms || [];
  const tone = riskTone(riskLevel);

  const riskConfig = {
    success: { icon: ShieldCheck, label: 'Low Risk', color: '#10b981', bg: 'bg-emerald2-50', text: 'text-emerald2-700', border: 'border-emerald2-200' },
    warning: { icon: Shield, label: 'Moderate Risk', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    error: { icon: ShieldAlert, label: 'High Risk', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    neutral: { icon: Shield, label: riskLevel, color: '#64748b', bg: 'bg-ink-50', text: 'text-ink-600', border: 'border-ink-200' },
  };
  const rc = riskConfig[tone] || riskConfig.neutral;
  const RiskIcon = rc.icon;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* ---- Disease card ---- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-soft"
      >
        <div className="relative gradient-brand p-6 text-white">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5" /> AI Prediction Result
              </div>
              <h1 className="mt-3 text-3xl font-bold">{disease}</h1>
              <p className="mt-1 text-sm text-white/80">
                Based on {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} • {formatDate(result.created_at || result.date)}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <RingProgress
                value={confidence}
                size={104}
                stroke={9}
                tone="#ffffff"
                track="rgba(255,255,255,0.2)"
                label={`${Math.round(confidence)}%`}
                sublabel="confidence"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
  <h3 className="font-semibold text-blue-700">
    AI Explanation
  </h3>

  <p className="mt-2 text-sm text-gray-700">
    {result.reason ||
      "This prediction is based on the symptoms you selected and AI medical pattern analysis."}
  </p>
</div>

        {/* Risk level banner */}
        <div className={`flex items-center gap-3 border-b ${rc.border} ${rc.bg} px-6 py-4`}>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white ${rc.text}`}>
            <RiskIcon className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${rc.text}`}>{rc.label}</p>
            <p className="text-xs text-ink-500">
              {tone === 'success' && 'Your symptoms suggest a mild condition. Monitor and rest.'}
              {tone === 'warning' && 'Some symptoms need attention. Consider seeing a doctor soon.'}
              {tone === 'error' && 'Symptoms may indicate a serious condition. Seek medical care promptly.'}
              {tone === 'neutral' && 'Assess the details below and consult a professional if unsure.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ---- Stats row ---- */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-ink-400"><Activity className="h-4 w-4" /><span className="text-xs font-medium">Confidence</span></div>
          <p className="mt-2 text-2xl font-bold text-ink-900">{Math.round(confidence)}%</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <motion.div className="h-full rounded-full bg-brand-600" initial={{ width: 0 }} animate={{ width: `${confidence}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-ink-400"><Shield className="h-4 w-4" /><span className="text-xs font-medium">Risk Level</span></div>
          <p className="mt-2 text-2xl font-bold text-ink-900">{riskLevel}</p>
          <Badge tone={tone} className="mt-2">{rc.label}</Badge>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-ink-200/70 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-2 text-ink-400"><Stethoscope className="h-4 w-4" /><span className="text-xs font-medium">Symptoms</span></div>
          <p className="mt-2 text-2xl font-bold text-ink-900">{symptoms.length}</p>
          <p className="mt-1 text-xs text-ink-400">analyzed</p>
        </motion.div>
      </div>

      {result?.predicted_diseases?.length > 0 && (
  <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-soft">
    <h3 className="mb-4 text-lg font-semibold">
      Possible Diseases
    </h3>

    <div className="space-y-3">
      {result.predicted_diseases.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <span className="font-medium">
            {item.disease}
          </span>

          <Badge tone={index === 0 ? "success" : "neutral"}>
            {Math.round(item.probability * 100)}%
          </Badge>
        </div>
      ))}
    </div>
  </div>
)}


{result.risk?.toLowerCase() === "high" && (
  <div className="rounded-xl bg-red-100 border border-red-300 p-4">
    <h3 className="font-bold text-red-700">
      🚨 Emergency Warning
    </h3>

    <p className="text-sm text-red-600 mt-2">
      Seek immediate medical attention.
    </p>
  </div>
)}


      {/* ---- Recommendations ---- */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand"><Sparkles className="h-4 w-4 text-white" /></div>
          <h3 className="text-base font-semibold text-ink-900">Recommendations</h3>
        </div>
        {recommendations.length === 0 ? (
          <p className="text-sm text-ink-400">No specific recommendations returned.</p>
        ) : (
          <ul className="space-y-3">
            {recommendations.map((r, i) => {
              const text = typeof r === 'string' ? r : r.text || r.advice || r.title || '';
              return (
                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald2-500" />
                  <span className="text-sm text-ink-700">{text}</span>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>

      {/* ---- Suggested tests ---- */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-2xl border border-ink-200/70 bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50"><FlaskConical className="h-4 w-4 text-brand-600" /></div>
          <h3 className="text-base font-semibold text-ink-900">Suggested Tests</h3>
        </div>
        {suggestedTests.length === 0 ? (
          <p className="text-sm text-ink-400">No specific tests suggested for this condition.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {suggestedTests.map((t, i) => {
              const text = typeof t === 'string' ? t : t.name || t.test || t.title || '';
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3.5 hover:bg-ink-50">
                  <FlaskConical className="h-5 w-5 text-brand-500" />
                  <span className="text-sm font-medium text-ink-700">{text}</span>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ---- Actions ---- */}
<div className="flex flex-col gap-3 sm:flex-row">

  <Button
  variant="gradient"
  size="lg"
  onClick={handleDownload}
  disabled={downloading}
  className="flex-1"
>
  {downloading ? (
    <Loader2 className="h-4 w-4 animate-spin" />
  ) : (
    <Download className="h-4 w-4" />
  )}

  {downloading ? "Downloading..." : "Download Report"}
</Button>

  <Link to="/symptom-checker" className="flex-1">
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
    >
      <Stethoscope className="h-4 w-4" />
      New Assessment
    </Button>
  </Link>

</div>

      <p className="text-center text-xs text-ink-400">
        This AI prediction is for informational purposes only and does not replace professional medical advice.
      </p>
    </div>
  );
}
