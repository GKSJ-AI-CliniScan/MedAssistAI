"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Zap, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const sidebarSections = [
  {
    title: "Getting Started",
    items: [
      { id: "auth", label: "Authentication" },
      { id: "limits", label: "Rate Limits" },
      { id: "errors", label: "Errors & Webhooks" },
    ],
  },
  {
    title: "Endpoints",
    items: [
      { id: "analyze", label: "/v1/analyze", method: "POST", methodColor: "text-blue-400" },
      { id: "scan", label: "/v1/vision/scan", method: "POST", methodColor: "text-blue-400" },
      { id: "conditions", label: "/v1/conditions/:id", method: "GET", methodColor: "text-emerald-400" },
    ],
  },
];

const tabContent: Record<string, { title: string; description: string; snippet?: boolean }> = {
  auth: {
    title: "Authentication",
    description: "To use our API, you must authenticate all requests using a Bearer token. You can generate and manage your API keys from your developer dashboard.",
    snippet: true,
  },
  limits: {
    title: "Rate Limits",
    description: "Our API imposes rate limits to ensure stability and fair usage. The Free tier is limited to 100 requests per minute. Pro and Enterprise tiers offer significantly higher limits. When a rate limit is exceeded, you will receive a 429 Too Many Requests response.",
  },
  errors: {
    title: "Errors & Webhooks",
    description: "We use standard HTTP status codes to communicate the success or failure of a request. You can also subscribe to Webhooks to receive asynchronous updates when long-running analysis jobs are completed.",
  },
  analyze: {
    title: "POST /v1/analyze",
    description: "Analyze a set of symptoms and return a list of potential conditions with confidence scores. This endpoint expects a JSON array of symptom strings and patient metadata.",
  },
  scan: {
    title: "POST /v1/vision/scan",
    description: "Upload a medical image (X-ray, MRI, ultrasound, etc.) for automated AI anomaly detection. Supported formats include JPEG, PNG, and DICOM.",
  },
  conditions: {
    title: "GET /v1/conditions/:id",
    description: "Retrieve detailed clinical information, treatment guidelines, ICD-10 codes, and statistics for a specific medical condition.",
  },
};

export default function ApiDocsPage() {
  const [activeTab, setActiveTab] = useState("auth");
  const activeContent = tabContent[activeTab];

  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-background dark:text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 h-[600px] w-[600px] rounded-full bg-emerald-600/10 blur-[150px]" />
      </div>

      <section className="relative border-b border-white/[0.04] pb-16 pt-8 text-center lg:pb-20 lg:pt-12">
        <motion.div initial="hidden" animate="visible" className="mx-auto max-w-4xl px-6">
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
            <Terminal className="h-4 w-4" /> v2.0 REST API
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="mb-6 bg-gradient-to-b from-white to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
            Developer Documentation
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Integrate MedAssist AI's powerful diagnostic and reasoning engines directly into your own applications, EHR systems, or clinical workflows.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button className="group h-14 w-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/40 hover:brightness-110 sm:w-auto">
              Generate API Key <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" className="group h-14 w-full rounded-full border-white/[0.1] bg-white/[0.03] px-8 text-base font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/[0.2] hover:bg-white/[0.08] sm:w-auto">
              View OpenAPI Spec
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            {sidebarSections.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
                  {section.title}
                </h3>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex w-full items-center rounded-lg p-3 text-left transition-colors ${
                      activeTab === item.id
                        ? "border border-white/10 bg-white/5 font-medium text-emerald-400"
                        : "text-neutral-400 hover:bg-white/5"
                    }`}
                  >
                    {item.method && (
                      <span className={`mr-2 shrink-0 font-mono text-xs ${item.methodColor}`}>
                        {item.method}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="prose prose-invert max-w-none"
            >
              <h2 className="mb-6 border-b border-white/[0.06] pb-4 text-3xl font-bold text-white">
                {activeContent.title}
              </h2>
              <p className="mb-6 leading-relaxed text-neutral-400">
                {activeContent.description}
              </p>
              
              {activeContent.snippet && (
                <div className="mb-12 overflow-hidden rounded-xl border border-white/[0.1] bg-black">
                  <div className="flex items-center border-b border-white/[0.1] bg-white/[0.02] px-4 py-2">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80"></div>
                      <div className="h-3 w-3 rounded-full bg-amber-500/80"></div>
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="ml-4 font-mono text-xs text-neutral-500">cURL Example</span>
                  </div>
                  <div className="overflow-x-auto p-6">
                    <pre className="font-mono text-sm text-emerald-300">
                      <code>
  <span className="text-blue-400">curl</span> -X POST https://api.medassist.ai/v1/analyze \<br/>
    -H <span className="text-amber-300">"Authorization: Bearer YOUR_API_KEY"</span> \<br/>
    -H <span className="text-amber-300">"Content-Type: application/json"</span> \<br/>
    -d <span className="text-emerald-300">'{'{'} "symptoms": ["fever", "cough", "fatigue"] {'}'}'</span>
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <Shield className="mb-4 h-8 w-8 text-blue-400" />
                  <h4 className="mb-2 text-lg font-bold text-white">HIPAA Compliant</h4>
                  <p className="text-sm text-neutral-400">
                    All API endpoints use TLS 1.3 and meet BAA requirements for healthcare data.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                  <Zap className="mb-4 h-8 w-8 text-amber-400" />
                  <h4 className="mb-2 text-lg font-bold text-white">Low Latency</h4>
                  <p className="text-sm text-neutral-400">
                    Our edge-deployed inference engine returns comprehensive analysis in {"<"}200ms.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
    </main>
  );
}

