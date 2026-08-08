import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  X, 
  Search, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  Mic, 
  MicOff, 
  Download, 
  FileText, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Stethoscope, 
  PhoneCall 
} from "lucide-react";
import { Link } from "react-router-dom";
import { SYMPTOM_CATEGORIES } from "../../lib/symptoms";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import { hospitalDataService } from "../../services/hospitalDataService";
import { apiRequest } from "../../services/api";
import jsPDF from "jspdf";

export default function SymptomAnalysis() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [openCategory, setOpenCategory] = useState("General");
  const [severity, setSeverity] = useState("Moderate");
  const [duration, setDuration] = useState("3-7 days");
  const [onset, setOnset] = useState("Gradual");
  const [existingDiseases, setExistingDiseases] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  // Speech Recognition setup (Web Speech API)
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceTranscript(transcript);

        // Auto-match symptoms from spoken text
        let addedCount = 0;
        SYMPTOM_CATEGORIES.forEach(cat => {
          cat.symptoms.forEach(s => {
            if (transcript.includes(s.toLowerCase()) && !selectedSymptoms.includes(s)) {
              setSelectedSymptoms(prev => [...prev, s]);
              addedCount++;
            }
          });
        });

        if (addedCount === 0) {
          // If no exact match, add search term
          setSearchTerm(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Voice input error:", e);
      setIsListening(false);
    }
  };

  const addSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSearchTerm("");
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
  };

  const toggleCategory = (categoryName) => {
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;

    setIsAnalyzing(true);
    setResults(null);

    try {
      const payload = {
        symptoms: selectedSymptoms,
        severity,
        duration,
        onset,
        existingDiseases,
        allergies,
        currentMedications,
        age: user?.age || 32,
        gender: user?.gender || "Female"
      };

      const response = await apiRequest("/predict-disease", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (response && response.success) {
        setResults(response);

        // Save to hospitalDataService
        const patientName = user?.name || "Sarah Williams";
        const patientId = user?.id || "patient-1";
        hospitalDataService.addAIPrediction({
          patientId,
          patientName,
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
        throw new Error(response?.message || "Failed to analyze symptoms");
      }
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Analysis failed: " + (err.message || "Please check that the Flask server is running and try again."));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadPDFReport = () => {
    if (!results) return;

    const doc = new jsPDF();
    const patientName = user?.name || "Sarah Williams";
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Header banner
    doc.setFillColor(6, 64, 43); // Dark emerald
    doc.rect(0, 0, 210, 36, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("MedAssist AI Healthcare Report", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("AI-Powered Medical Symptom Analysis & Clinical Insights", 14, 28);
    doc.text(`Date: ${dateStr}`, 155, 28);

    // Patient Information Block
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", 14, 48);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Name: ${patientName}`, 14, 55);
    doc.text(`Patient ID: ${user?.id || 'P-8821'}`, 80, 55);
    doc.text(`Severity: ${severity}`, 140, 55);

    doc.text(`Duration: ${duration}`, 14, 62);
    doc.text(`Onset: ${onset}`, 80, 62);
    doc.text(`Risk Assessment: ${results.risk}`, 140, 62);

    // Symptoms Section
    doc.line(14, 68, 196, 68);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PRESENTING SYMPTOMS & CLINICAL INDICATORS", 14, 76);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const symptomsText = selectedSymptoms.join(", ");
    const splitSymptoms = doc.splitTextToSize(symptomsText, 180);
    doc.text(splitSymptoms, 14, 83);

    let yOffset = 85 + (splitSymptoms.length * 5);

    // Predicted Condition & Confidence
    doc.line(14, yOffset, 196, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("AI PREDICTIVE DIAGNOSIS & PROBABILITY RANKING", 14, yOffset);

    yOffset += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(6, 64, 43);
    doc.text(`Primary Prediction: ${results.disease} (${results.confidence}% Confidence)`, 14, yOffset);

    yOffset += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(`Calculated Health Risk Score: ${results.riskScore || 45} / 100 [${results.risk} Risk Category]`, 14, yOffset);

    // Top ranked conditions table
    yOffset += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text("Top Differential Diseases:", 14, yOffset);
    doc.text("Confidence:", 100, yOffset);
    doc.text("Specialist:", 140, yOffset);

    yOffset += 5;
    doc.setFont("helvetica", "normal");
    (results.topDiseases || []).slice(0, 4).forEach((d) => {
      doc.text(`• ${d.name}`, 14, yOffset);
      doc.text(`${d.confidence}%`, 100, yOffset);
      doc.text(`${d.specialist || results.recommendedSpecialist}`, 140, yOffset);
      yOffset += 5;
    });

    // Recommended Tests & Precautions
    yOffset += 4;
    doc.line(14, yOffset, 196, yOffset);
    yOffset += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("SUGGESTED CLINICAL TESTS & PRECAUTIONS", 14, yOffset);

    yOffset += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Diagnostic Tests:", 14, yOffset);
    doc.setFont("helvetica", "normal");
    doc.text((results.suggestedTests || []).join(", "), 48, yOffset);

    yOffset += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Precautions:", 14, yOffset);
    yOffset += 5;
    doc.setFont("helvetica", "normal");
    (results.precautions || []).forEach(p => {
      doc.text(`• ${p}`, 14, yOffset);
      yOffset += 5;
    });

    // Medical Disclaimer Footer
    yOffset = Math.max(yOffset + 6, 260);
    doc.setFillColor(245, 245, 245);
    doc.rect(14, yOffset, 182, 22, "F");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("IMPORTANT DISCLAIMER:", 18, yOffset + 6);
    doc.text("This report is generated by MedAssist AI using machine learning models for informational guidance only.", 18, yOffset + 11);
    doc.text("It is not a final clinical diagnosis. Please consult a licensed medical professional for formal clinical evaluation.", 18, yOffset + 16);

    doc.save(`MedAssist_AI_Report_${patientName.replace(/ /g, '_')}.pdf`);
  };

  const filteredSymptomsBySearch = searchTerm 
    ? SYMPTOM_CATEGORIES.flatMap(category => 
        category.symptoms.filter(symptom => 
          symptom.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !selectedSymptoms.includes(symptom)
        ).map(symptom => ({ symptom, category: category.name }))
      )
    : [];

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
                Module 2 & 3 • Core Engine
              </span>
              <span className="text-xs text-gray-500 font-semibold">100+ Clinically Mapped Symptoms</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{t('symptomAnalysis.title', "AI Symptom Analysis & Medical Prediction")}</h1>
            <p className="text-gray-600">{t('symptomAnalysis.subtitle', "Select or speak your symptoms to evaluate health risk and predict disease patterns")}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/patient/recommendations"
              className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-emerald-500 hover:text-emerald-700 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Recommendations
            </Link>
            <Link
              to="/patient/emergency"
              className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              Emergency SOS
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symptom Selection Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-600" />
                {t('symptomAnalysis.selectSymptoms', "Symptom Selection & Context")}
              </h2>
              
              {/* Voice Input Button */}
              <button
                type="button"
                onClick={startVoiceInput}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Listening... Speak now
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-600" />
                    Voice Input
                  </>
                )}
              </button>
            </div>

            {voiceTranscript && (
              <div className="mb-4 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-800 flex items-center justify-between border border-emerald-200">
                <span><strong>Voice Heard:</strong> "{voiceTranscript}"</span>
                <button onClick={() => setVoiceTranscript("")} className="text-emerald-600 hover:text-emerald-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('symptomAnalysis.searchPlaceholder', "Search by symptom name (e.g., chest pain, fever, dizziness)...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm shadow-sm"
              />
            </div>

            {/* Selected Symptoms Chips */}
            {selectedSymptoms.length > 0 && (
              <div className="mb-6 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Selected Symptoms ({selectedSymptoms.length})
                  </p>
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <motion.div
                      key={symptom}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm shadow-emerald-600/20"
                    >
                      {symptom}
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="hover:bg-emerald-700 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Contextual Clinical Parameters */}
            <div className="mb-6 bg-gray-50 p-5 rounded-2xl border border-gray-200/80">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                Clinical Context & Health Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Mild">Mild (Noticeable but manageable)</option>
                    <option value="Moderate">Moderate (Interferes with tasks)</option>
                    <option value="Severe">Severe (Significant distress)</option>
                    <option value="Critical">Critical (Immediate urgency)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Less than a day">Less than 24 hours</option>
                    <option value="1-3 days">1 to 3 days</option>
                    <option value="3-7 days">3 to 7 days</option>
                    <option value="1-2 weeks">1 to 2 weeks</option>
                    <option value="More than 2 weeks">Chronic (&gt; 2 weeks)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Symptom Onset</label>
                  <select
                    value={onset}
                    onChange={(e) => setOnset(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Sudden">Sudden / Acute</option>
                    <option value="Gradual">Gradual / Progressive</option>
                    <option value="Intermittent">Intermittent / Periodic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Existing Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Asthma, Diabetes"
                    value={existingDiseases}
                    onChange={(e) => setExistingDiseases(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Current Medications</label>
                  <input
                    type="text"
                    placeholder="e.g. Metformin, Aspirin"
                    value={currentMedications}
                    onChange={(e) => setCurrentMedications(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Categorized Symptom Accordions or Search Filter */}
            <div className="max-h-[380px] overflow-y-auto pr-2 mb-6">
              {searchTerm ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Matching Symptoms</p>
                  {filteredSymptomsBySearch.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {filteredSymptomsBySearch.map((item) => (
                        <button
                          key={item.symptom}
                          onClick={() => addSymptom(item.symptom)}
                          className="text-left px-4 py-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 rounded-2xl text-sm transition-all border border-gray-200 hover:border-emerald-300 flex items-center justify-between group"
                        >
                          <span className="font-medium">{item.symptom}</span>
                          <Plus className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:scale-110 transition-transform" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl text-gray-500 text-sm">
                      No matching symptoms found for "{searchTerm}". Try general terms like fever, pain, cough.
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {SYMPTOM_CATEGORIES.map((category) => (
                    <div key={category.name} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                      <button
                        onClick={() => toggleCategory(category.name)}
                        className="w-full px-5 py-3.5 bg-gray-50/80 flex items-center justify-between hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="font-bold text-gray-900 text-sm">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-semibold">{category.symptoms.length} symptoms</span>
                          {openCategory === category.name ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                      </button>
                      <AnimatePresence>
                        {openCategory === category.name && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                          >
                            {category.symptoms
                              .filter(s => !selectedSymptoms.includes(s))
                              .map((symptom) => (
                                <button
                                  key={symptom}
                                  onClick={() => addSymptom(symptom)}
                                  className="text-left px-3 py-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl text-xs font-medium transition-colors border border-gray-100 hover:border-emerald-200 flex items-center justify-between"
                                >
                                  <span>{symptom}</span>
                                  <Plus className="w-3.5 h-3.5 text-gray-400" />
                                </button>
                              ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run Analysis Button */}
            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 rounded-2xl font-bold hover:from-emerald-700 hover:to-emerald-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/20 text-base active:scale-[0.99]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Running AI Multiclass Disease Classification & Risk Engine...
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6" />
                  Analyze Symptoms & Predict Disease
                </>
              )}
            </button>
          </motion.div>

          {/* Analysis Results Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Brain className="w-6 h-6 text-emerald-600" />
                Prediction & Risk Results
              </h2>
              {results && (
                <button
                  onClick={downloadPDFReport}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-emerald-200"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF Report
                </button>
              )}
            </div>

            {!results ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-4 text-emerald-600">
                  <Brain className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Active Prediction</h3>
                <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                  Select at least one symptom from the catalog and click <strong>Analyze Symptoms</strong> to generate AI disease predictions and health scoring.
                </p>
              </div>
            ) : (
              <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                {/* Emergency Alert Banner if applicable */}
                {results.isEmergency && (
                  <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl text-red-900">
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
                      <span className="font-black text-sm uppercase tracking-wider">Critical Medical Notice</span>
                    </div>
                    <p className="text-xs leading-relaxed text-red-800">{results.emergencyMessage}</p>
                    <div className="mt-3 flex gap-2">
                      <a
                        href="tel:911"
                        className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-red-700"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call 911 / 108
                      </a>
                      <Link
                        to="/patient/emergency"
                        className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded-xl text-xs font-bold hover:bg-red-50"
                      >
                        Nearby Trauma Centers
                      </Link>
                    </div>
                  </div>
                )}

                {/* Primary Prediction Card */}
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Primary AI Prediction</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      results.risk === "High" || results.risk === "Critical / Emergency"
                        ? "bg-red-100 text-red-800"
                        : results.risk === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {results.risk} Risk
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-emerald-950 mb-1">{results.disease}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 bg-white rounded-full h-3 border border-emerald-200 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                        style={{ width: `${results.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-emerald-800">{results.confidence}% Confidence</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Health Risk Index: <strong>{results.riskScore} / 100</strong>
                  </p>
                </div>

                {/* Top-5 Differential Diseases */}
                <div>
                  <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center justify-between">
                    <span>Differential Disease Predictions</span>
                    <span className="text-xs font-normal text-gray-500">Relative Probability</span>
                  </h4>
                  <div className="space-y-2.5">
                    {results.topDiseases.map((disease, idx) => (
                      <div key={disease.name} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-bold text-gray-800">{idx + 1}. {disease.name}</span>
                          <span className="text-xs font-extrabold text-emerald-700">{disease.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${disease.confidence}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Specialist */}
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 text-white rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-900 uppercase">Recommended Specialist</p>
                    <p className="text-sm font-bold text-gray-900">{results.recommendedSpecialist}</p>
                  </div>
                </div>

                {/* Suggested Tests */}
                {results.suggestedTests && results.suggestedTests.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs text-gray-500 uppercase tracking-wider mb-2">Suggested Diagnostic Tests</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {results.suggestedTests.map((test, i) => (
                        <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium border border-gray-200">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Precautions */}
                {results.precautions && results.precautions.length > 0 && (
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/70">
                    <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider mb-2">Clinical Precautions</h4>
                    <ul className="space-y-1 text-xs text-amber-900 leading-relaxed list-disc list-inside">
                      {results.precautions.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={downloadPDFReport}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Download Official PDF Report
                  </button>
                  <Link
                    to="/patient/recommendations"
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    View Dietary & Lifestyle Plan <ArrowRight className="w-4 h-4" />
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