import { useState, useEffect } from "react";
import { 
  Search, 
  Activity, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  Brain, 
  ShieldCheck, 
  FileText 
} from "lucide-react";
import { hospitalDataService } from "../../services/hospitalDataService";

export default function AdminAIPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [search, setSearch] = useState("");

  const loadData = () => {
    const list = hospitalDataService.getAIPredictions();
    if (list && list.length > 0) {
      setPredictions(list);
    } else {
      setPredictions([
        { id: "pred-1", patientName: "Sarah Williams", prediction: "Viral Upper Respiratory Infection", confidence: 91.2, status: "Confirmed", risk: "Low", date: "2026-05-15", symptoms: ["Fever", "Cough", "Sore Throat"] },
        { id: "pred-2", patientName: "Alice Cooper", prediction: "Acute Gastroenteritis", confidence: 89.0, status: "Pending", risk: "Medium", date: "2026-05-14", symptoms: ["Abdominal Pain", "Nausea", "Vomiting"] },
        { id: "pred-3", patientName: "John Doe", prediction: "Acute Coronary Syndrome", confidence: 88.5, status: "Pending", risk: "High", date: "2026-05-14", symptoms: ["Chest Pain", "Shortness of Breath", "Sweating"] },
        { id: "pred-4", patientName: "Michael Chen", prediction: "Migraine Headache", confidence: 86.4, status: "Approved", risk: "Medium", date: "2026-05-13", symptoms: ["Headache", "Sensitivity to Light"] },
        { id: "pred-5", patientName: "David Miller", prediction: "Allergic Rhinitis", confidence: 94.0, status: "Confirmed", risk: "Low", date: "2026-05-12", symptoms: ["Runny Nose", "Sneezing", "Itchy Eyes"] }
      ]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { label: "Total Predictions Served", value: "4,771", icon: Brain, color: "text-emerald-600" },
    { label: "Model Validation Accuracy", value: "94.8%", icon: ShieldCheck, color: "text-blue-600" },
    { label: "Clinical Review Approval", value: "97.2%", icon: CheckCircle, color: "text-purple-600" },
    { label: "Average Inference Latency", value: "42 ms", icon: Activity, color: "text-teal-600" },
  ];

  const filteredPredictions = predictions.filter(p => 
    (p.patientName || "").toLowerCase().includes(search.toLowerCase()) || 
    (p.prediction || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              AI Prediction Registry & Verification Audit
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Clinical Prediction Registry</h1>
          <p className="text-gray-600">Audit trail of all automated disease predictions, clinician verifications, and diagnostic probability scores</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</span>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Registry Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or predicted condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase">
              Showing {filteredPredictions.length} Prediction Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-bold uppercase text-gray-400">
                <tr>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Presenting Symptoms</th>
                  <th className="px-6 py-4">AI Disease Prediction</th>
                  <th className="px-6 py-4">Probability</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPredictions.map((pred, i) => (
                  <tr key={pred.id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          {pred.patientName ? pred.patientName[0] : "P"}
                        </div>
                        <span>{pred.patientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600 max-w-xs">
                      {Array.isArray(pred.symptoms) ? pred.symptoms.join(", ") : pred.symptoms || "Standard presentation"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-950">
                      {pred.prediction}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-900">{pred.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        (pred.risk || '').includes('High') || (pred.risk || '').includes('Critical')
                          ? "bg-red-100 text-red-700"
                          : (pred.risk || '').includes('Medium')
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {pred.risk || "Low"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        pred.status === "Confirmed" || pred.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : pred.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {pred.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
