"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepDisclaimer } from "./steps/step-disclaimer";
import { StepProfile } from "./steps/step-profile";
import { StepSymptoms } from "./steps/step-symptoms";
import { StepSymptomDetails } from "./steps/step-symptom-details";
import { StepUpload } from "./steps/step-upload";
import { StepProcessing } from "./steps/step-processing";
import { ResultDashboard } from "./result-dashboard";
import { ArrowLeft } from "lucide-react";

export function AnalysisWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Global state for wizard 
  const [wizardData, setWizardData] = useState({
    profile: {},
    symptoms: [],
    details: {},
    files: [],
  });

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  const handleStartProcessing = () => {
    setIsProcessing(true);
  };

  const handleProcessingComplete = () => {
    setIsProcessing(false);
    setAnalysisComplete(true);
  };

  if (analysisComplete) {
    return <ResultDashboard />;
  }

  if (isProcessing) {
    return <StepProcessing onComplete={handleProcessingComplete} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[60vh] flex flex-col">
      {/* Progress Bar (Hidden on disclaimer) */}
      {currentStep > 0 && (
        <div className="mb-8 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of 4
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round((currentStep / 4) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Back Button */}
      {currentStep > 0 && (
        <button
          onClick={prevStep}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
      )}

      {/* Step Content with Transitions */}
      <div className="flex-1 bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {currentStep === 0 && <StepDisclaimer onAccept={nextStep} />}
            {currentStep === 1 && <StepProfile onNext={nextStep} />}
            {currentStep === 2 && <StepSymptoms onNext={nextStep} />}
            {currentStep === 3 && <StepSymptomDetails onNext={nextStep} />}
            {currentStep === 4 && <StepUpload onAnalyze={handleStartProcessing} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
