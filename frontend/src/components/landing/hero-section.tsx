"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Shield, Brain, Activity, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "@/components/auth/login-modal";
import { InteractiveDemo } from "@/components/landing/interactive-demo";

export function HeroSection() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  
  // Mock auth state
  const isLoggedIn = false;

  const handleStartAnalysis = (e?: React.MouseEvent) => {
    if (!isLoggedIn) {
      if (e) e.preventDefault();
      setIsLoginModalOpen(true);
    } else if (!e) {
      // If called programmatically from the demo
      window.location.href = '/dashboard/analysis';
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAFBFF] pt-8 pb-16 lg:pt-12 lg:pb-24 dark:bg-background">
      {/* Background Gradient Blobs (Optimized for performance) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden -z-10 pointer-events-none">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-30 dark:opacity-20" 
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }} 
        />
        <div 
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full opacity-30 dark:opacity-20" 
          style={{ background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)" }} 
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E5F0FF] text-primary w-fit mx-auto lg:mx-0 border border-primary/10 shadow-sm dark:bg-primary/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide">MedAssist AI v2.0 is Live</span>
            </div>
            
            <h1 className="text-5xl lg:text-[72px] font-extrabold leading-[1.1] tracking-tight text-[#0F172A] dark:text-foreground text-balance">
              AI-Powered <br className="hidden lg:block" />
              Medical Assistant <br className="hidden lg:block" />
              for <span className="text-[#2563EB] dark:text-primary">Smarter</span> <br className="hidden lg:block" />
              <span className="text-[#2563EB] dark:text-primary">Healthcare</span>
            </h1>
            
            <p className="text-[17px] text-slate-500 dark:text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-[1.7] font-medium">
              Analyze symptoms using Artificial Intelligence. Predict diseases with confidence scores, generate comprehensive health reports, and receive instant healthcare recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <Link href="/dashboard/analysis" className="w-full sm:w-auto" onClick={handleStartAnalysis}>
                <Button size="lg" className="rounded-full h-14 px-8 text-base bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-xl shadow-blue-500/20 transition-all group w-full font-semibold">
                  Start Analysis
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-base bg-white dark:bg-background/50 border-slate-200 dark:border-border text-slate-700 dark:text-foreground hover:bg-slate-50 w-full sm:w-auto font-semibold shadow-sm" onClick={() => setIsDemoModalOpen(true)}>
                Watch Demo
              </Button>
            </div>
          </motion.div>

          {/* Right Side: Visuals & Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.2 }}
            className="relative h-[400px] lg:h-[500px] w-full flex items-start justify-center mt-10 lg:mt-[44px]"
          >
            {/* Stable Wrapper for absolute positioning */}
            <div className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] flex items-center justify-center" style={{ willChange: "transform" }}>
              
              {/* Concentric Rings Background */}
              <div 
                className="absolute inset-0 rounded-full border border-slate-200 dark:border-border/50 border-dashed animate-spin-slow" 
              />
              <div className="absolute inset-[12%] rounded-full border border-slate-200 dark:border-border/50" />
              
              {/* Central Graphic */}
              <div className="relative w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-[#EEF5FF] dark:bg-primary/10 flex items-center justify-center z-10 shadow-inner border border-primary/5 dark:border-primary/20">
                <motion.div
                  animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Brain className="h-24 w-24 lg:h-32 lg:w-32 text-[#2563EB] dark:text-primary drop-shadow-sm" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Floating Card 1: Health Score */}
              <div 
                className="absolute top-[5%] left-[-15%] lg:left-[-10%] bg-white dark:bg-card border border-slate-100 dark:border-border p-4 rounded-3xl flex items-center gap-4 min-w-[190px] lg:min-w-[210px] shadow-xl shadow-slate-200/50 dark:shadow-none z-20 animate-float will-change-transform"
              >
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-[#E5F8ED] dark:bg-success/20 flex items-center justify-center text-[#10B981] dark:text-success shrink-0">
                  <HeartPulse className="h-5 w-5 lg:h-6 lg:w-6 animate-heartbeat" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-[12px] lg:text-[13px] text-slate-500 dark:text-muted-foreground font-semibold">Health Score</p>
                  <p className="text-lg lg:text-xl font-bold text-slate-900 dark:text-foreground leading-tight">98/100</p>
                </div>
              </div>

              {/* Floating Card 2: Risk Level */}
              <div 
                className="absolute bottom-[5%] left-[-5%] lg:left-[0%] bg-white/95 dark:bg-card/95 backdrop-blur-md border border-slate-100 dark:border-border/80 p-4 rounded-3xl flex items-center gap-4 min-w-[200px] lg:min-w-[220px] shadow-xl shadow-slate-200/50 dark:shadow-primary/5 z-20 animate-float-delayed will-change-transform group/risk"
              >
                {/* Glowing icon with animated ring */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 animate-ping opacity-30"></div>
                  <div className="relative h-11 w-11 lg:h-13 lg:w-13 rounded-full bg-gradient-to-br from-[#E8F0FE] to-[#D5E3FC] dark:from-primary/20 dark:to-primary/10 flex items-center justify-center text-[#2563EB] dark:text-primary shadow-inner border border-primary/10">
                    <Shield className="h-5 w-5 lg:h-6 lg:w-6 drop-shadow-sm animate-pulse" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] lg:text-[12px] text-slate-400 dark:text-muted-foreground font-semibold uppercase tracking-wider">Risk Level</p>
                  <div className="flex items-center gap-2">
                    <p className="text-base lg:text-lg font-extrabold text-[#10B981] dark:text-success leading-tight">Low Risk</p>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Card 3: Disease Prediction */}
              <div 
                className="absolute top-[40%] right-[-20%] lg:right-[-15%] bg-white dark:bg-card border border-slate-100 dark:border-border p-4 lg:p-5 rounded-3xl flex flex-col gap-2 lg:gap-3 min-w-[220px] lg:min-w-[240px] shadow-xl shadow-slate-200/50 dark:shadow-none z-20 animate-float-slow will-change-transform"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] lg:text-[13px] text-slate-500 dark:text-muted-foreground font-semibold">AI Analysis</p>
                  <Brain className="h-3 w-3 lg:h-4 lg:w-4 text-[#2563EB] dark:text-primary animate-pulse" strokeWidth={2.5} />
                </div>
                <p className="text-base lg:text-lg font-bold text-slate-900 dark:text-foreground">Viral Infection</p>
                <div className="w-full bg-slate-100 dark:bg-muted rounded-full h-2 lg:h-2.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.8 }}
                    className="bg-[#2563EB] dark:bg-primary h-full rounded-full" 
                  />
                </div>
                <p className="text-[10px] lg:text-[11px] text-right text-slate-500 dark:text-muted-foreground font-medium">94% Confidence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <InteractiveDemo 
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onStartAnalysis={() => handleStartAnalysis()}
      />
    </section>
  );
}
