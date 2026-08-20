"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Activity, Search, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";

const steps = [
  { id: 1, name: "Select Symptoms" },
  { id: 2, name: "Additional Info" },
  { id: 3, name: "Analysis" },
];

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea", "Dizziness", "Shortness of breath", "Muscle pain", "Joint pain", "Sore throat"
];

export default function SymptomCheckerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState([5]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Symptom Checker</h1>
        <p className="text-muted-foreground mt-1">Our AI will analyze your symptoms and suggest potential conditions.</p>
      </div>

      {/* Step Indicator */}
      <div className="glass-card rounded-3xl p-6">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center justify-between w-full relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0 rounded-full" />
            <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
            
            {steps.map((step) => (
              <li key={step.name} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-card transition-colors duration-300 ${
                  currentStep > step.id ? "bg-primary text-primary-foreground" : 
                  currentStep === step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {currentStep > step.id ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
                </div>
                <span className={`mt-2 text-xs font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Step Content */}
      <div className="glass-card rounded-3xl p-6 md:p-8 min-h-[400px]">
        {currentStep === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">What&apos;s bothering you?</h2>
              <p className="text-muted-foreground mt-1">Select all symptoms you are currently experiencing.</p>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search symptoms (e.g. stomach ache)..." className="pl-10 h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:border-primary text-base" />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Common Symptoms</Label>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <Label className="text-base font-semibold block">Overall Severity: {severity[0]}/10</Label>
                <div className="px-2">
                  <Slider defaultValue={[5]} max={10} min={1} step={1} onValueChange={(val) => setSeverity(val as number[])} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
             <div>
              <h2 className="text-2xl font-bold">Additional Information</h2>
              <p className="text-muted-foreground mt-1">Help us provide a more accurate prediction.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Age</Label>
                <Input type="number" placeholder="Years" className="h-12 rounded-xl bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <select className="flex h-12 w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>Select...</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label className="font-semibold block">Lifestyle Factors</Label>
              <div className="flex flex-wrap gap-3">
                {["Smoking", "Alcohol Consumption", "Pregnancy"].map(factor => (
                  <label key={factor} className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl cursor-pointer hover:bg-muted transition-colors border border-transparent has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary w-4 h-4 accent-primary" />
                    <span className="text-sm font-medium">{factor}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Pre-existing Conditions / Medical History</Label>
              <Textarea placeholder="e.g. Diabetes, Asthma..." className="resize-none h-24 rounded-2xl bg-muted/50" />
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-12">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <Activity className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Analyzing Symptoms</h2>
              <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                Our AI is processing your inputs against millions of medical data points. This will only take a moment.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1 || currentStep === 3}
          className="rounded-full px-6 h-12"
        >
          Back
        </Button>
        <Button 
          onClick={() => {
            if (currentStep === 2) {
              setCurrentStep(3);
              // Simulate API call and redirect
              setTimeout(() => {
                window.location.href = '/dashboard/prediction';
              }, 3000);
            } else {
              setCurrentStep(prev => Math.min(3, prev + 1));
            }
          }}
          disabled={currentStep === 3 || (currentStep === 1 && selectedSymptoms.length === 0)}
          className="rounded-full px-6 h-12 shadow-md"
        >
          {currentStep === 2 ? "Analyze" : "Continue"}
          {currentStep !== 2 && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/20 rounded-2xl text-warning-foreground">
        <ShieldAlert className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <p className="text-xs font-medium leading-relaxed">
          <strong>Disclaimer:</strong> MedAssist AI is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
}
