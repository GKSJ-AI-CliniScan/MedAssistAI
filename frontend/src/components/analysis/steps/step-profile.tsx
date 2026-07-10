import React from "react";
import { Button } from "@/components/ui/button";

export function StepProfile({ onNext }: { onNext: () => void }) {
  return (
    <div className="p-6 md:p-8 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Patient Profile</h2>
        <p className="text-muted-foreground">
          Please provide some basic health information to help the AI calibrate your analysis.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input type="text" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Age</label>
            <input type="number" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. 34" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <select className="w-full p-2.5 rounded-md border border-input bg-background text-sm">
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Height (cm)</label>
            <input type="number" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. 175" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Weight (kg)</label>
            <input type="number" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. 70" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Blood Group</label>
          <select className="w-full p-2.5 rounded-md border border-input bg-background text-sm">
            <option value="">Select...</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Medical History</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Existing Diseases (Comma separated)</label>
            <input type="text" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. Diabetes, Hypertension" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Allergies</label>
            <input type="text" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. Peanuts, Penicillin" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Medications</label>
            <input type="text" className="w-full p-2.5 rounded-md border border-input bg-background text-sm" placeholder="e.g. Metformin 500mg" />
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto flex justify-end">
        <Button size="lg" onClick={onNext} className="w-full sm:w-auto">
          Continue
        </Button>
      </div>
    </div>
  );
}
