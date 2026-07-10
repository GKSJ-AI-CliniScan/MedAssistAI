"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-muted/30">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
            sidebarOpen ? "pl-64" : "pl-[68px]"
          }`}
        >
          <Topbar />
          <main className="flex-1 p-6 md:p-8">
            <div className="mx-auto max-w-6xl w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
