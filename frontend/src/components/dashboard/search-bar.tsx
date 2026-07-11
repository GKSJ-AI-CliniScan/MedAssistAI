"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import {
  LayoutDashboard,
  Stethoscope,
  BrainCircuit,
  FileText,
  History,
  Calendar,
  LineChart,
  Pill,
  User,
  Settings,
  HeartPulse,
  Droplet,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Search Index ───
// Each entry represents a searchable item with keywords for matching

interface SearchEntry {
  id: string;
  title: string;
  description: string;
  keywords: string[];   // extra tokens for fuzzy/synonym matching
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "page" | "action" | "medical";
}

const SEARCH_INDEX: SearchEntry[] = [
  // Pages
  { id: "dashboard",      title: "Dashboard",          description: "View your health summary and overview",                    keywords: ["home", "overview", "summary", "main", "stats"],          href: "/dashboard",                    icon: LayoutDashboard, category: "page" },
  { id: "symptom",        title: "Symptom Checker",    description: "Analyze your symptoms with AI",                           keywords: ["symptoms", "check", "pain", "fever", "sick", "illness", "headache", "cough", "analyze"], href: "/dashboard/symptom-checker", icon: Stethoscope, category: "page" },
  { id: "prediction",     title: "Disease Prediction", description: "AI-powered disease risk analysis",                        keywords: ["predict", "disease", "risk", "diagnosis", "ai", "analysis", "prognosis"],                href: "/dashboard/prediction",      icon: BrainCircuit, category: "page" },
  { id: "reports",        title: "Medical Reports",    description: "Upload and view your lab results",                        keywords: ["report", "lab", "results", "blood", "test", "upload", "pdf", "document"],                href: "/dashboard/reports",         icon: FileText, category: "page" },
  { id: "history",        title: "Medical History",     description: "Track your past medical records",                         keywords: ["history", "past", "records", "surgery", "previous", "timeline"],                         href: "/dashboard/history",         icon: History, category: "page" },
  { id: "appointments",   title: "Appointments",       description: "Schedule and manage doctor visits",                       keywords: ["appointment", "doctor", "visit", "schedule", "booking", "calendar", "meet"],             href: "/dashboard/appointments",    icon: Calendar, category: "page" },
  { id: "insights",       title: "Health Insights",    description: "Personalized health analytics and trends",                keywords: ["insight", "analytics", "trends", "chart", "graph", "data", "health"],                    href: "/dashboard/insights",        icon: LineChart, category: "page" },
  { id: "medications",    title: "Medications",        description: "Track prescriptions and dosages",                         keywords: ["medication", "medicine", "drug", "prescription", "dose", "pill", "tablet", "pharmacy"],   href: "/dashboard/medications",     icon: Pill, category: "page" },
  { id: "profile",        title: "Profile",            description: "Manage your personal information",                        keywords: ["profile", "account", "personal", "info", "name", "email", "phone"],                      href: "/dashboard/profile",         icon: User, category: "page" },
  { id: "settings",       title: "Settings",           description: "App preferences and security",                            keywords: ["settings", "preferences", "security", "password", "config", "account"],                  href: "/dashboard/settings",        icon: Settings, category: "page" },

  // Quick medical actions
  { id: "blood-type",     title: "Update Blood Type",  description: "Set your blood type in your medical profile",              keywords: ["blood", "type", "o+", "a+", "b+", "ab", "rh"],                                          href: "/dashboard/profile",         icon: Droplet, category: "medical" },
  { id: "allergies",      title: "Manage Allergies",   description: "Update your known allergies list",                         keywords: ["allergy", "allergies", "allergic", "reaction", "peanut", "penicillin"],                   href: "/dashboard/profile",         icon: ShieldAlert, category: "medical" },
  { id: "vitals",         title: "Health Vitals",      description: "Track your heart rate, BP, and vitals",                    keywords: ["vitals", "heart", "rate", "blood", "pressure", "bp", "pulse", "oxygen"],                  href: "/dashboard/insights",        icon: HeartPulse, category: "medical" },
  { id: "activity-log",   title: "Activity Log",       description: "View your recent dashboard activity",                     keywords: ["activity", "log", "recent", "audit", "actions"],                                         href: "/dashboard",                 icon: Activity, category: "action" },
];

// ─── Fuzzy Match Algorithm ───
// Uses a scoring system: exact match > starts-with > includes > keyword match
// Returns a score 0–100, where 0 = no match

function computeScore(query: string, entry: SearchEntry): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const title = entry.title.toLowerCase();
  const desc = entry.description.toLowerCase();
  const tokens = q.split(/\s+/);

  let score = 0;

  // 1. Exact title match → highest priority
  if (title === q) return 100;

  // 2. Title starts with query
  if (title.startsWith(q)) score = Math.max(score, 90);

  // 3. Title contains query as substring
  if (title.includes(q)) score = Math.max(score, 75);

  // 4. Description contains query
  if (desc.includes(q)) score = Math.max(score, 50);

  // 5. Per-token matching against title + keywords
  let tokenHits = 0;
  for (const token of tokens) {
    if (token.length < 1) continue;
    const hitTitle = title.includes(token);
    const hitKeyword = entry.keywords.some(k => k.startsWith(token) || k.includes(token));
    const hitDesc = desc.includes(token);

    if (hitTitle) { tokenHits += 3; }
    else if (hitKeyword) { tokenHits += 2; }
    else if (hitDesc) { tokenHits += 1; }
  }

  if (tokens.length > 0) {
    const tokenScore = Math.min(70, (tokenHits / (tokens.length * 3)) * 70);
    score = Math.max(score, tokenScore);
  }

  // 6. Fuzzy: check if query chars appear in order within title (subsequence match)
  if (score === 0) {
    let qi = 0;
    for (let i = 0; i < title.length && qi < q.length; i++) {
      if (title[i] === q[qi]) qi++;
    }
    if (qi === q.length) {
      score = Math.max(score, 30);
    }
  }

  return score;
}

