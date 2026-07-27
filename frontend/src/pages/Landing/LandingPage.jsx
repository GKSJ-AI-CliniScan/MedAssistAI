import React from 'react';
import { motion } from 'framer-motion';

import LandingNavbar from './components/LandingNavbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TrustSection from './components/TrustSection';
import FAQSection from './components/FAQSection';
import CTASection from './components/CTASection';
import LandingFooter from './components/LandingFooter';

/**
 * LandingPage — Module 1
 * Full production-ready landing page for MedAssist AI.
 * Sections: Navbar → Hero → Stats → Features → How It Works → Trust & Privacy → FAQ → CTA → Footer
 */
const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[var(--bg-color)] text-[var(--text-primary)] relative"
    >
      {/* Animated background mesh */}
      <div className="mesh-bg" aria-hidden="true">
        <div className="mesh-circle-1" />
        <div className="mesh-circle-2" />
      </div>

      {/* Navigation */}
      <LandingNavbar />

      {/* Main content */}
      <main id="main-content">
        {/* 1. Hero */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* 2. Count-up statistics */}
        <section id="stats">
          <StatsSection />
        </section>

        {/* 3. Feature cards grid */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* 4. How It Works stepper */}
        <section id="how-it-works">
          <HowItWorksSection />
        </section>

        {/* 5. Trust & Privacy */}
        <section id="trust">
          <TrustSection />
        </section>

        {/* 6. FAQ accordion */}
        <section id="faq">
          <FAQSection />
        </section>

        {/* 7. Final CTA */}
        <section id="cta">
          <CTASection />
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </motion.div>
  );
};

export default LandingPage;
