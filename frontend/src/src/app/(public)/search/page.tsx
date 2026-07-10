"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Stethoscope, Pill, Brain, FileText, User, Building2, AlertCircle, RefreshCw } from "lucide-react";
import { SearchCategory, SearchItem } from "@/app/api/search/route";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All Results", icon: Search },
  { id: "symptoms", label: "Symptoms", icon: AlertCircle },
  { id: "diseases", label: "Diseases", icon: Brain },
  { id: "medicines", label: "Medicines", icon: Pill },
];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("all");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Sort state (placeholder for UI)
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&category=${activeTab}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, activeTab]);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'symptoms': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'diseases': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'medicines': return <Pill className="w-4 h-4 text-blue-500" />;
      case 'articles': return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'doctors': return <User className="w-4 h-4 text-cyan-500" />;
      case 'hospitals': return <Building2 className="w-4 h-4 text-rose-500" />;
      default: return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'symptoms': return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case 'diseases': return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case 'medicines': return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case 'articles': return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case 'doctors': return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case 'hospitals': return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-8 pb-24">
      <div className="container max-w-5xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Search Results</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Results for <span className="text-primary bg-primary/10 px-2 py-1 rounded-md">&quot;{query}&quot;</span>
            </h1>
            <p className="text-muted-foreground">
              {loading ? "Searching our database..." : `Found ${results.length} matching ${results.length === 1 ? 'result' : 'results'}`}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white dark:bg-card p-1.5 rounded-xl border border-border/50 shadow-sm">
            <span className="text-sm font-medium text-muted-foreground pl-2">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-100 dark:bg-muted border-none rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer transition-colors hover:bg-slate-200 dark:hover:bg-muted/80"
            >
              <option value="relevance">Relevance</option>
              <option value="latest">Latest</option>
              <option value="popular">Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10 pb-6 border-b border-border/50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                  : "bg-white dark:bg-card text-muted-foreground border border-border/50 hover:bg-slate-100 dark:hover:bg-muted hover:text-foreground hover:scale-105"
              )}
            >
              <tab.icon className={cn("w-4 h-4 transition-colors", activeTab === tab.id ? "text-primary-foreground" : "text-primary")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-primary animate-pulse gap-4">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Scanning medical knowledge base...</p>
            </div>
          ) : results.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <div className="grid gap-4">
                {results.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                  >
                    <div className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${getCategoryColor(item.category)}`}>
                          {getCategoryIcon(item.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getCategoryColor(item.category)}`}>
                              {item.category}
                            </span>
                            {item.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-[10px] text-muted-foreground bg-slate-100 dark:bg-muted px-2 py-0.5 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <h2 className="text-xl font-bold text-foreground mb-2">
                            {item.title}
                          </h2>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>

                          {item.metadata && (
                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-muted-foreground border-t border-border/50 pt-3">
                              {Object.entries(item.metadata).map(([k, v]) => (
                                <span key={k} className="flex items-center gap-1.5">
                                  <span className="capitalize opacity-70">{k.replace(/_/g, " ")}:</span>
                                  <span className="text-foreground">{v}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 px-4 text-center bg-white dark:bg-card rounded-3xl border border-border/50 border-dashed"
            >
              <div className="w-20 h-20 bg-slate-100 dark:bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                We couldn&apos;t find anything matching &quot;{query}&quot;. Try adjusting your search or using more general keywords.
              </p>
              
              <div className="flex flex-col items-center gap-3">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Suggested searches</span>
                <div className="flex flex-wrap justify-center gap-3">
                  {["fever", "diabetes", "paracetamol", "headache"].map(sugg => (
                    <button 
                      key={sugg}
                      onClick={() => router.push(`/search?q=${sugg}`)}
                      className="px-4 py-2 rounded-full bg-slate-100 dark:bg-muted text-sm font-medium hover:bg-slate-200 dark:hover:bg-muted/80 transition-colors"
                    >
                      {sugg}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
