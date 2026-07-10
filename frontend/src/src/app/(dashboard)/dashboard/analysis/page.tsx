import { AnalysisWizard } from "@/components/analysis/analysis-wizard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Analysis | MedAssist AI",
  description: "Start a comprehensive AI-powered medical diagnosis.",
};

export default function AnalysisPage() {
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          AI Health Analysis
        </h1>
        <p className="text-muted-foreground">
          Complete this quick assessment to receive a personalized health analysis
          and risk prediction from our advanced AI model.
        </p>
      </div>
      <AnalysisWizard />
    </div>
  );
}
