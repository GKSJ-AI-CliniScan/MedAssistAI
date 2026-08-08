import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Stethoscope, 
  Loader2, 
  FileText, 
  Pill, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  HeartPulse, 
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { apiRequest } from "../../services/api";
import { hospitalDataService } from "../../services/hospitalDataService";
import jsPDF from "jspdf";

export default function DiseasePrediction() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([
    "Fever", "Cough", "Headache", "Fatigue"
  ]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const { user } = useAuth();
  const { t } = useTranslation();

  const SYMPTOMS = [
    "Fever", "Cough", "Dry Cough", "Sore Throat", "Headache", "Migraine",
    "Chest Pain", "Shortness of Breath", "Chest Tightness", "Fatigue", "Weakness",
    "Vomiting", "Nausea", "Diarrhea", "Abdominal Pain", "Stomach Cramps",
    "Body Pain", "Joint Pain", "Muscle Pain", "Back Pain", "Neck Pain",
    "Dizziness", "Palpitations", "High Blood Pressure", "High Blood Sugar",
    "Skin Rash", "Itching", "Swelling in Legs", "Loss of Appetite", "Insomnia",
    "Anxiety", "Depression", "Difficulty Swallowing", "Jaundice"
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const predictDisease = async () => {
    if (selectedSymptoms.length === 0) return;
    
    setIsPredicting(true);
    try {
      const response = await apiRequest("/predict-disease", {
        method: "POST",
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          severity: "Moderate",
          duration: "3-7 days",
          age: user?.age || 30,
          gender: user?.gender || "Female"
        })
      });

      if (response && response.success) {
        setPrediction(response);

        // Record in hospitalDataService
        hospitalDataService.addAIPrediction({
          patientId: user?.id || "patient-1",
          patientName: user?.name || "Sarah Williams",
          symptoms: selectedSymptoms,
          prediction: response.disease,
          confidence: response.confidence,
          risk: response.risk,
          riskScore: response.riskScore,
          date: new Date().toISOString().split("T")[0],
          status: "Pending",
          recommendedSpecialist: response.recommendedSpecialist,
          suggestedTests: response.suggestedTests,
          precautions: response.precautions,
          aiRecommendations: response.aiRecommendations
        });
      } else {
        throw new Error(response?.message || "Prediction failed");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Failed to predict disease. Please ensure the backend is running.");
    } finally {
      setIsPredicting(false);
    }
  };

  const downloadPDFReport = () => {
    if (!prediction) return;

    const doc = new jsPDF();
    const patientName = user?.name || "Sarah Williams";
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Header banner
    doc.setFillColor(6, 64, 43); // Dark emerald
    doc.rect(0, 0, 210, 36, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("MedAssist AI - Disease Prediction Summary", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Machine Learning Classification & Healthcare Diagnostic Guidance", 14, 28);
    doc.text(`Date: ${dateStr}`, 150, 28);

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT & CLINICAL PROFILE", 14, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Patient: ${patientName}`, 14, 55);
    doc.text(`Patient ID: ${user?.id || 'P-8821'}`, 80, 55);
    doc.text(`Risk Assessment: ${prediction.risk}`, 140, 55);

    doc.line(14, 62, 196, 62);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SYMPTOMS INPUTS", 14, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(selectedSymptoms.join(", "), 14, 77);

    // Primary Prediction
    doc.line(14, 84, 196, 84);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(6, 64, 43);
    doc.text(`Predicted Disease: ${prediction.disease} (${prediction.confidence}% Confidence)`, 14, 93);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Health Risk Score: ${prediction.riskScore || 45} / 100 [${prediction.risk} Risk Band]`, 14, 100);

    // Differential rankings
    let yOffset = 108;
    doc.setFont("helvetica", "bold");
    doc.text("Top-5 Differential Diagnoses:", 14, yOffset);
    yOffset += 6;
    doc.setFont("helvetica", "normal");
    (prediction.topDiseases || []).forEach(d => {
      doc.text(`• ${d.name} — Confidence: ${d.confidence}% — Specialist: ${d.specialist || prediction.recommendedSpecialist}`, 14, yOffset);
      yOffset += 5;
    });

    yOffset += 4;
    doc.line(14, yOffset, 196, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Clinical Recommendations & Precautions:", 14, yOffset);
    yOffset += 6;
    doc.setFont("helvetica", "normal");
    (prediction.precautions || []).forEach(p => {
      doc.text(`• ${p}`, 14, yOffset);
      yOffset += 5;
    });

    doc.save(`MedAssist_Disease_Prediction_${patientName.replace(/ /g, '_')}.pdf`);
  };

  const getSeverityColor = (risk) => {
    const r = (risk || '').toLowerCase();
    if (r.includes('critical') || r.includes('emergency') || r.includes('high')) {
      return 'bg-red-100 text-red-700 border-red-300';
    } else if (r.includes('medium')) {
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
    return 'bg-green-100 text-green-700 border-green-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
                Module 3 • Multi-Class ML Model
              </span>
              <span className="text-xs text-gray-500 font-semibold">Trained on Kaggle & CDC BRFSS Datasets</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t('diseasePrediction.title', 'AI Disease Prediction & Probability Scoring')}</h1>
            <p className="text-gray-600">{t('diseasePrediction.description', 'Advanced machine learning multi-disease classification with confidence scoring')}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/patient/symptom-analysis"
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-emerald-600" />
              Symptom Catalog
            </Link>
            <Link
              to="/patient/recommendations"
              className="px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Healthcare Plan
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom Selection Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white rounded-3xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              {t('diseasePrediction.selectSymptoms', 'Select Symptoms')}
            </h2>
            
            <p className="text-xs font-semibold text-gray-500 mb-4">
              Selected: <strong className="text-emerald-700">{selectedSymptoms.length} symptoms</strong>
            </p>

            <div className="max-h-[460px] overflow-y-auto space-y-2 pr-1">
              {SYMPTOMS.map(symptom => {
                const isSelected = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm transition-all border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{symptom}</span>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={predictDisease}
              disabled={selectedSymptoms.length === 0 || isPredicting}
              className="w-full mt-5 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-3.5 rounded-2xl font-bold hover:from-emerald-700 hover:to-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.99]"
            >
              {isPredicting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Running ML Inference...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Predict Disease & Probability
                </>
              )}
            </button>
          </motion.div>

          {/* Prediction Results Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-gray-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-emerald-600" />
                {t('diseasePrediction.predictionResults', 'Disease Classification Results')}
              </h2>

              {prediction && (
                <button
                  onClick={downloadPDFReport}
                  className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              )}
            </div>

            {!prediction ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-gray-500">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4 text-emerald-600">
                  <Brain className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Disease Prediction Generated</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Click <strong>Predict Disease & Probability</strong> to execute the Decision Tree classification model across selected symptoms.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Disease Header Card */}
                <div className="p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 rounded-2xl border border-emerald-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Primary Classification</span>
                      <h3 className="text-3xl font-black text-gray-900 mt-1">{prediction.disease}</h3>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-xs font-black uppercase tracking-wider ${getSeverityColor(prediction.risk)}`}>
                      {prediction.risk === 'High' || prediction.risk.includes('Emergency') ? (
                        <ShieldAlert className="w-4 h-4 text-red-600" />
                      ) : (
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>{prediction.risk} Risk</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex-1 bg-white rounded-full h-3.5 border border-emerald-200 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                    <span className="text-base font-black text-emerald-900">{prediction.confidence}% Confidence</span>
                  </div>

                  <p className="text-xs text-gray-600 mt-2">
                    Health Risk Index: <strong>{prediction.riskScore || 45} / 100</strong> • Assessed across {prediction.symptomCount || selectedSymptoms.length} clinical indicators.
                  </p>
                </div>

                {/* Top-5 Differential Diseases Distribution */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center justify-between">
                    <span>Differential Disease Rankings (Top-5)</span>
                    <span className="text-xs text-gray-400 font-normal">Multi-Class Probability Distribution</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(prediction.topDiseases || []).map((disease, idx) => (
                      <div key={disease.name} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-gray-800 text-sm">{idx + 1}. {disease.name}</span>
                          <span className="text-xs font-black text-emerald-700">{disease.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${disease.confidence}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span>Specialist: <strong>{disease.specialist || prediction.recommendedSpecialist}</strong></span>
                          <span className={`px-2 py-0.5 rounded font-bold ${getSeverityColor(disease.risk)}`}>{disease.risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialist & Diagnostic Tests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-600 text-white rounded-xl">
                        <Stethoscope className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-blue-950">Recommended Specialist</h4>
                    </div>
                    <p className="text-base font-bold text-gray-900">{prediction.recommendedSpecialist}</p>
                    <p className="text-xs text-gray-600 mt-1">Book an appointment with this department for clinical validation.</p>
                  </div>

                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-600 text-white rounded-xl">
                        <Activity className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-purple-950">Suggested Lab & Imaging Tests</h4>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(prediction.suggestedTests || []).map((test, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white text-purple-800 rounded-lg text-xs font-semibold border border-purple-200">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Precautions and Guidance */}
                {prediction.precautions && prediction.precautions.length > 0 && (
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
                    <h4 className="font-bold text-sm text-amber-950 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Precautions & Immediate Care Advice
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-900 list-disc list-inside">
                      {prediction.precautions.map((item, idx) => (
                        <li key={idx} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps CTA */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={downloadPDFReport}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Download Medical Prediction PDF
                  </button>
                  <Link
                    to="/patient/recommendations"
                    className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    View Diet & Lifestyle Plan <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}