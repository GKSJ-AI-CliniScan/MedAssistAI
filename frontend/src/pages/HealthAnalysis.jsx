import { useState } from "react";

import HealthStepper from "../components/HealthStepper";
import SymptomsStep from "../components/SymptomsStep";
import MedicalHistoryStep from "../components/MedicalHistoryStep";
import LifestyleStep from "../components/LifestyleStep";
import ReviewStep from "../components/ReviewStep";

import "../css/HealthAnalysis.css";

function HealthAnalysis() {

  const [currentStep, setCurrentStep] = useState(1);

  const [analysisData, setAnalysisData] = useState({
    symptoms: [],

    history: {
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      asthma: false,

      allergies: "",
      medications: "",
      surgery: ""
    },

    lifestyle: {
      smoking: false,
      alcohol: false,
      exercise: true,
      sleep: "good",
      recent_travel: false,
      high_risk_job: false
    }
  });

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {

      case 1:
        return (
          <SymptomsStep
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
            nextStep={nextStep}
          />
        );

      case 2:
        return (
          <MedicalHistoryStep
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        );

      case 3:
        return (
          <LifestyleStep
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
            nextStep={nextStep}
            previousStep={previousStep}
          />
        );

      case 4:
        return (
          <ReviewStep
            analysisData={analysisData}
            previousStep={previousStep}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="health-analysis-page">

      <HealthStepper currentStep={currentStep} />

      {renderStep()}

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="dashboard-footer">
        <p>
          © 2026 MedAssist AI |
          AI-Powered Medical Symptom Analysis &
          Disease Prediction System
        </p>
      </div>

    </div>
  );
}

export default HealthAnalysis;