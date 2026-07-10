"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Brain,
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
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const sidebarNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Symptom Checker", href: "/dashboard/symptom-checker", icon: Stethoscope },
  { title: "Disease Prediction", href: "/dashboard/prediction", icon: BrainCircuit },
  { title: "Medical Reports", href: "/dashboard/reports", icon: FileText },
  { title: "Medical History", href: "/dashboard/history", icon: History },
  { title: "Appointments", href: "/dashboard/appointments", icon: Calendar },
  { title: "Health Insights", href: "/dashboard/insights", icon: LineChart },
  { title: "Medications", href: "/dashboard/medications", icon: Pill },
];

const bottomNavItems = [
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 border-r border-border/40 bg-card flex flex-col overflow-hidden",
        "transition-[width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
        isOpen ? "w-64" : "w-[68px]"
      )}
    >
      {/* ─── Header: Hamburger + Logo ─── */}
      <div className={cn(
        "h-20 flex items-center border-b border-border/40 flex-shrink-0",
        isOpen ? "px-5 gap-3" : "px-0 justify-center"
      )}>
        <button
          onClick={onToggle}
          className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-muted transition-all duration-300 active:scale-90 group flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <div className="relative w-[18px] h-[14px]">
            <span className={cn(
              "absolute left-0 block h-[2px] rounded-full bg-muted-foreground transition-all duration-300 group-hover:bg-primary",
              isOpen ? "w-[18px] rotate-45 top-[6px]" : "w-[18px] rotate-0 top-0"
            )} />
            <span className={cn(
              "absolute left-0 top-[6px] block h-[2px] rounded-full bg-muted-foreground transition-all duration-300 group-hover:bg-primary",
              isOpen ? "w-0 opacity-0" : "w-[14px] opacity-100"
            )} />
            <span className={cn(
              "absolute left-0 block h-[2px] rounded-full bg-muted-foreground transition-all duration-300 group-hover:bg-primary",
              isOpen ? "w-[18px] -rotate-45 top-[6px]" : "w-[10px] rotate-0 top-[12px]"
            )} />
          </div>
        </button>

        {isOpen && (
          <Link href="/" className="flex items-center gap-2 animate-in fade-in duration-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm flex-shrink-0">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">MedAssist AI</span>
          </Link>
        )}
      </div>

      {/* ─── Navigation Items ─── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-0.5">
        {isOpen && (
          <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider animate-in fade-in duration-300">
            Menu
          </div>
        )}

        {sidebarNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center rounded-xl text-sm font-medium transition-all duration-300 group",
                isOpen
                  ? "h-11 px-4 gap-3 hover:translate-x-0.5"
                  : "h-11 w-11 mx-auto justify-center",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />

              {isOpen && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.title}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {!isOpen && (
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl border border-border/50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* ─── Bottom Section ─── */}
      <div className="px-2 py-3 border-t border-border/40 flex flex-col gap-0.5">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center rounded-xl text-sm font-medium transition-all duration-300 group",
                isOpen
                  ? "h-11 px-4 gap-3 hover:translate-x-0.5"
                  : "h-11 w-11 mx-auto justify-center",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
              )}
            >
              <item.icon className="h-[18px] w-[18px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
              {isOpen && (
                <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.title}
                </span>
              )}
              {!isOpen && (
                <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl border border-border/50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}

        {/* Logout */}
        <div
          onClick={handleLogout}
          className={cn(
            "relative flex items-center rounded-xl text-sm font-medium transition-all duration-300 hover:bg-destructive/10 text-destructive cursor-pointer group",
            isOpen
              ? "h-11 px-4 gap-3 hover:translate-x-0.5"
              : "h-11 w-11 mx-auto justify-center"
          )}
        >
          <LogOut className="h-[18px] w-[18px] flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          {isOpen && (
            <span className="whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
              Logout
            </span>
          )}
          {!isOpen && (
            <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-popover text-popover-foreground text-xs font-medium shadow-xl border border-border/50 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
