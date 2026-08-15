import React from 'react';
import FlowingMedicalBackground from '../../components/landing/FlowingMedicalBackground';
import LandingNavbar from '../../components/landing/LandingNavbar';
import HeroSection from '../../components/landing/HeroSection';
import StorySection from '../../components/landing/StorySection';
import ExpertiseSection from '../../components/landing/ExpertiseSection';
import StudiosSection from '../../components/landing/StudiosSection';
import FeedbackSection from '../../components/landing/FeedbackSection';
import GetStartedSection from '../../components/landing/GetStartedSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#061426] text-white">
      <FlowingMedicalBackground />
      <LandingNavbar />
      <HeroSection />
      <StorySection />
      <ExpertiseSection />
      <StudiosSection />
      <FeedbackSection />
      <GetStartedSection />
      
      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-white/10 bg-[#061426]/80">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-white/40">
            © 2026 MedAssistAI. AI-Powered Symptom Analysis & Disease Prediction System.
          </p>
        </div>
      </footer>
    </div>
  );
}
