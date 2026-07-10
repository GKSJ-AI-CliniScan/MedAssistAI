"use client";

import { motion } from "framer-motion";
import { Users, ActivitySquare, BadgeCheck, Clock } from "lucide-react";

const stats = [
  { label: "Patients", value: "100K+", icon: Users },
  { label: "Predictions", value: "500K+", icon: ActivitySquare },
  { label: "Accuracy", value: "98%", icon: BadgeCheck },
  { label: "Availability", value: "24/7", icon: Clock },
];

export function StatsSection() {
  return (
    <section className="py-12 bg-primary relative overflow-hidden">
      {/* Abstract Background Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0H40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-primary-foreground">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="p-4 bg-primary-foreground/10 rounded-2xl backdrop-blur-sm border border-primary-foreground/20 shadow-inner">
                <stat.icon className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h4 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{stat.value}</h4>
                <p className="text-primary-foreground/80 font-medium text-lg">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
