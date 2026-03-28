"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Crown, Calendar, ArrowUpRight, User, Settings as SettingsIcon, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { profile, setProfile } = useProfile();
  
  const handleUpdatePersonal = (field: keyof typeof profile.personal, value: string) => {
    setProfile(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handleAddExperience = () => {
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Math.random().toString(), company: "", role: "", duration: "", description: "" }]
    }));
  };

  const handleUpdateExperience = (id: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleAddEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { id: Math.random().toString(), school: "", degree: "", duration: "", grade: "" }]
    }));
  };

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your master profile, subscription, and preferences.</p>
      </div>

      <Tabs defaultValue={!profile.personal.firstName ? "profile" : "billing"} className="w-full">
        <TabsList className="bg-secondary/50 p-1 rounded-xl mb-6 inline-flex">
          <TabsTrigger value="profile" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <User className="w-4 h-4 mr-2" /> Master Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg px-6 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            <CreditCard className="w-4 h-4 mr-2" /> Billing & Usage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 focus-visible:outline-none">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-8 mb-6">
            <h2 className="text-xl font-black mb-6 text-foreground">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
                <Input value={profile.personal.firstName} onChange={(e) => handleUpdatePersonal("firstName", e.target.value)} className="bg-secondary/30 h-12 rounded-xl" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
                <Input value={profile.personal.lastName} onChange={(e) => handleUpdatePersonal("lastName", e.target.value)} className="bg-secondary/30 h-12 rounded-xl" placeholder="Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Location</label>
                <Input value={profile.personal.location} onChange={(e) => handleUpdatePersonal("location", e.target.value)} className="bg-secondary/30 h-12 rounded-xl" placeholder="San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
                <Input value={profile.personal.phone} onChange={(e) => handleUpdatePersonal("phone", e.target.value)} className="bg-secondary/30 h-12 rounded-xl" placeholder="+1 234 567 8900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                <Input value={profile.personal.email} onChange={(e) => handleUpdatePersonal("email", e.target.value)} className="bg-secondary/30 h-12 rounded-xl" placeholder="john@example.com" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Professional Summary</label>
                <Textarea value={profile.personal.summary} onChange={(e) => handleUpdatePersonal("summary", e.target.value)} className="bg-secondary/30 min-h-[120px] rounded-xl pt-4" placeholder="Briefly describe your professional background and career goals..." />
              </div>
            </div>
            {!profile.personal.firstName && (
              <div className="mt-6 flex justify-end">
                <Button onClick={() => toast.success("Profile saved! You can now access the dashboard.", { icon: <CheckCircle2 className="w-5 h-5 text-success" />})} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-xl h-12 shadow-lg shadow-primary/20">
                  Save Profile to Continue
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-elevated p-8 mb-6">
            <h2 className="text-xl font-black mb-6 text-foreground">Work Experience</h2>
            <div className="space-y-6">
              <AnimatePresence>
                {profile.experience.map((exp, index) => (
                  <motion.div key={exp.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-6 rounded-2xl border border-border bg-secondary/10 relative group">
                    <button onClick={() => handleRemoveExperience(exp.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input placeholder="Company (e.g., Stripe)" value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)} className="bg-background h-11" />
                      <Input placeholder="Role (e.g., Senior Engineer)" value={exp.role} onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)} className="bg-background h-11" />
                    </div>
                    <Input placeholder="Duration (e.g., 2021 - Present)" className="mb-4 bg-background h-11" value={exp.duration} onChange={(e) => handleUpdateExperience(exp.id, "duration", e.target.value)} />
                    <Textarea placeholder="Highlights..." value={exp.description} onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)} className="bg-background min-h-[100px]" />
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full border-dashed rounded-2xl py-8 flex flex-col gap-2 text-muted-foreground font-bold hover:text-primary transition-colors border-2 hover:bg-primary/5" onClick={handleAddExperience}>
                <Plus className="w-6 h-6" /> Add Work Experience
              </Button>
            </div>
          </motion.div>

          {/* Education section is structurally similar */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-elevated p-8">
            <h2 className="text-xl font-black mb-6 text-foreground">Education</h2>
            <div className="space-y-6">
              <AnimatePresence>
                {profile.education.map((edu, index) => (
                  <motion.div key={edu.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-6 rounded-2xl border border-border bg-secondary/10 relative group">
                    <button onClick={() => handleRemoveEducation(edu.id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="grid grid-cols-1 gap-4">
                      <Input placeholder="School / University" value={edu.school} onChange={(e) => handleUpdateEducation(edu.id, "school", e.target.value)} className="bg-background h-11" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)} className="bg-background h-11" />
                        <Input placeholder="Duration" value={edu.duration} onChange={(e) => handleUpdateEducation(edu.id, "duration", e.target.value)} className="bg-background h-11" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <Button variant="outline" className="w-full border-dashed rounded-2xl py-8 flex flex-col gap-2 text-muted-foreground font-bold hover:text-primary transition-colors border-2 hover:bg-primary/5" onClick={handleAddEducation}>
                <Plus className="w-6 h-6" /> Add Education
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 focus-visible:outline-none">
          {/* Include original billing UI here */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-6 h-6 text-gold" />
                  <h2 className="text-xl font-black text-foreground">Pro Plan</h2>
                </div>
                <p className="text-muted-foreground mb-4 font-medium">200 credits/month • $10/month</p>
                <div className="flex items-center gap-6 text-sm text-foreground font-semibold">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /> Next billing: Apr 15, 2026</span>
                  <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-muted-foreground" /> •••• 4242</span>
                </div>
              </div>
              <button onClick={() => toast.info("Upgrade flow coming soon!")} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold text-gold-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-lg shadow-gold/20">
                Upgrade <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
