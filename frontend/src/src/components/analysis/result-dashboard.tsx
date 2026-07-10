import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, AlertCircle, Activity, Download, Share2, 
  Mail, Stethoscope, Droplet, HeartPulse, CheckCircle2,
  Syringe, Zap
} from "lucide-react";

export function ResultDashboard() {
  return (
    <div className="w-full max-w-5xl mx-auto min-h-screen pb-12">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analysis Complete</h1>
          <p className="text-muted-foreground mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> PDF Report</Button>
          <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button variant="default" size="sm">Save to Dashboard</Button>
        </div>
      </div>

      {/* Emergency Alert (Conditionally shown if severe symptoms detected) */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-amber-700 dark:text-amber-500">Medical Consultation Advised</h3>
          <p className="text-sm text-amber-600/90 dark:text-amber-500/80 mt-1">
            While your symptoms point to a viral infection, fever lasting more than 3 days should be evaluated by a healthcare professional.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Risk & Score */}
        <div className="md:col-span-1 bg-card rounded-2xl border border-border/50 p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full"></div>
            <div className="relative w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center bg-card">
              <span className="text-3xl font-bold text-green-500">92</span>
            </div>
          </div>
          <h3 className="text-xl font-bold">Low Risk</h3>
          <p className="text-sm text-muted-foreground mt-1">Overall Health Score</p>
        </div>

        {/* Possible Diseases */}
        <div className="md:col-span-2 bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" /> Possible Conditions
          </h3>
          <div className="space-y-4">
            {[
              { name: "Viral Fever", prob: 95, color: "bg-red-500" },
              { name: "Influenza (Flu)", prob: 88, color: "bg-orange-500" },
              { name: "Common Cold", prob: 41, color: "bg-blue-500" }
            ].map(disease => (
              <div key={disease.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{disease.name}</span>
                  <span className="font-bold">{disease.prob}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${disease.color}`} style={{ width: `${disease.prob}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">AI Confidence Level</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-primary">96%</span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms & Recommendations */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Symptoms Detected</h3>
            <div className="flex flex-wrap gap-2">
              {["Fever (38.5°C)", "Headache", "Body Pain", "Cough"].map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-500" /> Action Plan
            </h3>
            <ul className="space-y-3">
              {[
                "Drink plenty of fluids (water, clear broths)",
                "Get adequate rest and sleep",
                "Monitor temperature every 4-6 hours",
                "Take over-the-counter fever reducers (Paracetamol/Ibuprofen) if needed"
              ].map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Specialists & Tests */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Suggested Specialists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-border/50 hover:border-primary/50 cursor-pointer transition-colors flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">General Physician</h4>
                  <p className="text-xs text-muted-foreground">Primary Consultation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Recommended Tests</h3>
            <div className="space-y-2">
              {[
                { name: "Complete Blood Count (CBC)", icon: Droplet, color: "text-red-500" },
                { name: "C-Reactive Protein (CRP)", icon: Zap, color: "text-orange-500" },
              ].map((test, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <test.icon className={`w-4 h-4 ${test.color}`} />
                  <span className="text-sm font-medium">{test.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
