"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Brain } from "lucide-react";

export function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A fast, premium short delay to provide a smooth reveal
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          {/* Animated Brain with Scanning Line and Ripples */}
          <div className="relative flex items-center justify-center">
            {/* Background Ripples */}
            <motion.div 
              animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-primary/20 blur-[2px]"
            />
            <motion.div 
              animate={{ scale: [1, 3], opacity: [0.4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: 0.5 }}
              className="absolute inset-0 rounded-full border border-primary/30"
            />
            
            {/* Core Brain Icon */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="relative bg-background/50 backdrop-blur-sm rounded-full p-6 z-10 border border-border/50 shadow-2xl shadow-primary/20"
            >
              <div className="relative h-20 w-20 lg:h-24 lg:w-24">
                {/* Glowing Nerves Effect (Blurred back layer) */}
                <Brain className="absolute inset-0 h-full w-full text-primary blur-[6px] animate-pulse opacity-100" strokeWidth={2.5} />
                {/* Sharp Core Nerves (Front layer) */}
                <Brain className="absolute inset-0 h-full w-full text-primary dark:text-white" strokeWidth={1.5} />
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mt-10"
          >
            <span className="text-sm font-bold tracking-[0.25em] text-foreground uppercase bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
              MedAssist AI
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
