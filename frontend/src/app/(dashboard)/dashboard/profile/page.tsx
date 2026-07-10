"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Activity, Settings, Save, ShieldAlert, HeartPulse, Droplet, CheckCircle, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, dbUser, refreshDbUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // --- Personal Info State ---
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");

  // --- Medical Profile State ---
  const [bloodType, setBloodType] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");

  // Populate form state from Firestore data when dbUser loads
  useEffect(() => {
    if (dbUser) {
      setFullName(dbUser.fullName || "");
      setPhone(dbUser.personalInfo?.phone || "");
      setDob(dbUser.personalInfo?.dob || "");
      setAddress(dbUser.personalInfo?.address || "");
      setBloodType(dbUser.medicalProfile?.bloodType || "");
      setHeight(dbUser.medicalProfile?.height || "");
      setWeight(dbUser.medicalProfile?.weight || "");
      setAllergies(dbUser.medicalProfile?.allergies || "");
      setConditions(dbUser.medicalProfile?.conditions || "");
      setMedications(dbUser.medicalProfile?.medications || "");
    }
  }, [dbUser]);

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const handleSave = async () => {
    if (!user || !db) return;

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName,
        personalInfo: { phone, dob, address },
        medicalProfile: { bloodType, height, weight, allergies, conditions, medications },
        updatedAt: serverTimestamp(),
      });

      // Refresh context so the sidebar card and other components get fresh data
      await refreshDbUser();

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and medical information securely.</p>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "success" && (
            <span className="flex items-center gap-1.5 text-emerald-500 text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-300">
              <CheckCircle className="h-4 w-4" /> Saved to cloud!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1.5 text-destructive text-sm font-medium animate-in fade-in slide-in-from-right-4 duration-300">
              <AlertCircle className="h-4 w-4" /> Save failed. Try again.
            </span>
          )}
          <Button onClick={handleSave} disabled={isSaving} className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-8">
        {/* Sidebar Profile Card */}
        <Card className="border-border/40 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] bg-gradient-to-b from-card/80 to-background/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden h-fit relative animate-in slide-in-from-left-8 fade-in duration-700 ease-out">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-80 pointer-events-none" />
          
          <CardContent className="pt-12 pb-8 px-6 text-center relative z-10 flex flex-col items-center">
            <div className="rounded-full p-2 bg-card/50 backdrop-blur-xl shadow-2xl ring-1 ring-border/50 mb-6 group cursor-pointer transition-transform hover:scale-105 hover:-translate-y-1 duration-500">
              <Avatar className="h-24 w-24 border-[3px] border-background shadow-inner">
                <AvatarImage src={dbUser?.photoURL || user?.photoURL || ""} alt={dbUser?.fullName || "User"} className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-3xl font-bold">
                  {getInitials(dbUser?.fullName || user?.displayName || "User")}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <h3 className="text-2xl font-bold truncate tracking-tight">{dbUser?.fullName || user?.displayName || "Guest User"}</h3>
            <p className="text-sm text-muted-foreground mt-1.5 truncate">{user?.email}</p>
            <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider shadow-sm transition-all hover:bg-primary/20 hover:-translate-y-0.5 hover:shadow-md cursor-default">
              <ShieldAlert className="h-4 w-4" />
              {dbUser?.subscription || "Free"} Member
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="personal" className="w-full flex flex-col relative z-10">
          <TabsList className="w-full flex justify-start h-auto flex-wrap sm:flex-nowrap bg-muted/20 backdrop-blur-xl border border-border/40 p-1.5 rounded-2xl mb-8 animate-in slide-in-from-top-4 fade-in duration-500 ease-out delay-150 fill-mode-both">
            <TabsTrigger value="personal" className="gap-2 h-12 rounded-xl px-6 font-semibold data-active:bg-primary data-active:text-primary-foreground data-active:shadow-lg data-active:shadow-primary/30 transition-all hover:bg-muted/50">
              <User className="h-4 w-4" />
              <span>Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="medical" className="gap-2 h-12 rounded-xl px-6 font-semibold data-active:bg-primary data-active:text-primary-foreground data-active:shadow-lg data-active:shadow-primary/30 transition-all hover:bg-muted/50">
              <Activity className="h-4 w-4" />
              <span>Medical Profile</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 h-12 rounded-xl px-6 font-semibold data-active:bg-primary data-active:text-primary-foreground data-active:shadow-lg data-active:shadow-primary/30 transition-all hover:bg-muted/50">
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── Personal Info Tab ─── */}
          <TabsContent value="personal" className="mt-0 focus-visible:outline-none focus-visible:ring-0 ring-offset-background animate-in slide-in-from-right-8 fade-in duration-700 ease-out delay-300 fill-mode-both">
            <Card className="border-border/40 shadow-2xl bg-card/40 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="px-6 md:px-8 pt-8">
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription>Update your basic contact and demographic details.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-xl h-12 bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all hover:translate-x-1" />
                  </div>
                  <div className="space-y-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 fill-mode-both">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={user?.email || ""} disabled className="rounded-xl h-12 bg-muted/50 cursor-not-allowed opacity-70 transition-all hover:translate-x-1" />
                  </div>
                  <div className="space-y-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-700 fill-mode-both">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="rounded-xl h-12 bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all hover:translate-x-1" />
                  </div>
                  <div className="space-y-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-[900ms] fill-mode-both">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-xl h-12 bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all block hover:translate-x-1" />
                  </div>
                  <div className="space-y-2 sm:col-span-2 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-[1100ms] fill-mode-both">
                    <Label htmlFor="address">Residential Address</Label>
                    <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Health Ave, Wellness City..." className="rounded-xl bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all min-h-[100px] resize-none hover:-translate-y-1 hover:shadow-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Medical Profile Tab ─── */}
          <TabsContent value="medical" className="mt-0 focus-visible:outline-none focus-visible:ring-0 ring-offset-background animate-in slide-in-from-right-8 fade-in duration-700 ease-out fill-mode-both">
            <Card className="border-border/40 shadow-2xl bg-card/40 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="px-6 md:px-8 pt-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Medical Profile</CardTitle>
                    <CardDescription>This information helps MedAssist provide personalized health insights.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bloodType" className="flex items-center gap-1.5"><Droplet className="h-3.5 w-3.5 text-red-500" /> Blood Type</Label>
                    <Input id="bloodType" value={bloodType} onChange={(e) => setBloodType(e.target.value)} placeholder="e.g., O+" className="rounded-xl h-12 bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="rounded-xl h-12 bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" className="rounded-xl h-12 bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Peanuts, Penicillin..." className="rounded-xl bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Chronic Conditions</Label>
                    <Textarea id="conditions" value={conditions} onChange={(e) => setConditions(e.target.value)} placeholder="Asthma, Hypertension..." className="rounded-xl bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medications">Current Medications</Label>
                    <Textarea id="medications" value={medications} onChange={(e) => setMedications(e.target.value)} placeholder="List any medications you take regularly..." className="rounded-xl bg-background/40 border border-border/40 hover:border-primary/30 focus-visible:bg-background hover:bg-background/60 shadow-inner transition-all min-h-[80px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── Account Settings Tab ─── */}
          <TabsContent value="settings" className="mt-0 focus-visible:outline-none focus-visible:ring-0 ring-offset-background animate-in slide-in-from-right-8 fade-in duration-700 ease-out fill-mode-both">
            <Card className="border-border/40 shadow-2xl bg-card/40 backdrop-blur-2xl rounded-[2rem] overflow-hidden">
              <CardHeader className="px-6 md:px-8 pt-8">
                <CardTitle className="text-2xl">Account & Security</CardTitle>
                <CardDescription>Manage your app preferences and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="px-6 md:px-8 pb-8 space-y-6">
                <div className="p-6 rounded-2xl bg-muted/50 border border-border flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">Change Password</h4>
                    <p className="text-sm text-muted-foreground mt-1">Update your password to keep your account secure.</p>
                  </div>
                  <Button variant="outline" className="rounded-xl">Update Password</Button>
                </div>
                
                <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg text-destructive">Danger Zone</h4>
                    <p className="text-sm text-destructive/80 mt-1">Permanently delete your account and all health data.</p>
                  </div>
                  <Button variant="destructive" className="rounded-xl">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
