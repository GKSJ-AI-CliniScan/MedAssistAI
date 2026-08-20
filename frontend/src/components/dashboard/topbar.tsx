"use client";

import { useState } from "react";
import { Bell, LogOut, User as UserIcon, Info, CheckCircle2 } from "lucide-react";
import { SearchBar } from "@/components/dashboard/search-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar() {
  const { dbUser, signOut, user } = useAuth();
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    { id: 1, title: "Health Report Ready", desc: "Your latest blood work analysis is complete.", time: "10m ago", read: false },
    { id: 2, title: "Upcoming Appointment", desc: "Dr. Smith at 3:00 PM tomorrow.", time: "2h ago", read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-20 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
      <div className="flex items-center gap-4 flex-1">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 w-10 flex items-center justify-center rounded-full relative hover:bg-primary/10 transition-colors group border-none outline-none cursor-pointer">
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-4 w-4 rounded-full bg-destructive border-2 border-background text-[10px] leading-none font-bold text-white flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={12} className="w-80 rounded-[2rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10 dark:border-white/5 bg-background/80 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-bold tracking-widest text-primary/70 uppercase">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline font-medium transition-all">Mark all as read</button>
              )}
            </div>
            <DropdownMenuSeparator className="my-2 bg-border/40" />
            <div className="max-h-[300px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem 
                    key={notif.id} 
                    onClick={() => setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                    className="cursor-pointer gap-4 px-3 py-3 rounded-2xl hover:bg-primary/10 transition-all duration-300 flex items-start mb-1 last:mb-0 group/notif"
                  >
                    <div className={`mt-0.5 p-2 rounded-xl transition-all duration-300 ${notif.read ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'}`}>
                      {notif.read ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4 group-hover/notif:scale-110 transition-transform" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm leading-none transition-colors ${notif.read ? 'text-muted-foreground font-medium' : 'text-foreground font-semibold'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-snug">
                        {notif.desc}
                      </p>
                      <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium tracking-wider uppercase">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-px bg-border mx-1 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:bg-primary/10 p-1.5 pr-3 rounded-full transition-all duration-300 border border-transparent hover:border-primary/30 active:scale-95 outline-none cursor-pointer hover:shadow-lg hover:shadow-primary/5 group">
            <Avatar className="h-9 w-9 border-2 border-primary/20 group-hover:border-primary/60 group-hover:scale-105 transition-all duration-300">
              <AvatarImage src={dbUser?.photoURL || user?.photoURL || ""} alt={dbUser?.fullName || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {getInitials(dbUser?.fullName || user?.displayName || "User")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold leading-none max-w-[120px] truncate group-hover:text-primary transition-colors duration-300">
                {dbUser?.fullName || user?.displayName || "Loading..."}
              </span>
              <span className="text-xs text-muted-foreground mt-1 capitalize font-medium transition-colors duration-300">
                {dbUser?.subscription || "Free"} Plan
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            sideOffset={12}
            className="w-64 rounded-[2rem] p-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/10 dark:border-white/5 bg-background/80 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-3 py-2 text-xs font-bold tracking-widest text-primary/70 uppercase">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-border/40" />
              <DropdownMenuItem className="cursor-pointer gap-4 px-4 py-3 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all duration-300 group">
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <UserIcon className="h-4 w-4" />
                </div>
                <span className="font-semibold group-hover:translate-x-1 transition-transform duration-300 text-sm">Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2 bg-border/40" />
              <div
                onClick={handleLogout}
                className="group relative flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 text-sm font-semibold text-destructive overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-destructive/20 select-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-destructive/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                <div className="bg-destructive/10 p-2 rounded-xl group-hover:bg-destructive/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative z-10">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">Log out</span>
              </div>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
