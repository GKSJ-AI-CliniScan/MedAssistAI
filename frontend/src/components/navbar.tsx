"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, X, Search, User, FileText, Stethoscope, Pill, Hash, Building2, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "AI Assistant", href: "/ai-assistant" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Live Search States
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const searchRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, []);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API call
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2 && isOpen) {
        setIsSearching(true);
        fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&limit=5`)
          .then(res => res.json())
          .then(data => {
            setResults(data.results || []);
            setSelectedIndex(-1);
            setIsSearching(false);
          })
          .catch(() => setIsSearching(false));
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      const item = results[selectedIndex];
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(item.title)}`);
      return;
    }
    
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "diseases": return <Stethoscope className="w-4 h-4 text-rose-500" />;
      case "symptoms": return <FileText className="w-4 h-4 text-orange-500" />;
      case "medicines": return <Pill className="w-4 h-4 text-blue-500" />;
      case "hospitals": return <Building2 className="w-4 h-4 text-indigo-500" />;
      case "doctors": return <User className="w-4 h-4 text-teal-500" />;
      default: return <Hash className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all">
      <div className="w-full flex h-[4.5rem] items-center px-6 lg:px-10 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105 active:scale-95 shrink-0">
          <div className="relative group/logo">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 blur-md group-hover/logo:opacity-70 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] shadow-[0_4px_12px_rgba(37,99,235,0.3)] border border-white/20">
              <Brain className="h-6 w-6 text-white drop-shadow-md animate-pulse" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight whitespace-nowrap">MedAssist AI</span>
        </Link>
        
        {/* Desktop Search */}
        <form ref={searchRef} onSubmit={handleSearch} className="hidden lg:flex relative items-center flex-1 min-w-0 max-w-sm ml-4 xl:ml-8">
          <div className="pointer-events-none absolute left-3.5 z-10 flex h-full items-center text-muted-foreground transition-colors peer-focus:text-primary">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search symptoms, diseases, medicines..." 
            className="peer w-full h-10 bg-muted/30 hover:bg-muted/50 border border-border/40 rounded-full pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all placeholder:text-muted-foreground/60 backdrop-blur-sm"
          />
          
          {/* Live Search Dropdown Popup */}
          <AnimatePresence>
            {isOpen && searchQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-12 left-0 right-0 bg-background border border-border/50 rounded-2xl shadow-2xl shadow-primary/10 overflow-hidden z-50 backdrop-blur-xl"
              >
                {results.length > 0 ? (
                  <div className="py-2">
                    {results.map((item, idx) => (
                      <Link 
                        key={item.id} 
                        href={`/search?q=${encodeURIComponent(item.title)}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer ${selectedIndex === idx ? 'bg-muted/80' : ''}`}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted border border-border/50">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-semibold truncate text-foreground">{item.title}</span>
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground opacity-50 shrink-0" />
                      </Link>
                    ))}
                    <div className="border-t border-border/50 mt-1">
                      <button 
                        type="submit"
                        className="w-full text-center px-4 py-3 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                      >
                        View all results for &quot;{searchQuery}&quot;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    {!isSearching && (
                      <p className="text-sm text-muted-foreground">No matches found for &quot;{searchQuery}&quot;</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </form>
        
        {/* Navigation + Login */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7 shrink-0 ml-auto">
          <nav className="flex items-center gap-6 xl:gap-7">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[13px] font-semibold text-muted-foreground transition-colors hover:text-foreground relative group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>

          <Link href="/login" className="group relative">
            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-primary via-blue-400 to-primary opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-500 animate-pulse"></span>
            <Button className="relative rounded-xl px-6 h-10 text-[13px] font-bold flex items-center gap-2.5 bg-primary hover:bg-primary/90 border border-white/20 text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-out">
              <User className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Login
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-background md:hidden"
          >
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">MedAssist AI</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="container mx-auto flex flex-col gap-6 p-8 text-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-8 flex flex-col gap-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl h-12 text-lg font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md text-white border-none">
                    <User className="h-5 w-5 text-white" />
                    Login
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
