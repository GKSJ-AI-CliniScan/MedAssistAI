import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export function LoginModal({ isOpen, onClose, redirectPath = "/dashboard/analysis" }: LoginModalProps) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm bg-card border border-border/50 shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Top glowing accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-primary"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              {/* Logo Area */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                    <Brain className="w-8 h-8 text-white drop-shadow-md" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Login Required</h2>
                <p className="text-sm text-muted-foreground">
                  You must be logged in to access the AI health analysis dashboard and save your reports.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="w-full rounded-xl h-11"
                >
                  Cancel
                </Button>
                <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="w-full block">
                  <Button 
                    className="w-full rounded-xl h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
