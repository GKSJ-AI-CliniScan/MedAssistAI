import React from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StepDisclaimer({ onAccept }: { onAccept: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center h-full">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Medical Disclaimer</h2>
      
      <div className="bg-muted/50 p-6 rounded-xl text-left text-sm text-muted-foreground max-w-lg mb-8 space-y-4">
        <p>
          <strong>MedAssist AI is an artificial intelligence tool, not a doctor.</strong>
        </p>
        <p>
          The information, health scores, and potential disease predictions provided by this platform are for informational and educational purposes only. They do not constitute medical advice, diagnosis, or treatment.
        </p>
        <p>
          If you are experiencing a medical emergency, severe pain, or life-threatening symptoms, please call your local emergency services (e.g., 911) immediately or visit the nearest emergency room.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button variant="outline" size="lg" className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button size="lg" onClick={onAccept} className="w-full sm:w-auto">
          I Understand & Accept
        </Button>
      </div>
    </div>
  );
}
