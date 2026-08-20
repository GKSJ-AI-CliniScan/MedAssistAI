import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Thermometer, Clock, AlertTriangle } from "lucide-react";

export function StepSymptomDetails({ onNext }: { onNext: () => void }) {
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Symptom Details</h2>
        <p className="text-muted-foreground">
          Let's get a bit more detail about your primary symptoms to improve accuracy.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8">
        {/* Mocking for 'Fever' as an example */}
        <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 space-y-6">
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Thermometer className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-lg">Fever</h3>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Duration
            </label>
            <div className="flex flex-wrap gap-2">
              {['Today', '2 Days', '1 Week', 'More than a week'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setDuration(opt)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                    duration === opt 
                      ? 'border-primary bg-primary/10 text-primary font-medium' 
                      : 'border-border/60 hover:bg-muted bg-background'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" /> Severity
            </label>
            <div className="flex flex-wrap gap-2">
              {['Mild', 'Moderate', 'Severe'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setSeverity(opt)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                    severity === opt 
                      ? 'border-primary bg-primary/10 text-primary font-medium' 
                      : 'border-border/60 hover:bg-muted bg-background'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" /> Current Temperature (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                placeholder="e.g. 38.5" 
                className="w-32 p-2.5 rounded-lg border border-input bg-background text-sm"
              />
              <span className="text-muted-foreground">°C</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto flex justify-end">
        <Button size="lg" onClick={onNext} disabled={!duration || !severity}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
