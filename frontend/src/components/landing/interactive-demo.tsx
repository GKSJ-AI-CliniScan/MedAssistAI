"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, FastForward, Brain, Activity, ShieldCheck, HeartPulse, FileText, UploadCloud, Search, CheckCircle2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InteractiveDemoProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAnalysis?: () => void;
}

export function InteractiveDemo({ isOpen, onClose, onStartAnalysis }: InteractiveDemoProps) {
  const router = useRouter();
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [duration, setDuration] = useState(150); // Total 150 seconds
  const [isDemoLoading, setIsDemoLoading] = useState(true);
  
  const PROCESS_STEPS = [
    "Comparing Symptoms to Database...",
    "Running Deep Learning Models...",
    "Generating Predictions...",
    "Finalizing Report..."
  ];
  
  // Ref to track if we've fired analytics
  const analyticsFired = useRef({ start: false, end: false });

  // Setup demo
  useEffect(() => {
    if (isOpen && !hasStarted) {
      setIsDemoLoading(true);
      
      setDuration(150);
      
      // Show "Loading Demo..." for 1 second before starting
      setTimeout(() => {
        setIsDemoLoading(false);
        setHasStarted(true);
        setIsPlaying(true);
        
        if (!analyticsFired.current.start) {
          analyticsFired.current.start = true;
        }
      }, 1000);
    }
  }, [isOpen, hasStarted]);

  // Handle Playback Timer (fast-forwarded slightly for better UX)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying && time < duration) {
      interval = setInterval(() => {
        setTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            
            // Track Completion
            if (!analyticsFired.current.end) {
              analyticsFired.current.end = true;
            }
            return duration;
          }
          // We increment by 1 for the timeline, but the interval is faster so the demo doesn't feel agonizingly slow.
          return prev + 1;
        });
      }, 500); // Demo plays at 2x real speed
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, time, duration]);

  // Handle Close / Skip
  const handleClose = () => {
    
    // Reset state
    setTime(0);
    setIsPlaying(false);
    setHasStarted(false);
    analyticsFired.current = { start: false, end: false };
    onClose();
  };

  const handleSkip = () => {
    setTime(120); // Skip directly to Final CTA
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine which scene to show
  const getScene = () => {
    if (time < 15) return 1;
    if (time < 40) return 2;
    if (time < 60) return 3;
    if (time < 90) return 4;
    if (time < 120) return 5;
    return 6;
  };

  const currentScene = getScene();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {isDemoLoading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/90"
          >
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border border-white/20 mb-4"
            >
              <Brain className="w-8 h-8 text-white drop-shadow-md" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">Loading Demo...</h3>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={handleClose}
        className="absolute top-6 right-6 p-3 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors z-40"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Demo Stage */}
      <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
        
        {/* SCENE CONTENT STAGE */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            
            {/* Scene 1: Welcome & Dashboard */}
            {currentScene === 1 && (
              <motion.div key="scene1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="text-center w-full">
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }} className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg border border-white/20 mx-auto mb-6">
                  <Brain className="w-12 h-12 text-white drop-shadow-md" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Welcome to MedAssist AI</h1>
                <p className="text-xl text-blue-200">The Future of AI Healthcare</p>
                <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="h-24 bg-white/5 rounded-2xl border border-white/10 shadow-inner flex flex-col items-center justify-center p-4">
                    <Activity className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-sm text-slate-300 font-medium">Heart Rate</span>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="h-24 bg-white/5 rounded-2xl border border-white/10 col-span-2 shadow-inner flex flex-col justify-center px-6">
                    <div className="flex justify-between items-center w-full">
                       <div>
                         <p className="text-sm text-slate-400">Latest Report</p>
                         <p className="text-white font-semibold mt-1">Complete Blood Count</p>
                       </div>
                       <FileText className="w-8 h-8 text-indigo-400 opacity-50" />
                    </div>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="h-24 bg-white/5 rounded-2xl border border-white/10 col-span-3 shadow-inner flex items-center px-6 gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Health Score: 92/100</p>
                      <p className="text-sm text-slate-400">Your vitals are looking great this week.</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Scene 2: Symptom Analysis */}
            {currentScene === 2 && (
              <motion.div key="scene2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><Search className="w-6 h-6 text-blue-400" /> Patient Symptoms</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-800/80 rounded-2xl p-5 flex gap-4 items-start shadow-inner border border-white/5">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center shrink-0"><User className="text-slate-300 w-5 h-5"/></div>
                    <div>
                      <p className="text-white text-lg leading-relaxed">"I've had a severe headache and fever for the last 3 days."</p>
                    </div>
                  </div>
                  
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.5 }} className="bg-blue-900/40 rounded-2xl p-5 border border-blue-500/30">
                     <p className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider">AI Extracted Symptoms</p>
                     <div className="flex gap-2 flex-wrap">
                       <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.2, type: "spring" }} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Headache</motion.span>
                       <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.4, type: "spring" }} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> Fever</motion.span>
                       <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2.6, type: "spring" }} className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5"/> 3 Days Duration</motion.span>
                     </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Scene 3: Report Upload */}
            {currentScene === 3 && (
              <motion.div key="scene3" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="text-center w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Uploading Lab Reports...</h2>
                <div className="border-2 border-dashed border-blue-500/50 bg-blue-500/5 rounded-3xl p-12 flex flex-col items-center">
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <UploadCloud className="w-16 h-16 text-blue-400 mb-4" />
                  </motion.div>
                  <p className="text-blue-200 mb-6">Blood_Test_Results.pdf</p>
                  
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: (60-40)/2, ease: "linear" }} 
                    />
                  </div>
                  <p className="text-sm text-blue-300 mt-2">Extracting Text via OCR...</p>
                </div>
              </motion.div>
            )}

            {/* Scene 4: AI Processing */}
            {currentScene === 4 && (
              <motion.div key="scene4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 mb-10">
                  <div className="absolute inset-0 bg-indigo-500/40 blur-3xl rounded-full animate-pulse"></div>
                  <div className="relative w-full h-full bg-slate-800 rounded-full flex items-center justify-center border-2 border-indigo-500/50 shadow-2xl">
                    <Brain className="w-16 h-16 text-indigo-400 animate-pulse drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                  </div>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute -inset-6 rounded-full border border-dashed border-indigo-500/40 opacity-70" />
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-3">Analyzing Data</h2>
                <div className="h-10 overflow-hidden flex items-center justify-center text-indigo-300 font-medium relative w-full max-w-sm">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={Math.min(Math.floor((Math.max(0, time - 60)) / 7.5), 3)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex items-center justify-center tracking-wide text-lg text-center"
                    >
                      {PROCESS_STEPS[Math.min(Math.floor((Math.max(0, time - 60)) / 7.5), 3)]}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Scene 5: Results */}
            {currentScene === 5 && (
              <motion.div key="scene5" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1 }} className="w-full max-w-4xl grid grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="col-span-1 bg-slate-800/80 border border-slate-700 rounded-3xl p-8 text-center flex flex-col items-center justify-center shadow-xl">
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                    <div className="relative w-28 h-28 rounded-full border-4 border-amber-500 flex items-center justify-center mb-6 bg-slate-900 shadow-inner">
                      <span className="text-4xl font-bold text-amber-500">62</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white">Moderate Risk</h3>
                  <p className="text-sm text-slate-400 mt-1 uppercase tracking-wider font-semibold">Health Score</p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="col-span-2 bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Activity className="w-6 h-6 text-blue-400"/> Possible Conditions</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2 font-medium"><span>Viral Fever</span> <span className="font-bold text-white">94%</span></div>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5"><motion.div initial={{width:0}} animate={{width:"94%"}} transition={{ delay: 0.5, duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-red-600 to-red-400"/></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-slate-300 mb-2 font-medium"><span>Influenza</span> <span className="font-bold text-white">72%</span></div>
                      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/5"><motion.div initial={{width:0}} animate={{width:"72%"}} transition={{ delay: 0.7, duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-orange-600 to-amber-400"/></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-3 bg-slate-800/80 border border-slate-700 rounded-3xl p-8 shadow-xl">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-green-400"/> Action Plan</h3>
                   <div className="grid grid-cols-3 gap-6">
                     <div className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4"/></div><p className="text-sm font-medium text-slate-200">Drink plenty of fluids</p></div>
                     <div className="bg-slate-900/60 border border-white/5 p-5 rounded-2xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4"/></div><p className="text-sm font-medium text-slate-200">Rest & Monitor Temp</p></div>
                     <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4"/></div><p className="text-sm font-medium text-amber-400">Consult Physician</p></div>
                   </div>
                </motion.div>
              </motion.div>
            )}

            {/* Scene 6: Final CTA */}
            {currentScene === 6 && (
              <motion.div key="scene6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">Ready to Experience AI Healthcare?</h2>
                <p className="text-xl text-slate-400 mb-8 max-w-xl mx-auto">Get your personalized health analysis and start taking control of your wellbeing today.</p>
                <div className="flex justify-center gap-4">
                  <Button size="lg" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold" onClick={() => {
                    handleClose();
                    if (onStartAnalysis) {
                      onStartAnalysis();
                    } else {
                      router.push('/dashboard/analysis');
                    }
                  }}>
                    Start Free Analysis
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-full font-semibold" onClick={handleClose}>
                    Close Demo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM TIMELINE CONTROLS */}
        <div className="h-20 bg-slate-950 border-t border-white/10 px-6 flex items-center gap-6">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>

          <div className="text-sm font-mono text-slate-400 shrink-0 w-12">
            {formatTime(time)}
          </div>

          {/* Progress Bar */}
          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden relative cursor-not-allowed group">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-blue-500"
              style={{ width: `${(time / duration) * 100}%` }}
              layout
            />
            
            {/* Timeline markers */}
            <div className="absolute top-0 left-[10%] w-[1px] h-full bg-white/20"></div>
            <div className="absolute top-0 left-[26%] w-[1px] h-full bg-white/20"></div>
            <div className="absolute top-0 left-[40%] w-[1px] h-full bg-white/20"></div>
            <div className="absolute top-0 left-[60%] w-[1px] h-full bg-white/20"></div>
            <div className="absolute top-0 left-[80%] w-[1px] h-full bg-white/20"></div>
          </div>

          <div className="text-sm font-mono text-slate-400 shrink-0 w-12">
            {formatTime(duration)}
          </div>

          <button 
            onClick={handleSkip}
            disabled={time >= 120}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/5 hover:bg-white/10 text-white transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip <FastForward className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