function searchEntries(query: string): SearchEntry[] {
  if (!query.trim()) return [];

  const scored = SEARCH_INDEX
    .map(entry => ({ entry, score: computeScore(query, entry) }))
    .filter(s => s.score > 10)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 8).map(s => s.entry);
}

// ─── Component ───

export function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(() => searchEntries(query), [query]);

  // Reset selection when results change
  useEffect(() => { setSelectedIndex(0); }, [results]);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback((href: string) => {
    router.push(href);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(results[selectedIndex].href);
    }
  };

  const categoryLabel = (cat: string) => {
    switch (cat) {
      case "page": return "Pages";
      case "action": return "Quick Actions";
      case "medical": return "Medical";
      default: return "Results";
    }
  };

  // Group results by category for display
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchEntry[]> = {};
    for (const r of results) {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    }
    return groups;
  }, [results]);

  let flatIndex = 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md hidden md:flex">
      {/* ─── Search Input ─── */}
      <div className={cn(
        "relative w-full rounded-2xl transition-all duration-500",
        isOpen && query.trim()
          ? "shadow-[0_0_30px_-5px_hsl(var(--primary)/0.25)]"
          : ""
      )}>
        <Search className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none z-10 transition-colors duration-300",
          isOpen ? "text-primary" : "text-muted-foreground"
        )} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search symptoms, reports, or history..."
          className={cn(
            "w-full h-11 pl-11 pr-20 rounded-2xl text-sm font-medium",
            "bg-muted/40 border border-border/30",
            "focus:outline-none focus:border-primary/60 focus:bg-background/90 focus:shadow-lg focus:shadow-primary/10",
            "transition-all duration-400 placeholder:text-muted-foreground/60"
          )}
        />
      </div>

      {/* ─── Results Dropdown ─── */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 z-50 animate-in fade-in slide-in-from-top-3 duration-300 ease-out">
          {/* Outer glow */}
          <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-xl pointer-events-none opacity-50" />

          {/* Main dropdown */}
          <div className="relative rounded-[1.5rem] border border-border bg-popover text-popover-foreground shadow-2xl overflow-hidden">
            {/* Subtle gradient top edge */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {results.length === 0 ? (
              /* ─── Empty State ─── */
              <div className="px-6 py-10 text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-semibold text-muted-foreground">No results found</p>
                <p className="text-xs text-muted-foreground/50 mt-1.5">Try &quot;symptoms&quot;, &quot;reports&quot;, or &quot;medications&quot;</p>
              </div>
            ) : (
              /* ─── Results List ─── */
              <div className="py-2 max-h-[400px] overflow-y-auto">
                {Object.entries(groupedResults).map(([category, items]) => (
                  <div key={category} className="mb-1 last:mb-0">
                    {/* Category Header */}
                    <div className="px-5 py-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.15em]">
                        {categoryLabel(category)}
                      </span>
                      <div className="flex-1 h-px bg-gradient-to-r from-border/40 to-transparent" />
                    </div>

                    {/* Items */}
                    {items.map((item) => {
                      const currentIdx = flatIndex++;
                      const isSelected = currentIdx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item.href)}
                          onMouseEnter={() => setSelectedIndex(currentIdx)}
                          style={{ animationDelay: `${currentIdx * 30}ms`, width: "calc(100% - 8px)" }}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 mx-1 rounded-xl text-left transition-all duration-200 group animate-in fade-in slide-in-from-bottom-1 fill-mode-both",
                            isSelected
                              ? "bg-primary/10 shadow-sm shadow-primary/5"
                              : "hover:bg-muted/40"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 border",
                            isSelected
                              ? "bg-primary/15 border-primary/20 text-primary scale-105 shadow-md shadow-primary/10"
                              : "bg-muted/40 border-border/30 text-muted-foreground group-hover:text-foreground group-hover:border-border/50"
                          )}>
                            <item.icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-semibold truncate transition-colors duration-200",
                              isSelected ? "text-primary" : "text-foreground"
                            )}>
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground/70 truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                            isSelected
                              ? "bg-primary/15 opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-2"
                          )}>
                            <ArrowRight className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}

                {/* Footer */}
                <div className="mx-4 mt-1 px-4 py-2.5 rounded-xl bg-muted/30 border border-border/20 flex items-center justify-center gap-6 text-[10px] text-muted-foreground/50 font-medium">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/30 text-[9px]">↑</kbd>
                    <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/30 text-[9px]">↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted/60 border border-border/30 text-[9px]">↵</kbd>
                    open
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-muted/60 border border-border/30 text-[9px]">esc</kbd>
                    close
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

