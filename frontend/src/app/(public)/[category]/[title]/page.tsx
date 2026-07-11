"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, RefreshCw, AlertCircle, Brain, Pill, FileText, User, Building2, Search } from "lucide-react";
import { SearchItem } from "@/app/api/search/route";

function DetailContent() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const title = decodeURIComponent(params.title as string);

  const [item, setItem] = useState<SearchItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We can just use the search API with an exact query to find the item!
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(title)}&limit=1`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setItem(data.results[0]);
        }
      } catch (error) {
        console.error("Failed to fetch item details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [title]);

  const getCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'symptoms': return <AlertCircle className="w-8 h-8 text-orange-500" />;
      case 'diseases': return <Brain className="w-8 h-8 text-purple-500" />;
      case 'medicines': return <Pill className="w-8 h-8 text-blue-500" />;
      case 'articles': return <FileText className="w-8 h-8 text-emerald-500" />;
      case 'doctors': return <User className="w-8 h-8 text-cyan-500" />;
      case 'hospitals': return <Building2 className="w-8 h-8 text-rose-500" />;
      default: return <Search className="w-8 h-8 text-slate-500" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'symptoms': return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      case 'diseases': return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case 'medicines': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case 'articles': return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case 'doctors': return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      case 'hospitals': return "bg-rose-500/10 text-rose-600 border-rose-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-primary gap-4">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <p className="text-sm font-medium">Loading medical data...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find detailed information for &quot;{title}&quot;.</p>
        <button onClick={() => router.back()} className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-8 pb-24">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => router.back()} className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <ChevronRight className="w-4 h-4" />
          <Link href={`/search?q=${item.category}`} className="hover:text-primary transition-colors capitalize">
            {item.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{item.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white dark:bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="flex items-start gap-6 relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border ${getCategoryColor(item.category)}`}>
              {getCategoryIcon(item.category)}
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                {item.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-xs text-muted-foreground bg-slate-100 dark:bg-muted px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                {item.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        </div>

        {/* Metadata Details Grid */}
        {item.metadata && Object.keys(item.metadata).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(item.metadata).map(([key, value]) => (
              <div key={key} className="bg-white dark:bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
                  {key.replace(/_/g, " ")}
                </h3>
                <p className="text-foreground leading-relaxed">
                  {value || "Not specified."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DynamicDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-6 h-6 animate-spin text-primary" /></div>}>
      <DetailContent />
    </Suspense>
  );
}
