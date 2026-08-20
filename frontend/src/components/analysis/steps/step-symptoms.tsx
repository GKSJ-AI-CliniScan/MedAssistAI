import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";

const COMMON_SYMPTOMS = [
  "Fever", "Cough", "Headache", "Chest Pain", "Vomiting", 
  "Dizziness", "Stomach Pain", "Back Pain", "Skin Rash",
  "Fatigue", "Shortness of Breath", "Sore Throat", "Nausea",
  "Muscle Ache", "Joint Pain"
];

export function StepSymptoms({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const toggleSymptom = (symptom: string) => {
    setSelected(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const filtered = COMMON_SYMPTOMS.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Select Symptoms</h2>
        <p className="text-muted-foreground">
          What brings you here today? Select all symptoms you are currently experiencing.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search symptoms (e.g. Fever, Headache)..." 
          className="w-full p-3 pl-9 rounded-xl border border-input bg-muted/30 focus:bg-background transition-colors text-sm"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="flex flex-wrap gap-2">
          {filtered.map(symptom => {
            const isSelected = selected.includes(symptom);
            return (
              <button
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm transition-all
                  ${isSelected 
                    ? 'border-primary bg-primary/10 text-primary font-medium' 
                    : 'border-border/60 bg-background hover:bg-muted/50 hover:border-border text-foreground/80'}
                `}
              >
                {isSelected && <Check className="h-3.5 w-3.5" />}
                {symptom}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground p-4 text-center w-full">No symptoms found. Try another term.</p>
          )}
        </div>
      </div>

      <div className="pt-6 mt-auto flex items-center justify-between border-t border-border/50">
        <p className="text-sm text-muted-foreground">
          {selected.length} symptom{selected.length !== 1 ? 's' : ''} selected
        </p>
        <Button size="lg" onClick={onNext} disabled={selected.length === 0}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
