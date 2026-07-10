"use client";

import { Activity, Calendar, Clock, FileText, HeartPulse, Pill, ShieldAlert } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

import { Button } from "@/components/ui/button";

const healthTrendData = [
  { name: "Jan", score: 82 },
  { name: "Feb", score: 85 },
  { name: "Mar", score: 88 },
  { name: "Apr", score: 86 },
  { name: "May", score: 92 },
  { name: "Jun", score: 96 },
];

const diseaseDistData = [
  { name: "Viral", cases: 40 },
  { name: "Bacterial", cases: 30 },
  { name: "Allergies", cases: 20 },
  { name: "Other", cases: 10 },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back, John. Here is your health summary.</p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Health Score</p>
              <h3 className="text-3xl font-bold mt-1 text-success">96<span className="text-lg text-muted-foreground font-medium">/100</span></h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center text-success">
              <HeartPulse className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <span className="text-success flex items-center mr-2">↑ 4%</span> from last month
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
              <h3 className="text-2xl font-bold mt-1 text-primary">Low Risk</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-primary h-full w-[15%]" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reports Generated</p>
              <h3 className="text-3xl font-bold mt-1">12</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">2 pending review</p>
        </div>

        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Checkup</p>
              <h3 className="text-xl font-bold mt-1">Oct 12, 2025</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center text-warning">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Next: Dec 1, 2025</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Health Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'var(--color-foreground)' }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-background)', strokeWidth: 2 }} activeDot={{ r: 6, fill: 'var(--color-primary)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-6">Disease Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseDistData} margin={{ top: 5, right: 0, bottom: 5, left: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} width={70} />
                <Tooltip cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }} contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '12px' }} />
                <Bar dataKey="cases" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Recent Predictions</h3>
            <Button variant="ghost" className="text-primary h-8 px-3 rounded-full text-xs font-medium">View All</Button>
          </div>
          <div className="space-y-4">
            {[
              { disease: "Seasonal Allergies", date: "Today, 10:24 AM", conf: 92, risk: "Low" },
              { disease: "Migraine", date: "Oct 15, 2025", conf: 85, risk: "Medium" },
              { disease: "Common Cold", date: "Sep 28, 2025", conf: 98, risk: "Low" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-border/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.disease}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-sm">{item.conf}%</p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${item.risk === 'Low' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                    {item.risk} Risk
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 flex flex-col gap-6">
          <h3 className="text-lg font-bold">Quick Actions</h3>
          
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-primary-foreground">Medicine Reminder</p>
              <p className="text-sm text-primary/80 mt-1">Take Vitamin D3 (1000 IU) after lunch.</p>
              <p className="text-xs font-medium mt-2 text-primary">In 2 hours</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-background flex items-center justify-center text-secondary-foreground shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Upcoming Appointment</p>
              <p className="text-sm text-muted-foreground mt-1">Dr. Sarah Jenkins - Cardiology Checkup</p>
              <p className="text-xs font-medium mt-2 flex items-center gap-1 text-secondary-foreground">
                <Clock className="h-3 w-3" /> Tomorrow, 10:00 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
