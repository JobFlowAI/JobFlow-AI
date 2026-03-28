"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, Sparkles, CheckCircle, XCircle, 
  AlertCircle, Zap, User, Briefcase, GraduationCap, 
  Plus, Trash2, Download, Eye, Layers, Mail, Phone, MapPin
} from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
};

type Education = {
  id: string;
  school: string;
  degree: string;
  duration: string;
  grade: string;
};

type ResumeData = {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    dob: string;
    country: string;
    currentAddress: string;
    permanentAddress: string;
    summary: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
};

const templates = [
  { id: "modern", name: "Modern Tech", description: "Blue accents, clean Sans-serif.", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "minimal", name: "Minimalist", description: "Ultra-clean, focused on content.", icon: FileText, color: "text-slate-500", bg: "bg-slate-500/10" },
  { id: "ats", name: "ATS Optimized", description: "Single-column, high-parsability.", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  { id: "professional", name: "Classic Serif", description: "Formal, elegant for traditional roles.", icon: User, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: "creative", name: "Creative Edge", description: "Bold yellow accents, unique soul.", icon: Zap, color: "text-gold", bg: "bg-gold/10" },
  { id: "designer", name: "Dark Designer", description: "Dark sidebar, high-impact visuals.", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const sampleKeywords = [
  { word: "React", found: true },
  { word: "TypeScript", found: true },
  { word: "CI/CD", found: false },
  { word: "Agile", found: true },
  { word: "REST APIs", found: true },
  { word: "Docker", found: false },
  { word: "Unit Testing", found: false },
  { word: "GraphQL", found: true },
];

const Branding = () => (
  <div className="flex items-center gap-2 mb-8 opacity-40 hover:opacity-100 transition-opacity no-print select-none">
    <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
      <Zap className="w-3.5 h-3.5 text-white fill-white" />
    </div>
    <span className="text-sm font-black tracking-tighter text-slate-900">JobFlow AI</span>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 border-l border-slate-200 pl-2">Pro Builder</span>
  </div>
);

export default function ResumeWorkspace() {
  const [mode, setMode] = useState<"manual" | "upload">("upload");
  const [uploaded, setUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("John_Doe_Resume.pdf");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: { 
      firstName: "", 
      lastName: "", 
      email: "", 
      phone: "", 
      location: "", 
      dob: "",
      country: "",
      currentAddress: "",
      permanentAddress: "",
      summary: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    experience: [{ id: "1", company: "", role: "", duration: "", description: "" }],
    education: [{ id: "1", school: "", degree: "", duration: "", grade: "" }],
    skills: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);
  const fitScore = 72;

  const handleUpdatePersonal = (field: keyof ResumeData["personal"], value: string) => {
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handleAddExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Math.random().toString(), company: "", role: "", duration: "", description: "" }]
    }));
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { id: Math.random().toString(), school: "", degree: "", duration: "", grade: "" }]
    }));
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      if (!resumeData.skills.includes(newSkill.trim())) {
        setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const exportPDF = () => {
    window.print();
    toast.success("Preparing PDF for export...");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setUploaded(true);
      toast.success(`Resume "${file.name}" uploaded! AI is analyzing...`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      setUploaded(true);
      toast.success(`Resume "${file.name}" uploaded! AI is analyzing...`);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pro Resume Builder</h1>
          <p className="text-muted-foreground italic">Zen-Professional Craftsmanship • Powered by AI</p>
        </div>
        <div className="flex items-center gap-3 no-print">
          <div className="bg-secondary/50 p-1 rounded-lg flex items-center">
            <Button 
              variant={mode === "upload" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => {
                if (mode === "upload") triggerFileUpload();
                else setMode("upload");
              }}
              className="gap-2"
            >
              <Upload className="w-4 h-4" /> Upload
            </Button>
            <Button 
              variant={mode === "manual" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setMode("manual")}
              className="gap-2"
            >
              <Layers className="w-4 h-4" /> Manual Builder
            </Button>
          </div>
          {mode === "manual" && (
            <Button onClick={exportPDF} className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:opacity-90">
              <Download className="w-4 h-4" /> Export PDF
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Panel: Upload or Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card-elevated p-6 space-y-6 no-print"
        >
          {mode === "upload" ? (
            <div className="space-y-6">
              {!uploaded ? (
                <>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".pdf,.docx" 
                    className="hidden" 
                  />
                  <div
                    onClick={triggerFileUpload}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all p-10 ${
                      isDragging
                        ? "border-primary bg-primary/10 shadow-lg scale-[1.02]"
                        : "border-border hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <Upload className={`w-12 h-12 mb-4 transition-transform ${isDragging ? "text-primary scale-110" : "text-muted-foreground"}`} />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {isDragging ? "Drop to Upload" : "Upload Your Resume"}
                    </h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Drag & drop your PDF or DOCX file, or click to browse
                    </p>
                    <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full italic">Optimized for AI Analysis</span>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center py-10 border border-border rounded-xl bg-secondary/20">
                    <FileText className="w-16 h-16 text-muted-foreground opacity-20" />
                    <div>
                      <p className="text-lg font-medium text-foreground">{uploadedFileName}</p>
                      <p className="text-sm text-muted-foreground tracking-tight italic opacity-60">Uploaded just now</p>
                    </div>
                    <div className="flex gap-2 text-xs font-semibold text-success bg-success/5 px-4 py-2 rounded-full border border-success/10 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Analysis Complete
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setUploaded(false)}
                      className="mt-4 border-dashed rounded-full px-6"
                    >
                      Process Another Resume
                    </Button>
                  </div>

                  {/* AI Insights for Uploaded Resume */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">ATS Match Score</label>
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{fitScore}%</Badge>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${fitScore}%` }} 
                          className="h-full bg-primary" 
                        />
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-gold" /> Critical Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {sampleKeywords.map(kw => (
                          <span key={kw.word} className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${kw.found ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive opacity-50'}`}>
                            {kw.word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6 bg-secondary/50 p-1">
                  <TabsTrigger value="personal" title="Personal"><User className="w-4 h-4 mr-2 text-primary" /> <span className="hidden sm:inline">Info</span></TabsTrigger>
                  <TabsTrigger value="experience" title="Experience"><Briefcase className="w-4 h-4 mr-2 text-primary" /> <span className="hidden sm:inline">Exp</span></TabsTrigger>
                  <TabsTrigger value="education" title="Education"><GraduationCap className="w-4 h-4 mr-2 text-primary" /> <span className="hidden sm:inline">Edu</span></TabsTrigger>
                  <TabsTrigger value="skills" title="Skills"><Zap className="w-4 h-4 mr-2 text-primary" /> <span className="hidden sm:inline">Skills</span></TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 focus-visible:outline-none">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">First Name</label>
                      <Input placeholder="John" value={resumeData.personal.firstName} onChange={(e) => handleUpdatePersonal("firstName", e.target.value)} className="bg-secondary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Last Name</label>
                      <Input placeholder="Doe" value={resumeData.personal.lastName} onChange={(e) => handleUpdatePersonal("lastName", e.target.value)} className="bg-secondary/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Date of Birth</label>
                      <Input type="date" value={resumeData.personal.dob} onChange={(e) => handleUpdatePersonal("dob", e.target.value)} className="bg-secondary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Country</label>
                      <Input placeholder="United States" value={resumeData.personal.country} onChange={(e) => handleUpdatePersonal("country", e.target.value)} className="bg-secondary/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Email</label>
                      <Input placeholder="john@example.com" value={resumeData.personal.email} onChange={(e) => handleUpdatePersonal("email", e.target.value)} className="bg-secondary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Phone</label>
                      <Input placeholder="+1 234 567 890" value={resumeData.personal.phone} onChange={(e) => handleUpdatePersonal("phone", e.target.value)} className="bg-secondary/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Current Residence / Address</label>
                    <Input placeholder="City, State, Country" value={resumeData.personal.currentAddress} onChange={(e) => handleUpdatePersonal("currentAddress", e.target.value)} className="bg-secondary/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Permanent Address</label>
                    <Input placeholder="Same as above or specify..." value={resumeData.personal.permanentAddress} onChange={(e) => handleUpdatePersonal("permanentAddress", e.target.value)} className="bg-secondary/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">LinkedIn Profile</label>
                      <Input placeholder="linkedin.com/in/..." value={resumeData.personal.linkedin} onChange={(e) => handleUpdatePersonal("linkedin", e.target.value)} className="bg-secondary/20" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">GitHub / Portfolio</label>
                      <Input placeholder="github.com/..." value={resumeData.personal.github} onChange={(e) => handleUpdatePersonal("github", e.target.value)} className="bg-secondary/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Executive Summary</label>
                    <Textarea 
                      placeholder="High-performing software engineer..." 
                      className="min-h-[100px] bg-secondary/20"
                      value={resumeData.personal.summary} 
                      onChange={(e) => handleUpdatePersonal("summary", e.target.value)} 
                    />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6 focus-visible:outline-none">
                  <AnimatePresence>
                    {resumeData.experience.map((exp) => (
                      <motion.div 
                        key={exp.id} 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl border border-border bg-secondary/5 relative group"
                      >
                        <button onClick={() => handleRemoveExperience(exp.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <Input placeholder="Company" value={exp.company} onChange={(e) => handleUpdateExperience(exp.id, "company", e.target.value)} className="bg-background" />
                          <Input placeholder="Role" value={exp.role} onChange={(e) => handleUpdateExperience(exp.id, "role", e.target.value)} className="bg-background" />
                        </div>
                        <Input placeholder="Duration (e.g., 2021 - Present)" className="mb-4 bg-background" value={exp.duration} onChange={(e) => handleUpdateExperience(exp.id, "duration", e.target.value)} />
                        <Textarea placeholder="Highlights..." value={exp.description} onChange={(e) => handleUpdateExperience(exp.id, "description", e.target.value)} className="bg-background" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Button variant="outline" className="w-full border-dashed rounded-xl py-8 flex flex-col gap-1 text-muted-foreground hover:text-primary transition-colors" onClick={handleAddExperience}>
                    <Plus className="w-5 h-5" /> <span>Add Work Experience</span>
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-6 focus-visible:outline-none">
                  <AnimatePresence>
                    {resumeData.education.map((edu) => (
                      <motion.div 
                        key={edu.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl border border-border bg-secondary/5 relative group"
                      >
                        <button onClick={() => handleRemoveEducation(edu.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 gap-4">
                          <Input placeholder="School / University" value={edu.school} onChange={(e) => handleUpdateEducation(edu.id, "school", e.target.value)} className="bg-background" />
                          <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Degree (e.g., BS Computer Science)" value={edu.degree} onChange={(e) => handleUpdateEducation(edu.id, "degree", e.target.value)} className="bg-background" />
                            <Input placeholder="Grade / GPA (e.g., 3.8/4.0)" value={edu.grade} onChange={(e) => handleUpdateEducation(edu.id, "grade", e.target.value)} className="bg-background" />
                          </div>
                          <Input placeholder="Duration (e.g., 2018 - 2022)" value={edu.duration} onChange={(e) => handleUpdateEducation(edu.id, "duration", e.target.value)} className="bg-background" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Button variant="outline" className="w-full border-dashed rounded-xl py-8 flex flex-col gap-1 text-muted-foreground hover:text-primary transition-colors" onClick={handleAddEducation}>
                    <Plus className="w-5 h-5" /> <span>Add Education</span>
                  </Button>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4 focus-visible:outline-none">
                   <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-70">Add Expertise</label>
                    <Input placeholder="Type skill & press Enter" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={handleAddSkill} className="bg-secondary/20" />
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {resumeData.skills.length > 0 ? resumeData.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="pl-3 pr-2 py-1.5 gap-1 group bg-primary/5 border border-primary/20 text-primary">
                        {skill} <button onClick={() => handleRemoveSkill(skill)} className="text-muted-foreground hover:text-destructive"><XCircle className="w-3.5 h-3.5" /></button>
                      </Badge>
                    )) : <p className="text-xs text-muted-foreground italic">Add your skills to see them in the preview...</p>}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="pt-6 border-t border-border mt-10">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Template Selection</h4>
                <div className="grid grid-cols-3 gap-3">
                  {templates.map((t) => (
                    <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl border transition-all text-center group ${selectedTemplate === t.id ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border hover:border-primary/40 bg-card"}`}>
                      <t.icon className={`w-5 h-5 mx-auto mb-2 transition-transform group-hover:scale-110 ${selectedTemplate === t.id ? t.color : "text-muted-foreground"}`} />
                      <p className="text-[10px] font-black uppercase tracking-tighter line-clamp-1">{t.name.split(" ")[0]}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Right Panel: Live Preview (Universal) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="sticky top-6 print-area bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          <div ref={previewRef} className={`min-h-[800px] w-full bg-white text-slate-800 transition-all relative ${["minimal", "ats", "professional"].includes(selectedTemplate) ? "p-12" : "p-0"}`}>
            <div className="absolute top-4 right-4 z-50 pointer-events-none opacity-20 print:opacity-40">
              <div className="flex items-center gap-1.5 grayscale print:grayscale-0">
                <div className="w-4 h-4 bg-indigo-600 rounded-[4px] flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-white fill-white" />
                </div>
                <span className="text-[9px] font-black tracking-tighter text-slate-900 uppercase">JobFlow AI</span>
              </div>
            </div>
            {/* Template: Modern Tech */}
            {selectedTemplate === "modern" && (
              <>
                <div className="bg-blue-600 text-white p-12">
                  <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">{resumeData.personal.firstName} {resumeData.personal.lastName}</h2>
                  <div className="flex flex-wrap gap-6 text-[11px] font-bold text-blue-100 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><Mail className="w-3 h-3 text-white" /> {resumeData.personal.email}</span>
                    <span>{resumeData.personal.phone}</span>
                    <span>{resumeData.personal.location}</span>
                  </div>
                </div>
                <div className="p-12 space-y-12">
                   {resumeData.personal.summary && (
                    <section>
                      <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4 pb-1 border-b-2 border-blue-50">Executive Summary</h3>
                      <p className="text-sm leading-relaxed text-slate-600 font-medium italic">{resumeData.personal.summary}</p>
                    </section>
                  )}
                  <section>
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-6 pb-1 border-b-2 border-blue-50">Experience</h3>
                    <div className="space-y-8">
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="relative pl-6 border-l-2 border-blue-50 pb-2">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-white" />
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-slate-900 leading-none uppercase">{exp.role}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full">{exp.duration}</span>
                          </div>
                          <p className="text-xs font-black text-blue-600 mb-3 tracking-widest uppercase">{exp.company}</p>
                          <p className="text-[13px] text-slate-600 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                  <div className="grid md:grid-cols-2 gap-12">
                    <section>
                      <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-6 pb-1 border-b-2 border-blue-50">Education</h3>
                      <div className="space-y-6">
                        {resumeData.education.map((edu) => (
                          <div key={edu.id}>
                            <div className="flex justify-between items-baseline mb-1">
                               <h4 className="font-black text-slate-900 text-[13px] uppercase">{edu.degree}</h4>
                               <span className="text-[10px] font-bold text-blue-600 italic">{edu.grade}</span>
                            </div>
                            <p className="text-xs font-bold text-slate-500 mb-1">{edu.school}</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{edu.duration}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-6 pb-1 border-b-2 border-blue-50">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((s) => (
                          <span key={s} className="px-3 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-sm">{s}</span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}

            {/* Template: Minimalist */}
            {selectedTemplate === "minimal" && (
              <div className="space-y-12">
                <div className="text-center pb-12 border-b border-slate-100">
                  <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight italic">{resumeData.personal.firstName} {resumeData.personal.lastName}</h2>
                  <div className="flex justify-center gap-10 text-[10px] text-slate-400 tracking-[0.3em] uppercase font-bold">
                    <span>{resumeData.personal.email}</span>
                    <span>{resumeData.personal.phone}</span>
                    <span>{resumeData.personal.location}</span>
                  </div>
                </div>
                {resumeData.personal.summary && (
                  <p className="text-[15px] text-center italic text-slate-500 max-w-xl mx-auto leading-loose font-serif">{resumeData.personal.summary}</p>
                )}
                <section>
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 text-center relative after:absolute after:bottom-[-20px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-slate-200">History</h3>
                  <div className="space-y-12">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-4 gap-8">
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest pt-1.5 text-right">{exp.duration}</div>
                        <div className="col-span-3 border-l border-slate-100 pl-8">
                          <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-wider">{exp.role}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">{exp.company}</p>
                          <p className="text-sm text-slate-600 leading-loose font-serif">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 text-center">Academics</h3>
                  <div className="grid md:grid-cols-2 gap-12">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="text-center bg-slate-50 p-6 rounded-2xl border border-slate-100/50 transition-colors hover:bg-white hover:shadow-xl">
                        <h4 className="font-black text-slate-900 text-[13px] mb-2 uppercase">{edu.degree}</h4>
                        <p className="text-xs font-bold text-slate-500 mb-2 italic">{edu.school}</p>
                        <div className="flex justify-center gap-4">
                          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{edu.duration}</p>
                          <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest">{edu.grade ? `• ${edu.grade}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Template: ATS Optimized */}
            {selectedTemplate === "ats" && (
              <div className="p-16 space-y-10 font-sans text-slate-900">
                <div className="border-b-2 border-slate-900 pb-8 text-center bg-white">
                  <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">{resumeData.personal.firstName} {resumeData.personal.lastName}</h2>
                  <div className="text-sm flex justify-center gap-6 font-medium text-slate-600">
                    <span>{resumeData.personal.email}</span>
                    <span>{resumeData.personal.phone}</span>
                    <span>{resumeData.personal.location}</span>
                  </div>
                </div>
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 mb-4 pb-1">Professional Summary</h3>
                  <p className="text-sm leading-relaxed text-slate-700">{resumeData.personal.summary}</p>
                </section>
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 mb-6 pb-1">Core Experience</h3>
                  <div className="space-y-8">
                    {resumeData.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between font-bold text-sm text-slate-900">
                          <span>{exp.role}</span>
                          <span>{exp.duration}</span>
                        </div>
                        <div className="text-sm italic font-bold text-slate-600 mb-2">{exp.company}</div>
                        <p className="text-sm text-slate-700 leading-relaxed font-normal">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 mb-4 pb-1">Education</h3>
                  <div className="space-y-4">
                    {resumeData.education.map(edu => (
                      <div key={edu.id}>
                        <div className="flex justify-between font-bold text-sm">
                          <span>{edu.school}</span>
                          <span>{edu.duration}</span>
                        </div>
                        <div className="text-sm">{edu.degree} {edu.grade ? `• ${edu.grade}` : ""}</div>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 mb-4 pb-1">Skills & Tools</h3>
                  <p className="text-sm text-slate-700 font-medium leading-loose">{resumeData.skills.join(" • ")}</p>
                </section>
              </div>
            )}

            {/* Template: Classic Serif */}
            {selectedTemplate === "professional" && (
              <div className="p-16 space-y-12 font-serif text-slate-900">
                <div className="text-center">
                  <h2 className="text-4xl font-light mb-4 tracking-tight text-slate-900">{resumeData.personal.firstName} {resumeData.personal.lastName}</h2>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400 flex justify-center gap-8 font-bold">
                    <span>{resumeData.personal.email}</span>
                    <span>{resumeData.personal.phone}</span>
                    <span>{resumeData.personal.location}</span>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <section>
                   <p className="text-sm text-center italic max-w-2xl mx-auto leading-loose text-slate-600">{resumeData.personal.summary}</p>
                </section>
                <section>
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-slate-300 mb-10 text-center italic">Professional History</h3>
                  <div className="space-y-12 max-w-3xl mx-auto">
                    {resumeData.experience.map(exp => (
                      <div key={exp.id} className="grid grid-cols-4 gap-8">
                        <div className="text-[10px] uppercase font-bold text-slate-300 pt-1 tracking-widest">{exp.duration}</div>
                        <div className="col-span-3 group">
                          <h4 className="font-bold text-xl mb-1 text-slate-900 transition-colors group-hover:text-indigo-600">{exp.role}</h4>
                          <p className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-widest italic">{exp.company}</p>
                          <p className="text-[15px] text-slate-700 leading-relaxed indent-8">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-[13px] font-bold uppercase tracking-[0.4em] text-slate-300 mb-10 text-center italic">Education</h3>
                  <div className="grid md:grid-cols-2 gap-12">
                     {resumeData.education.map(edu => (
                      <div key={edu.id} className="text-center group p-6 border border-transparent hover:border-slate-50 rounded-2xl transition-all">
                        <h4 className="font-bold text-sm mb-1 text-slate-900">{edu.school}</h4>
                        <p className="text-xs italic text-slate-500 mb-2">{edu.degree} {edu.grade ? `• ${edu.grade}` : ""}</p>
                        <p className="text-[10px] uppercase font-bold text-slate-300 tracking-[0.2em]">{edu.duration}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Template: Creative Edge */}
            {selectedTemplate === "creative" && (
              <div className="flex min-h-[800px] bg-slate-950 font-sans">
                <div className="w-[38%] bg-gold p-12 text-slate-900 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-white/20 blur-[100px] rounded-full" />
                  <div className="space-y-16 relative z-10">
                    <h2 className="text-5xl font-black leading-[0.8] tracking-tighter uppercase break-words border-b-[16px] border-slate-900 pb-10">
                      {resumeData.personal.firstName ? `${resumeData.personal.firstName}\n${resumeData.personal.lastName}` : "CREATIVE\nGENIUS"}
                    </h2>
                    <div className="space-y-10">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] mb-4 opacity-40">Direct Systems</p>
                        <div className="space-y-2 text-xs font-black">
                          <p className="break-words">{resumeData.personal.email}</p>
                          <p>{resumeData.personal.phone}</p>
                          <p className="opacity-60">{resumeData.personal.location}</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">Core Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((s) => (
                            <span key={s} className="bg-slate-950 text-white px-3 py-1.5 text-[9px] font-black uppercase tracking-widest skew-x-[-12deg]">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-900/10 text-[10px] font-black uppercase tracking-[0.6em] opacity-20 -rotate-90 origin-left translate-y-32">JobFlow AI // PRO</div>
                </div>
                <div className="flex-1 p-12 space-y-16 bg-slate-50">
                   <div className="relative">
                      <div className="absolute left-[-48px] top-4 w-12 h-0.5 bg-slate-200" />
                      <p className="text-sm font-bold italic text-slate-500 max-w-md leading-loose">{resumeData.personal.summary}</p>
                   </div>
                   <section>
                      <h3 className="inline-block bg-slate-900 text-white px-8 py-3 text-xs font-black uppercase tracking-[0.4em] mb-12 shadow-[12px_12px_0px_#eab308] skew-x-[-12deg]">Professional Flow</h3>
                      <div className="space-y-16">
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="relative pl-8 border-l-4 border-gold/30">
                            <div className="flex justify-between items-baseline mb-3">
                              <h4 className="font-black text-slate-900 text-lg uppercase">{exp.role}</h4>
                              <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase bg-white px-3 py-1 rounded-full shadow-sm">{exp.duration}</span>
                            </div>
                            <p className="text-xs font-black text-gold uppercase mb-5 tracking-widest">{exp.company}</p>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white/40 p-6 rounded-2xl shadow-sm italic">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                   </section>
                   <section>
                      <h3 className="inline-block bg-slate-900 text-white px-8 py-3 text-xs font-black uppercase tracking-[0.4em] mb-12 shadow-[12px_12px_0px_#eab308] skew-x-[-12deg]">Milestones</h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform">
                            <h4 className="font-black text-slate-900 text-sm uppercase mb-2 tracking-tight">{edu.degree}</h4>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 italic">{edu.school}</p>
                            <Badge className="bg-gold text-slate-900 text-[10px] font-black uppercase tracking-tighter border-none px-4">{edu.grade || edu.duration}</Badge>
                          </div>
                        ))}
                      </div>
                   </section>
                </div>
              </div>
            )}

            {/* Template: Dark Designer */}
            {selectedTemplate === "designer" && (
              <div className="flex min-h-[800px] font-sans bg-slate-50">
                <div className="w-[35%] bg-slate-900 text-white p-12 space-y-20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                  <div className="relative z-10">
                    <h2 className="text-5xl font-black uppercase mb-1 tracking-tighter leading-none">{resumeData.personal.firstName}</h2>
                    <h2 className="text-5xl font-light uppercase tracking-[0.2em] text-purple-400 leading-none">{resumeData.personal.lastName}</h2>
                  </div>
                  <div className="space-y-12 relative z-10">
                    <section>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Network Node</h3>
                      <div className="text-[11px] space-y-4 font-bold text-slate-100 uppercase tracking-widest">
                        <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-purple-400" /> {resumeData.personal.email}</p>
                        <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-purple-400" /> {resumeData.personal.phone}</p>
                        <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-purple-400" /> {resumeData.personal.location}</p>
                      </div>
                    </section>
                    <section>
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6">Skill Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map(s => (
                          <span key={s} className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[9px] font-black uppercase tracking-[0.2em] rounded-sm">{s}</span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
                <div className="flex-1 p-16 space-y-20">
                  <section className="relative">
                    <span className="absolute -left-16 top-0 text-7xl font-black text-slate-100 italic select-none">BIO</span>
                    <p className="text-xl font-medium text-slate-500 leading-relaxed indent-12 italic relative z-10">{resumeData.personal.summary}</p>
                  </section>
                  <section>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12">Professional Log</h3>
                    <div className="space-y-16">
                      {resumeData.experience.map(exp => (
                        <div key={exp.id} className="group">
                          <div className="flex justify-between items-baseline mb-4">
                             <h4 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-purple-600 transition-colors uppercase italic">{exp.role}</h4>
                             <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">{exp.duration}</span>
                          </div>
                          <p className="text-sm font-black text-purple-500 uppercase mb-6 tracking-[0.3em]">{exp.company}</p>
                          <div className="p-8 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 text-[15px] text-slate-500 leading-loose">
                            {exp.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                   <section>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-200 mb-12">Foundation</h3>
                    <div className="grid md:grid-cols-2 gap-10">
                       {resumeData.education.map(edu => (
                         <div key={edu.id} className="p-8 bg-slate-900 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute inset-0 bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                           <h4 className="font-black text-xl mb-2 tracking-tighter uppercase italic">{edu.degree}</h4>
                           <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">{edu.school}</p>
                           <div className="flex justify-between items-center">
                              <Badge className="bg-purple-500 text-white font-black px-4 py-1.5 rounded-full italic">{edu.duration}</Badge>
                              <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{edu.grade}</span>
                           </div>
                         </div>
                       ))}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        @font-face {
          font-family: 'DM Serif Display';
          src: url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        }
        @media print {
          .no-print { display: none !important; }
          .print-area { 
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            box-shadow: none !important;
          }
          body, html { visibility: hidden !important; background: white !important; }
          .print-area, .print-area * { visibility: visible !important; }
          #root { height: 100% !important; overflow: visible !important; }
        }
      `}</style>
    </div>
  );
}
