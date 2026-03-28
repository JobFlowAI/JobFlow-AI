"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, CheckCircle, Zap, Layers, Play, RefreshCw, FileText
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const templates = [
  { id: "ats", name: "ATS Optimized", description: "Machine-readable, 100% parseable.", icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  { id: "modern", name: "Modern Tech", description: "Blue accents, clean Sans-serif.", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "minimal", name: "Minimalist", description: "Ultra-clean, focused on content.", icon: FileText, color: "text-slate-500", bg: "bg-slate-500/10" },
  { id: "designer", name: "Dark Designer", description: "Dark sidebar, high-impact visuals.", icon: Layers, color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function ResumeWorkspace() {
  const { profile } = useProfile();
  
  // Steps in Flow
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Job Spec, 2: Strategy, 3: Generation/Review
  const [jobDescription, setJobDescription] = useState("");
  const [strategy, setStrategy] = useState<"ats" | "creative" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<any>(null); // This holds the final "tailored" content
  const [selectedTemplate, setSelectedTemplate] = useState("ats");
  
  const previewRef = useRef<HTMLDivElement>(null);

  // If user strategy changes to ATS, force template. If Creative, set to Modern as default.
  useEffect(() => {
    if (strategy === "ats") setSelectedTemplate("ats");
    else if (strategy === "creative") setSelectedTemplate("modern");
  }, [strategy]);

  const handleGenerate = async () => {
    if (!jobDescription) {
      toast.error("Please provide a job description for the AI to analyze.");
      return;
    }
    if (!strategy) {
      toast.error("Please select an optimization strategy.");
      return;
    }

    setStep(3);
    setIsGenerating(true);

    // MOCK AI PIPELINE
    setTimeout(() => {
      // Simulate taking the Master Profile and injecting JD keywords based on strategy
      const tailoredProfile = JSON.parse(JSON.stringify(profile)); // Deep copy master
      
      const keywords = strategy === "ats" 
        ? "Keywords Injected: Synergy, Cross-functional, Agile workflows, Metrics-driven"
        : "Creative flair injected: Story-telling focus, impact highlights";

      // Modify the summary to show it's tailored
      tailoredProfile.personal.summary = `[TAILORED for JD] ${profile.personal.summary} \n\n${keywords}`;
      
      setGeneratedResume(tailoredProfile);
      setIsGenerating(false);
      toast.success("Resume generation complete!", { icon: <Sparkles className="w-4 h-4 text-gold" /> });
    }, 3500);
  };

  const exportPDF = () => {
    window.print();
    toast.success("Preparing PDF for export...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">AI Resume Engine</h1>
          <p className="text-muted-foreground font-medium">Tailor your master profile to any role instantly.</p>
        </div>
        {step === 3 && !isGenerating && (
          <div className="flex items-center gap-3 no-print">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2 border-border/50 text-foreground font-bold rounded-xl">
              <RefreshCw className="w-4 h-4" /> Start Over
            </Button>
            <Button onClick={exportPDF} className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 rounded-xl font-bold">
              Download PDF
            </Button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Control Panel */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="card-elevated p-8 space-y-8 no-print sticky top-6"
        >
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 border-b border-border/40 pb-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-4 flex-1 last:flex-none">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step >= num 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                    : "bg-secondary/50 text-muted-foreground"
                }`}>
                  {num}
                </div>
                {num !== 3 && <div className={`h-1 flex-1 rounded-full ${step > num ? "bg-primary" : "bg-secondary/50"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               <div>
                 <h2 className="text-xl font-black text-foreground mb-2">Target Job Description</h2>
                 <p className="text-sm text-muted-foreground">Paste the job description you are applying for. The AI will extract key requirements.</p>
               </div>
               <Textarea 
                 placeholder="Paste the requirements or description here..." 
                 className="min-h-[250px] bg-secondary/20 rounded-2xl resize-none text-base p-4 border-border/50"
                 value={jobDescription}
                 onChange={(e) => setJobDescription(e.target.value)}
               />
               <Button onClick={() => setStep(2)} disabled={jobDescription.length < 20} className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50">
                 Continue to Strategy
               </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                 <h2 className="text-xl font-black text-foreground mb-2">Optimization Strategy</h2>
                 <p className="text-sm text-muted-foreground">How should the AI format your resume for this application?</p>
              </div>
              <div className="grid gap-4">
                <button 
                  onClick={() => setStrategy("ats")}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${strategy === "ats" ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border/50 hover:border-primary/30"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${strategy === "ats" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                       <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground text-lg mb-1">Strict ATS Mode</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Removes all columns, tables, and graphics. Prioritizes rigid text structure, heavy keyword injection, and maximum machine readability. Recommended for standard job portals (Workday, Taleo).
                      </p>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => setStrategy("creative")}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${strategy === "creative" ? "border-gold bg-gold/5 shadow-md shadow-gold/10" : "border-border/50 hover:border-gold/30"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl flex-shrink-0 ${strategy === "creative" ? "bg-gold/20 text-gold" : "bg-secondary text-muted-foreground"}`}>
                       <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-foreground text-lg mb-1">Premium Creative</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                        Focuses on storytelling, visual layout, and graphic templates to stand out to human recruiters. Best for direct emails, networking, or design/frontend roles.
                      </p>
                    </div>
                  </div>
                </button>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <Button variant="ghost" onClick={() => setStep(1)} className="font-bold text-muted-foreground rounded-xl">Back</Button>
                <Button onClick={handleGenerate} disabled={!strategy} className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50">
                  <Play className="w-5 h-5 mr-2 fill-current" /> Generate Resume
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
              {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                     <div className="w-20 h-20 border-4 border-secondary rounded-full border-t-primary animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-gold animate-pulse" />
                     </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground mb-2">Analyzing Match...</h3>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Injecting keywords and optimizing structure.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-success/5 border border-success/20 p-6 rounded-3xl">
                     <div className="flex items-center gap-3 mb-2">
                       <CheckCircle className="w-6 h-6 text-success" />
                       <h3 className="text-lg font-black text-foreground">Generation Complete</h3>
                     </div>
                     <p className="text-sm font-medium text-muted-foreground">Your master profile has been perfectly tailored to the job description.</p>
                  </div>

                  {/* Template Selection shown only in Creative strategy */}
                  {strategy === "creative" && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Select Aesthetic</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {templates.filter(t => t.id !== "ats").map((t) => (
                          <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl border-2 transition-all text-center group ${selectedTemplate === t.id ? "border-gold bg-gold/5 shadow-md ring-4 ring-gold/10" : "border-border hover:border-gold/40 bg-card"}`}>
                            <t.icon className={`w-5 h-5 mx-auto mb-2 transition-transform group-hover:scale-110 ${selectedTemplate === t.id ? t.color : "text-muted-foreground"}`} />
                            <p className="text-xs font-black uppercase tracking-tight">{t.name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If ATS, show lock info */}
                  {strategy === "ats" && (
                    <div className="p-4 bg-secondary/50 rounded-2xl border border-border/50 flex gap-3 text-sm font-medium text-muted-foreground">
                      <CheckCircle className="w-5 h-5 text-success shrink-0" />
                      Template is locked to ATS Optimized layout for maximum parseability.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Right Panel: Live Preview (Universal) */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="print-area bg-white shadow-2xl rounded-2xl overflow-hidden min-h-[800px]"
        >
          {step < 3 || (step === 3 && isGenerating) || !generatedResume ? (
            <div className="h-full min-h-[800px] flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 m-8 rounded-2xl">
               <FileText className="w-16 h-16 text-slate-300 mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Preview</p>
               <p className="text-slate-400 text-xs mt-2 italic max-w-xs text-center">Complete the generation steps to view your tailored resume here.</p>
            </div>
          ) : (
             <div ref={previewRef} className={`w-full bg-white text-slate-800 transition-all relative ${["minimal", "ats"].includes(selectedTemplate) ? "p-12" : "p-0"}`}>
               {selectedTemplate === "ats" && <AtsTemplate data={generatedResume} />}
               {selectedTemplate === "modern" && <ModernTemplate data={generatedResume} />}
               {selectedTemplate === "minimal" && <MinimalTemplate data={generatedResume} />}
               {selectedTemplate === "designer" && <DesignerTemplate data={generatedResume} />}
             </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ------ TEMPLATES ------
const AtsTemplate = ({ data }: { data: any }) => (
  <div className="p-6 space-y-10 font-sans text-slate-900 border-x-4 border-transparent hover:border-slate-200 transition-colors">
    <div className="border-b-2 border-slate-900 pb-8 text-center bg-white">
      <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">{data.personal.firstName} {data.personal.lastName}</h2>
      <div className="text-sm flex justify-center gap-6 font-medium text-slate-600">
        <span>{data.personal.email}</span>
        <span>{data.personal.phone}</span>
        <span>{data.personal.location}</span>
      </div>
    </div>
    <section>
      <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 mb-4 pb-1">Professional Summary</h3>
      <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{data.personal.summary}</p>
    </section>
    <section>
      <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 mb-6 pb-1">Core Experience</h3>
      <div className="space-y-8">
        {data.experience.map((exp: any) => (
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
        {data.education.map((edu: any) => (
          <div key={edu.id}>
            <div className="flex justify-between font-bold text-sm">
              <span>{edu.school}</span>
              <span>{edu.duration}</span>
            </div>
            <div className="text-sm">{edu.degree}</div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const ModernTemplate = ({ data }: { data: any }) => (
  <>
    <div className="bg-blue-600 text-white p-12">
      <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">{data.personal.firstName} {data.personal.lastName}</h2>
      <div className="flex flex-wrap gap-6 text-[11px] font-bold text-blue-100 uppercase tracking-widest">
        <span>{data.personal.email}</span>
        <span>{data.personal.phone}</span>
        <span>{data.personal.location}</span>
      </div>
    </div>
    <div className="p-12 space-y-12">
      <section>
        <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4 pb-1 border-b-2 border-blue-50">Executive Summary</h3>
        <p className="text-sm leading-relaxed text-slate-600 font-medium italic whitespace-pre-wrap">{data.personal.summary}</p>
      </section>
      <section>
        <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-6 pb-1 border-b-2 border-blue-50">Experience</h3>
        <div className="space-y-8">
          {data.experience.map((exp: any) => (
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
    </div>
  </>
);

const MinimalTemplate = ({ data }: { data: any }) => (
  <div className="space-y-12">
    <div className="text-center pb-12 border-b border-slate-100">
      <h2 className="text-5xl font-light text-slate-900 mb-6 tracking-tight italic">{data.personal.firstName} {data.personal.lastName}</h2>
      <div className="flex justify-center gap-10 text-[10px] text-slate-400 tracking-[0.3em] uppercase font-bold">
        <span>{data.personal.email}</span>
        <span>{data.personal.phone}</span>
        <span>{data.personal.location}</span>
      </div>
    </div>
    <p className="text-[15px] text-center italic text-slate-500 max-w-xl mx-auto leading-loose font-serif whitespace-pre-wrap">{data.personal.summary}</p>
    <section>
      <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-10 text-center relative after:absolute after:bottom-[-20px] after:left-1/2 after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-slate-200">History</h3>
      <div className="space-y-12">
        {data.experience.map((exp: any) => (
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
  </div>
);

const DesignerTemplate = ({ data }: { data: any }) => (
  <div className="flex min-h-[800px] font-sans bg-slate-50">
    <div className="w-[35%] bg-slate-900 text-white p-12 space-y-20 relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-5xl font-black uppercase mb-1 tracking-tighter leading-none">{data.personal.firstName}</h2>
        <h2 className="text-5xl font-light uppercase tracking-[0.2em] text-purple-400 leading-none">{data.personal.lastName}</h2>
      </div>
      <div className="text-[11px] space-y-4 font-bold text-slate-100 uppercase tracking-widest relative z-10">
        <p>{data.personal.email}</p>
        <p>{data.personal.phone}</p>
      </div>
    </div>
    <div className="flex-1 p-12 space-y-12 bg-white">
      <p className="text-[13px] font-semibold text-slate-500 leading-loose whitespace-pre-wrap">{data.personal.summary}</p>
      <div className="space-y-10">
        {data.experience.map((exp: any) => (
          <div key={exp.id} className="group">
            <div className="flex items-center gap-4 mb-2">
              <h4 className="font-black text-slate-900 text-xl uppercase tracking-tight">{exp.role}</h4>
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[9px] font-black text-slate-400 tracking-widest uppercase">{exp.duration}</span>
            </div>
            <p className="text-[10px] font-black text-purple-600 uppercase mb-4 tracking-[0.2em]">{exp.company}</p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
