"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Zap,
  FileCheck,
  Layers,
  Sparkles,
  Download,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Copy,
  RotateCcw,
  Briefcase,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getProfile, defaultProfile, UserProfile } from "@/lib/profile-store";
import { saveResume, generateResumeId } from "@/lib/resume-store";
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

type OptType = "ats" | "creative" | null;
type Step = 1 | 2 | 3 | 4;

const creativeTemplates = [
  {
    id: "modern-split",
    name: "Modern Split",
    desc: "Two-column layout with a clean accent sidebar for skills and contact info.",
    preview: "split",
  },
  {
    id: "minimal-pro",
    name: "Minimal Pro",
    desc: "Single-column with a subtle color header and elegant typography.",
    preview: "minimal",
  },
  {
    id: "bold-header",
    name: "Bold Header",
    desc: "Impactful header with a visual skills grid and structured sections.",
    preview: "bold",
  },
];

const steps = [
  { num: 1, label: "Job Details" },
  { num: 2, label: "Strategy" },
  { num: 3, label: "Generate" },
  { num: 4, label: "Preview" },
];

export default function ResumeWorkspacePage() {
  const [step, setStep] = useState<Step>(1);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [optimizationType, setOptimizationType] = useState<OptType>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isExporting, setIsExporting] = useState(false);
  
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const generatingSteps = [
    "Analyzing job description…",
    "Extracting key requirements…",
    "Mapping your experience…",
    "Optimizing content…",
    "Generating resume…",
  ];

  const canProceedStep1 =
    targetRole.trim().length > 0 && jobDescription.trim().length > 20;

  const canProceedStep2 = optimizationType !== null;

  const handleGenerate = async () => {
    setStep(3);
    setGeneratingStep(0);

    // Initial loading animation
    const loadingInterval = setInterval(() => {
      setGeneratingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch("/api/ats/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jd: jobDescription,
          targetRole,
          company,
          optimizationType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate resume through ATS pipeline.");
      }

      const data = await response.json();
      
      clearInterval(loadingInterval);
      setGeneratingStep(4);
      // Wait a moment for UX
      await new Promise((r) => setTimeout(r, 1000));

      setGeneratedContent(data.generatedContent);
      setAtsScore(data.atsScore);

      saveResume({
        id: generateResumeId(),
        targetRole,
        company,
        jobDescription,
        optimizationType: optimizationType!,
        atsScore: data.atsScore,
        status: "active",
        templateId: selectedTemplate,
        generatedContent: data.generatedContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setStep(4);
    } catch (error: any) {
      clearInterval(loadingInterval);
      setStep(1);
      toast.error(error.message || "An error occurred while generating your resume.");
    }
  };

  const handleReset = () => {
    setStep(1);
    setGeneratedContent("");
    setAtsScore(null);
    setJobDescription("");
    setTargetRole("");
    setCompany("");
    setOptimizationType(null);
    setSelectedTemplate("");
    setGeneratingStep(0);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Resume content copied to clipboard");
  };

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;
    
    setIsExporting(true);
    const toastId = toast.loading("Generating your high-end PDF...");

    try {
      // Ensure the DOM is fully settled before capturing
      await new Promise((resolve) => window.requestAnimationFrame(resolve));

      const element = resumeRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`JobFlow_Resume_${targetRole.replace(/\s+/g, "_")}.pdf`);
      
      toast.success("Resume exported successfully!", { id: toastId });
    } catch (error) {
      console.error("PDF Export error:", error);
      toast.error(`Export failed: ${(error as Error).message}`, { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Resume Workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create AI-optimized resumes tailored to any job description.
          </p>
        </div>
        {step === 4 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 rounded-xl text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Resume
            </Button>
            <Button 
              className="gap-2 rounded-xl text-sm shadow-sm"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              <Download className={cn("w-3.5 h-3.5", isExporting && "animate-bounce")} /> 
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
          </div>
        )}
      </div>

      {/* Step Progress Bar */}
      {step < 4 && (
        <div className="flex items-center gap-2">
          {steps.slice(0, 3).map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 transition-all",
                    step > s.num
                      ? "bg-foreground text-background"
                      : step === s.num
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {step > s.num ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    s.num
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    step >= s.num
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
                {i < 2 && (
                  <div
                    className={cn(
                      "flex-1 h-px ml-2",
                      step > s.num ? "bg-foreground" : "bg-border"
                    )}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {/* ────────── STEP 1: Job Description ────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Target Position
                </h2>
                <p className="text-xs text-muted-foreground">
                  Tell us about the role you&apos;re applying for.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Job Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Senior Frontend Engineer"
                    className="rounded-lg bg-muted/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Company <span className="text-muted-foreground/50">(optional)</span>
                  </label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Stripe"
                    className="rounded-lg bg-muted/30"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  Job Description <span className="text-destructive text-xs">*</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Paste the full job posting. Our AI extracts key requirements to tailor your resume.
                </p>
              </div>

              <Textarea
                placeholder="Paste the full job description here. Include responsibilities, requirements, qualifications, and any preferred skills…"
                className="min-h-[220px] rounded-xl bg-muted/30 border-border/40 resize-none text-sm leading-relaxed focus-visible:ring-primary/20"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Minimum 20 characters for analysis
                </span>
                <span
                  className={
                    jobDescription.length > 20
                      ? "text-success font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {jobDescription.length} chars
                </span>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="gap-2 rounded-xl shadow-sm px-8"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ────────── STEP 2: Optimization Strategy ────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="rounded-xl border border-border/40 bg-card p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-1">
                  Choose Optimization Strategy
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select how your resume will be formatted based on your application method.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ATS Option */}
                <button
                  onClick={() => {
                    setOptimizationType("ats");
                    setSelectedTemplate("clean");
                  }}
                  className={cn(
                    "text-left p-5 rounded-xl border-2 transition-all duration-200 group",
                    optimizationType === "ats"
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border/40 hover:border-foreground/20 bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        optimizationType === "ats"
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      )}
                    >
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">
                          ATS Optimized
                        </h3>
                        {optimizationType === "ats" && (
                          <CheckCircle2 className="w-4 h-4 text-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Simple single-column format. No tables, no graphics.
                        Maximum keyword density and ATS parsability.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded">
                          Recommended for ATS
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Creative/Visual Option */}
                <button
                  onClick={() => {
                    setOptimizationType("creative");
                    setSelectedTemplate("modern-split");
                  }}
                  className={cn(
                    "text-left p-5 rounded-xl border-2 transition-all duration-200 group",
                    optimizationType === "creative"
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border/40 hover:border-foreground/20 bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                        optimizationType === "creative"
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                      )}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">
                          Non-ATS (Visual)
                        </h3>
                        {optimizationType === "creative" && (
                          <CheckCircle2 className="w-4 h-4 text-foreground" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Graphically beautiful templates with columns, color
                        accents. Perfect for networking and creative roles.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 bg-muted/50 px-2 py-0.5 rounded">
                          Best for networking
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Template Selection — only for creative */}
            <AnimatePresence>
              {optimizationType === "creative" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="rounded-xl border border-border/40 bg-card p-6 space-y-4">
                    <div>
                      <h2 className="text-base font-semibold text-foreground mb-1">
                        Choose a Template
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Select a design that matches your personal brand.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {creativeTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={cn(
                            "text-left p-4 rounded-xl border-2 transition-all duration-200",
                            selectedTemplate === tpl.id
                              ? "border-foreground bg-foreground/5 shadow-sm"
                              : "border-border/40 hover:border-foreground/20"
                          )}
                        >
                          {/* Template mini preview */}
                          <div className="w-full aspect-[3/4] rounded-lg bg-muted/50 mb-3 flex items-center justify-center overflow-hidden border border-border/30">
                            <TemplatePreview type={tpl.preview} />
                          </div>
                          <h4 className="text-sm font-semibold text-foreground">
                            {tpl.name}
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                            {tpl.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="gap-2 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!canProceedStep2}
                className="gap-2 rounded-xl shadow-sm px-8"
              >
                <Sparkles className="w-4 h-4" />
                Generate Resume
              </Button>
            </div>
          </motion.div>
        )}

        {/* ────────── STEP 3: Generating ────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center text-center py-20"
          >
            <div className="relative mb-8">
              <div className="w-20 h-20 border-[3px] border-muted rounded-full border-t-foreground animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-7 h-7 text-foreground" />
              </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground mb-2">
              Generating your resume
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              {targetRole}
              {company ? ` at ${company}` : ""} •{" "}
              {optimizationType === "ats" ? "ATS Optimized" : "Visual Design"}
            </p>

            <div className="space-y-3 max-w-xs text-left">
              {generatingSteps.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: i <= generatingStep ? 1 : 0.3,
                    x: 0,
                  }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 text-sm"
                >
                  {i < generatingStep ? (
                    <CheckCircle2 className="w-4 h-4 text-foreground shrink-0" />
                  ) : i === generatingStep ? (
                    <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                  )}
                  <span
                    className={
                      i <= generatingStep
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {s}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ────────── STEP 4: Preview ────────── */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Score + Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/40 bg-card p-4">
              <div className="flex items-center gap-4">
                {atsScore !== null && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 border border-border/30">
                    <CheckCircle2 className="w-4 h-4 text-foreground" />
                    <span className="text-sm font-semibold text-foreground">
                      ATS Score: {atsScore}%
                    </span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  Optimized for{" "}
                  <span className="font-medium text-foreground">
                    {targetRole}
                  </span>
                  {company ? (
                    <>
                      {" "}at{" "}
                      <span className="font-medium text-foreground">
                        {company}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 rounded-lg text-xs"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </Button>
              </div>
            </div>

            {/* Resume Document */}
            <div 
              ref={resumeRef}
              className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div
                  className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-[system-ui]"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {generatedContent}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Template Mini-Preview SVGs ─── */
function TemplatePreview({ type }: { type: string }) {
  if (type === "split") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="40" height="160" rx="2" fill="currentColor" opacity="0.08" />
        <rect x="6" y="10" width="28" height="3" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="6" y="18" width="20" height="2" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="6" y="30" width="28" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="6" y="35" width="24" height="2" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="6" y="40" width="26" height="2" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="6" y="55" width="28" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="6" y="60" width="22" height="2" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="6" y="65" width="26" height="2" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="48" y="10" width="50" height="4" rx="1" fill="currentColor" opacity="0.25" />
        <rect x="48" y="18" width="66" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="48" y="28" width="30" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="48" y="34" width="66" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="48" y="39" width="60" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="48" y="44" width="64" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="48" y="56" width="30" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="48" y="62" width="66" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="48" y="67" width="60" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="48" y="72" width="55" height="2" rx="1" fill="currentColor" opacity="0.08" />
      </svg>
    );
  }
  if (type === "minimal") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="24" rx="2" fill="currentColor" opacity="0.06" />
        <rect x="10" y="8" width="60" height="4" rx="1" fill="currentColor" opacity="0.2" />
        <rect x="10" y="15" width="40" height="2" rx="1" fill="currentColor" opacity="0.1" />
        <rect x="10" y="32" width="25" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="10" y="38" width="100" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="10" y="43" width="95" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="10" y="55" width="25" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="10" y="61" width="100" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="10" y="66" width="90" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="10" y="71" width="95" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="10" y="83" width="25" height="2" rx="1" fill="currentColor" opacity="0.15" />
        <rect x="10" y="89" width="100" height="2" rx="1" fill="currentColor" opacity="0.08" />
        <rect x="10" y="94" width="85" height="2" rx="1" fill="currentColor" opacity="0.08" />
      </svg>
    );
  }
  // bold
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full p-3">
      <rect x="0" y="0" width="120" height="35" rx="2" fill="currentColor" opacity="0.1" />
      <rect x="10" y="10" width="70" height="5" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="10" y="19" width="50" height="2" rx="1" fill="currentColor" opacity="0.12" />
      <rect x="10" y="24" width="40" height="2" rx="1" fill="currentColor" opacity="0.08" />
      <rect x="10" y="44" width="20" height="2" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="10" y="50" width="22" height="10" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="36" y="50" width="22" height="10" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="62" y="50" width="22" height="10" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="88" y="50" width="22" height="10" rx="2" fill="currentColor" opacity="0.06" />
      <rect x="10" y="68" width="25" height="2" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="10" y="74" width="100" height="2" rx="1" fill="currentColor" opacity="0.08" />
      <rect x="10" y="79" width="90" height="2" rx="1" fill="currentColor" opacity="0.08" />
      <rect x="10" y="84" width="95" height="2" rx="1" fill="currentColor" opacity="0.08" />
      <rect x="10" y="96" width="25" height="2" rx="1" fill="currentColor" opacity="0.15" />
      <rect x="10" y="102" width="100" height="2" rx="1" fill="currentColor" opacity="0.08" />
      <rect x="10" y="107" width="85" height="2" rx="1" fill="currentColor" opacity="0.08" />
    </svg>
  );
}
