"use client";

import { Download, Printer, Share2, Activity, HeartPulse, Scale, Moon, Coffee, Utensils, Pill } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";

const bmiData = [
  { month: "Jan", bmi: 26.5 },
  { month: "Feb", bmi: 26.2 },
  { month: "Mar", bmi: 25.8 },
  { month: "Apr", bmi: 25.5 },
  { month: "May", bmi: 24.9 },
  { month: "Jun", bmi: 24.5 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comprehensive Health Report</h1>
          <p className="text-muted-foreground mt-1">Generated on October 12, 2025 • Report ID: #MD-8492-AX</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm bg-background hidden sm:flex">
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full shadow-sm bg-background hidden sm:flex">
            <Printer className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button className="rounded-full shadow-md px-6">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-card border border-border shadow-sm rounded-3xl overflow-hidden print:shadow-none print:border-none">
        
        {/* Report Header */}
        <div className="bg-primary/5 border-b border-border/50 p-6 md:p-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="flex gap-6 items-start">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-md shrink-0">
              <Activity className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-muted-foreground">
                <p><strong>DOB:</strong> Jan 15, 1990 (35 y/o)</p>
                <p><strong>Gender:</strong> Male</p>
                <p><strong>Blood Type:</strong> O+</p>
                <p><strong>Height:</strong> 180 cm</p>
                <p><strong>Weight:</strong> 79 kg</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background rounded-2xl p-4 border border-border/50 min-w-[200px] flex flex-col justify-center">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Primary Finding</p>
            <p className="text-lg font-bold text-primary">Viral Pharyngitis</p>
            <p className="text-sm font-medium text-success">94% AI Confidence</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 md:p-10 space-y-10">
          
          {/* Medical Summary */}
          <section>
            <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-2">Medical Summary</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Patient presents with symptoms consistent with a viral infection of the upper respiratory tract, primarily affecting the pharynx. Symptoms include acute sore throat, low-grade fever (38.2°C), fatigue, and mild headache. No signs of bacterial exudate or severe lymphadenopathy were noted in the self-assessment. The overall health risk remains low.
            </p>
          </section>

          {/* Biometrics & Charts */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="bg-muted/20 p-6 rounded-2xl border border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" /> BMI Trend (6 Months)
                </h3>
                <span className="text-2xl font-bold">24.5 <span className="text-xs text-muted-foreground font-normal">Normal</span></span>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bmiData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} dy={10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--color-border)' }} />
                    <Area type="monotone" dataKey="bmi" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBmi)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-muted/20 p-6 rounded-2xl border border-border/50 flex flex-col justify-between">
              <h3 className="text-base font-bold flex items-center gap-2 mb-4">
                <HeartPulse className="h-5 w-5 text-destructive" /> Vital Signs Overview
              </h3>
              
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-medium">Blood Pressure</span>
                    <span className="font-bold">118/76 mmHg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-full rounded-full w-[45%]" />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-medium">Heart Rate</span>
                    <span className="font-bold">72 bpm</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-full rounded-full w-[35%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground font-medium">Temperature</span>
                    <span className="font-bold text-warning">38.2 °C</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-full rounded-full w-[70%]" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Treatment & Lifestyle */}
          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-2 text-primary">Treatment Plan</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Pill className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Medications</h4>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                      <li>Acetaminophen 500mg - Every 6 hours as needed for fever</li>
                      <li>Throat Lozenges - As needed for comfort</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-border/50 pb-2 text-primary">Lifestyle Recommendations</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <Moon className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Rest & Sleep</h4>
                    <p className="text-sm text-muted-foreground mt-1">Increase sleep duration to 8-9 hours per night to support immune recovery.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0">
                    <Coffee className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Hydration</h4>
                    <p className="text-sm text-muted-foreground mt-1">Consume at least 2.5L of warm fluids (tea, broth, water) daily.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <Utensils className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Diet</h4>
                    <p className="text-sm text-muted-foreground mt-1">Soft foods (soups, yogurt) to prevent throat irritation. High Vitamin C intake.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
        
        {/* Footer */}
        <div className="bg-muted/50 border-t border-border/50 p-6 text-center text-xs text-muted-foreground">
          This report was automatically generated by MedAssist AI. It is intended for informational purposes and should be reviewed by a licensed healthcare professional.
        </div>
      </div>
    </div>
  );
}
