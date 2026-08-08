import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Activity, 
  Layers, 
  PieChart as PieIcon, 
  ShieldCheck 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { apiRequest } from "../../services/api";

export default function AdminDiseaseStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest("/analytics/overview", { method: "GET" });
        if (res && res.success) {
          setData(res);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const diseaseData = data?.diseaseStats || [
    { name: "Viral Upper Respiratory Infection", count: 420, percentage: 28.5, trend: "+12%", risk: "Low" },
    { name: "Acute Gastroenteritis", count: 310, percentage: 21.0, trend: "+8%", risk: "Medium" },
    { name: "Migraine & Tension Headaches", count: 245, percentage: 16.6, trend: "-3%", risk: "Medium" },
    { name: "Hypertension & Cardiac Symptoms", count: 180, percentage: 12.2, trend: "+5%", risk: "High" },
    { name: "Type 2 Diabetes Presentations", count: 155, percentage: 10.5, trend: "+4%", risk: "Medium" },
    { name: "Dermatitis & Skin Eruptions", count: 95, percentage: 6.4, trend: "-2%", risk: "Low" },
    { name: "Acute Coronary / Chest Emergency", count: 70, percentage: 4.8, trend: "+1%", risk: "Critical" }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#6366F1'];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Disease Statistics & Epidemiological Trends
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Disease Statistics & Prevalence Analysis</h1>
          <p className="text-gray-600">Comprehensive disease prevalence, monthly infection trajectory, and demographic distribution</p>
        </div>

        {/* Top 3 Prevalence Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Top Predicted Conditions</h3>
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-3">
              {diseaseData.slice(0, 3).map((d, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">{d.name}</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Monthly Progression</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-2">
              {[
                { month: "Jan - Feb", val: 750 },
                { month: "Mar - Apr", val: 1040 },
                { month: "May - Jun", val: 1330 },
                { month: "Jul - Aug", val: 1640 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="text-gray-500 w-20 font-semibold">{item.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-600 rounded-full"
                      style={{ width: `${(item.val / 1640) * 100}%` }}
                    />
                  </div>
                  <span className="font-bold text-gray-900">{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Patient Demographics</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-bold text-gray-600">Female Patients</span>
                  <span className="font-black text-gray-900">52%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "52%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-bold text-gray-600">Male Patients</span>
                  <span className="font-black text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1 text-xs">
                  <span className="font-bold text-gray-600">Other</span>
                  <span className="font-black text-gray-900">3%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: "3%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Chart & Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Complete Disease Prevalence Matrix</h3>
            <span className="text-xs text-gray-400 font-semibold">Total Sampled: 1,475 Assessments</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Disease Classification</th>
                  <th className="py-3 px-4">Case Count</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Weekly Trend</th>
                  <th className="py-3 px-4">Risk Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {diseaseData.map((d, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-900">{d.name}</td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{d.count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${d.percentage * 3}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{d.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <span className={d.trend.startsWith('+') ? "text-emerald-600" : "text-gray-500"}>
                        {d.trend}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        d.risk === 'High' || d.risk.includes('Critical')
                          ? "bg-red-100 text-red-800"
                          : d.risk === 'Medium'
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {d.risk}
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
