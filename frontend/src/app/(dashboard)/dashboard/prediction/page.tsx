"use client";

import { AlertCircle, Calendar, Download, Info, ShieldAlert, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const predictions = [
  {
    id: 1,
    disease: "Viral Pharyngitis",
    confidence: 94,
    risk: "Low",
    symptomsMatch: ["Sore throat", "Fever", "Fatigue", "Headache"],
    description: "Viral pharyngitis is an inflammation of the pharynx, commonly known as a sore throat, caused by a viral infection such as the common cold or flu.",
    recommendations: ["Rest and hydrate well", "Use throat lozenges", "Take over-the-counter pain relievers (ibuprofen/acetaminophen)"],
    tests: ["Rapid Strep Test (to rule out bacterial)"],
    color: "bg-success/10 text-success border-success/20",
    barColor: "bg-success",
  },
  {
    id: 2,
    disease: "Strep Throat",
    confidence: 65,
    risk: "Medium",
    symptomsMatch: ["Sore throat", "Fever", "Headache"],
    description: "A bacterial infection that may cause a sore, scratchy throat. It requires antibiotics for treatment to prevent complications.",
    recommendations: ["Seek medical evaluation for potential antibiotics", "Avoid contact with others", "Replace toothbrush after 24h of antibiotics"],
    tests: ["Rapid Strep Test", "Throat Culture"],
    color: "bg-warning/10 text-warning border-warning/20",
    barColor: "bg-warning",
  },
  {
    id: 3,
    disease: "Influenza (Flu)",
    confidence: 42,
    risk: "Medium",
    symptomsMatch: ["Fever", "Fatigue", "Muscle pain"],
    description: "A common viral infection that can be deadly, especially in high-risk groups. The flu attacks the lungs, nose and throat.",
    recommendations: ["Rest", "Fluid intake", "Consider antiviral drugs if diagnosed early"],
    tests: ["Rapid Influenza Diagnostic Test (RIDT)"],
    color: "bg-warning/10 text-warning border-warning/20",
    barColor: "bg-warning",
  }
];

export default function PredictionPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analysis Results</h1>
          <p className="text-muted-foreground mt-1">Based on the symptoms provided on Oct 12, 2025.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full shadow-sm bg-background">
            <FileText className="mr-2 h-4 w-4" /> Save to History
          </Button>
          <Button className="rounded-full shadow-md">
            <Download className="mr-2 h-4 w-4" /> Download PDF Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {predictions.map((pred, index) => (
          <div key={pred.id} className={`glass-card rounded-3xl p-0 overflow-hidden border ${index === 0 ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border/50'}`}>
            {/* Header */}
            <div className={`p-6 border-b ${index === 0 ? 'bg-primary/5 border-primary/10' : 'bg-muted/30 border-border/50'}`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${pred.color}`}>
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{pred.disease}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${pred.color}`}>
                        {pred.risk} Risk
                      </span>
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {pred.symptomsMatch.length} Symptoms matched
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left md:text-right">
                  <p className="text-sm font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Confidence Score</p>
                  <div className="flex items-center gap-4 md:justify-end">
                    <div className="w-32 bg-muted rounded-full h-2.5 overflow-hidden">
                      <div className={`h-full rounded-full ${pred.barColor}`} style={{ width: `${pred.confidence}%` }} />
                    </div>
                    <span className="text-3xl font-bold">{pred.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" /> Overview
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {pred.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Matched Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {pred.symptomsMatch.map((sym, i) => (
                      <span key={i} className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                        {sym}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 bg-muted/20 p-5 rounded-2xl border border-border/50">
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3 text-primary">Recommendations</h3>
                  <ul className="space-y-2">
                    {pred.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Suggested Medical Tests</h3>
                  <ul className="space-y-2">
                    {pred.tests.map((test, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-medium text-foreground">
                        <ShieldAlert className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>

                {index === 0 && (
                  <div className="pt-4 mt-4 border-t border-border/50">
                    <Button className="w-full rounded-xl shadow-md h-12">
                      <Calendar className="mr-2 h-4 w-4" /> Book Appointment for this Condition
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
