import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const STAGES = [
  "Reading Symptoms...",
  "Extracting Text from Reports...",
  "Comparing Medical Database...",
  "Running Deep Learning Models...",
  "Generating Final Diagnosis..."
];

export function StepProcessing({ onComplete }: { onComplete: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Total time = 6 seconds
    const totalDuration = 6000;
    const stageDuration = totalDuration / STAGES.length;

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, totalDuration / 100);

    const stageInterval = setInterval(() => {
      setCurrentStage(s => {
        if (s >= STAGES.length - 1) return s;
        return s + 1;
      });
    }, stageDuration);

    const timeout = setTimeout(() => {
      onComplete();
    }, totalDuration + 500); // Give 500ms at 100% before transitioning

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full animate-pulse"></div>
        <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/20">
          <Brain className="w-16 h-16 text-white animate-pulse" strokeWidth={1.5} />
        </div>
        
        {/* Orbiting dots */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-8 rounded-full border border-dashed border-primary/30"
        >
          <div className="w-3 h-3 bg-primary rounded-full absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[1px]"></div>
        </motion.div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <h3 className="text-xl font-bold animate-pulse text-foreground">
          {STAGES[currentStage]}
        </h3>
        
        <div className="h-3 w-full bg-muted rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-primary transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {progress}% Complete
        </p>
      </div>

      <div className="text-xs text-muted-foreground max-w-xs mx-auto">
        Analyzing millions of data points to generate your personalized health report...
      </div>
    </div>
  );
}
