"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, CheckCircle } from "lucide-react";

const Facebook = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Twitter = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Instagram = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Linkedin = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (error) {
      console.error("Newsletter error", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="w-full border-t border-border/40 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Brain className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">MedAssist AI</span>
            </Link>
            <p className="text-muted-foreground text-balance max-w-md">
              Empowering healthcare with artificial intelligence. Predict, analyze, and manage your health seamlessly with our premium medical platform.
            </p>
            <div className="flex gap-2 items-center">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "group rounded-full hover:bg-neutral-800/10 dark:hover:bg-neutral-200/10 hover:text-foreground transition-all duration-300 hover:scale-110 active:scale-95 text-muted-foreground")}>
                <Twitter className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">X (Twitter)</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "group rounded-full hover:bg-blue-600/10 hover:text-blue-600 transition-all duration-300 hover:scale-110 active:scale-95 text-muted-foreground")}>
                <Facebook className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "group rounded-full hover:bg-pink-500/10 hover:text-pink-500 transition-all duration-300 hover:scale-110 active:scale-95 text-muted-foreground")}>
                <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "group rounded-full hover:bg-blue-700/10 hover:text-blue-700 transition-all duration-300 hover:scale-110 active:scale-95 text-muted-foreground")}>
                <Linkedin className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Products</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/symptom-checker" className="text-muted-foreground hover:text-primary transition-colors">Symptom Checker</Link></li>
              <li><Link href="/api-docs" className="text-muted-foreground hover:text-primary transition-colors">API</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} MedAssist AI Inc. All rights reserved.
          </p>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-sm items-center space-x-2 mt-4 md:mt-0">
            {subscribed ? (
              <div className="flex items-center text-emerald-500 font-medium px-4 h-10">
                <CheckCircle className="h-5 w-5 mr-2" /> Subscribed successfully!
              </div>
            ) : (
              <>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" 
                  required
                  className="rounded-full bg-background border-border h-10 min-w-[200px] md:min-w-[250px] shadow-sm"
                />
                <Button type="submit" disabled={isSubscribing} className="rounded-full h-10 px-6 font-medium shadow-md">
                  {isSubscribing ? "Wait..." : "Subscribe"}
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </footer>
  );
}
