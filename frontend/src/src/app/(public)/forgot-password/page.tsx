"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertCircle, ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email address.");
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.error === "auth/user-not-found") {
          throw new Error("❌ No account found with this email.");
        } else if (data.error === "auth/invalid-email") {
          throw new Error("❌ Invalid email format.");
        } else {
          throw new Error(data.error || "Failed to send reset email.");
        }
      }
      
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center items-center relative overflow-hidden bg-background py-12 px-4">
      {/* Static Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full opacity-30 dark:opacity-20" 
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }} 
        />
        <div 
          className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full opacity-30 dark:opacity-20" 
          style={{ background: "radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)" }} 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 90, damping: 20, mass: 0.8 }}
        className="w-full max-w-5xl z-10"
      >
        <div className="bg-card dark:bg-slate-900/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse">
          
          {/* Right Side - Branding */}
          <div className="hidden md:flex md:w-5/12 bg-primary/5 p-12 flex-col justify-between relative overflow-hidden border-l border-border/50">
            <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary mb-6 shadow-lg shadow-primary/30">
                <Brain className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Secure Password Recovery</h2>
              <p className="text-muted-foreground">
                We use industry-standard encryption and secure token generation to ensure your account remains safe.
              </p>
            </div>

            <div className="relative z-10 mt-12 bg-background/50 backdrop-blur-md rounded-2xl p-6 border border-border/50">
               <div className="flex items-start gap-4">
                 <div className="bg-primary/20 p-3 rounded-full text-primary">
                   <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                   <h4 className="font-bold text-foreground mb-1">Bank-level Security</h4>
                   <p className="text-sm text-muted-foreground">Your health data is protected behind multiple layers of security. Reset links expire automatically after a short period.</p>
                 </div>
               </div>
            </div>
            
            <div className="absolute -bottom-24 -right-24 w-64 h-64 border border-primary/20 rounded-full"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 border border-primary/20 rounded-full"></div>
          </div>

          {/* Left Side - Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-8 group font-medium">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to login
            </Link>

            <div className="flex flex-col mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Forgot Password?</h1>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                No worries! Enter your registered email address below and we'll send you a secure link to reset your password.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!success ? (
              <motion.form 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleResetPassword} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="px-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com" 
                    className="h-12 px-4 rounded-xl bg-background/50 backdrop-blur-sm transition-all focus:bg-background" 
                    disabled={loading}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={loading || !email} 
                    className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium transition-all active:scale-[0.98]"
                  >
                    {loading ? (
                      <motion.div 
                        className="flex items-center justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <ShieldCheck className="h-5 w-5 animate-pulse" />
                        <span>Sending Request...</span>
                      </motion.div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Check your inbox</h3>
                <p className="text-muted-foreground mb-6">
                  We've sent a password reset link to <strong className="text-foreground">{email}</strong>. 
                  Please check your spam folder if you don't see it within a few minutes.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => setSuccess(false)}
                  className="rounded-xl"
                >
                  Try another email
                </Button>
              </motion.div>
            )}
            
            <div className="mt-10 flex items-center justify-between">
              <span className="w-full border-t border-border/60"></span>
              <span className="px-4 text-xs text-muted-foreground uppercase font-semibold tracking-wider whitespace-nowrap">Need more help?</span>
              <span className="w-full border-t border-border/60"></span>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Contact our <Link href="/help" className="text-primary font-medium hover:underline">support team</Link> if you no longer have access to your email.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
