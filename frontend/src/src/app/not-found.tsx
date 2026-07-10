"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
          <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center relative border-4 border-primary/20 shadow-xl">
            <Activity className="h-16 w-16 text-primary" />
          </div>
        </div>

        <h1 className="text-7xl font-bold tracking-tight text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-muted-foreground mb-8 text-balance">
          It looks like this page is taking a sick day. Don&apos;t worry, we can get you back to health in no time.
        </p>

        <Link href="/">
          <Button className="rounded-full px-8 h-12 shadow-md hover:shadow-lg transition-all text-base">
            <ArrowLeft className="mr-2 h-5 w-5" /> Go Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
