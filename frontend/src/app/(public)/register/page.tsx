"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<"google" | "email" | null>(null);
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return setError("Firebase is not configured. Please add your .env.local credentials.");
    if (!firstName || !lastName || !email || !password) return setError("Please fill in all fields.");
    
    setLoading(true);
    setLoadingProvider("email");
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("⚠ Email already registered. Please sign in.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleProviderLogin = async (providerName: "google") => {
    if (!auth) return setError("Firebase is not configured. Please add your .env.local credentials.");
    setLoading(true);
    setLoadingProvider(providerName);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      if (
        err.code === "auth/popup-closed-by-user" ||
        err.code === "auth/cancelled-popup-request" ||
        err.code === "auth/popup-blocked"
      ) {
        // Do nothing — user just cancelled
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("⚠ This email is already registered with a different provider.");
      } else {
        setError(`Failed to sign up with ${providerName}. Please try again.`);
      }
    } finally {
      setLoading(false);
      setLoadingProvider(null);
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
        <div className="bg-card dark:bg-slate-900/80 backdrop-blur-xl border border-border/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side - Branding */}
          <div className="hidden md:flex md:w-5/12 bg-primary/5 p-12 flex-col justify-between relative overflow-hidden border-r border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary mb-6 shadow-lg shadow-primary/30">
                <Brain className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Start your health journey.</h2>
              <p className="text-muted-foreground">
                Join thousands of users who are taking control of their medical data with the power of artificial intelligence.
              </p>
            </div>

            <div className="relative z-10 mt-12 bg-background/50 backdrop-blur-md rounded-2xl p-6 border border-border/50">
              <p className="italic text-sm text-foreground/80 mb-4">
                &quot;MedAssist AI completely transformed how I track my symptoms and consult with professionals.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  SJ
                </div>
                <div className="text-xs">
                  <p className="font-bold text-foreground">Sarah Jenkins</p>
                  <p className="text-muted-foreground">Verified User</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-24 -left-24 w-64 h-64 border border-primary/20 rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 border border-primary/20 rounded-full"></div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 lg:p-16">
            <div className="flex flex-col mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your details below to get started.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl flex items-center gap-2 border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm px-4 py-3 rounded-xl border border-emerald-500/20">
                    🎉 Account Created Successfully. Redirecting...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="px-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">First name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John" 
                    className="h-12 px-4 rounded-xl bg-background/50 backdrop-blur-sm transition-all focus:bg-background" 
                    disabled={loading || success}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="px-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Last name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe" 
                    className="h-12 px-4 rounded-xl bg-background/50 backdrop-blur-sm transition-all focus:bg-background" 
                    disabled={loading || success}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="px-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" 
                  className="h-12 px-4 rounded-xl bg-background/50 backdrop-blur-sm transition-all focus:bg-background" 
                  disabled={loading || success}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="px-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="h-12 px-4 rounded-xl bg-background/50 backdrop-blur-sm transition-all focus:bg-background" 
                  disabled={loading || success}
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading || success}
                  className="w-full h-12 rounded-xl text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 font-medium transition-all active:scale-[0.98] relative overflow-hidden"
                >
                  {loading && !success ? (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ShieldCheck className="h-5 w-5 animate-pulse" />
                      <span>Creating Account</span>
                      <span className="flex gap-0.5">
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="text-lg">.</motion.span>
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="text-lg">.</motion.span>
                        <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="text-lg">.</motion.span>
                      </span>
                    </motion.div>
                  ) : success ? (
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <span>✅</span>
                      <span>Account Created!</span>
                    </motion.div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 flex items-center justify-between">
              <span className="w-full border-t border-border/60"></span>
              <span className="px-4 text-xs text-muted-foreground uppercase font-semibold tracking-wider whitespace-nowrap">Or continue with</span>
              <span className="w-full border-t border-border/60"></span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => handleProviderLogin("google")}
                disabled={loading || success}
                className={`h-12 rounded-xl bg-background/50 hover:bg-muted border-border/60 hover:border-border transition-all relative overflow-hidden ${
                  loadingProvider === "google" ? "border-primary/50 bg-primary/5" : ""
                }`}
              >
                {loadingProvider === "google" ? (
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </motion.div>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </>
                )}
                {loadingProvider === "google" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </Button>
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
