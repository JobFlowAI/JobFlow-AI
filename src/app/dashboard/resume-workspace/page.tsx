"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  Edit3,
  RotateCcw,
  Briefcase,
  Check,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getProfile, defaultProfile, UserProfile } from "@/lib/profile-store";
import { saveResume, generateResumeId } from "@/lib/resume-store";
import { cn } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { AtsTemplate } from "@/components/resume-templates/AtsTemplate";
import { AtsPdfTemplate } from "@/components/resume-templates/AtsPdfTemplate";
import { ModernSplitTemplate } from "@/components/resume-templates/ModernSplitTemplate";
import { ModernSplitPdfTemplate } from "@/components/resume-templates/ModernSplitPdfTemplate";
import { MinimalProTemplate } from "@/components/resume-templates/MinimalProTemplate";
import { MinimalProPdfTemplate } from "@/components/resume-templates/MinimalProPdfTemplate";
import { BoldHeaderTemplate } from "@/components/resume-templates/BoldHeaderTemplate";
import { BoldHeaderPdfTemplate } from "@/components/resume-templates/BoldHeaderPdfTemplate";
import { ExecutiveClassicTemplate } from "@/components/resume-templates/ExecutiveClassicTemplate";
import { ExecutiveClassicPdfTemplate } from "@/components/resume-templates/ExecutiveClassicPdfTemplate";
import { NavyCorporateTemplate } from "@/components/resume-templates/NavyCorporateTemplate";
import { NavyCorporatePdfTemplate } from "@/components/resume-templates/NavyCorporatePdfTemplate";
import { CreativePortfolioTemplate } from "@/components/resume-templates/CreativePortfolioTemplate";
import { CreativePortfolioPdfTemplate } from "@/components/resume-templates/CreativePortfolioPdfTemplate";
import { TechMinimalistTemplate } from "@/components/resume-templates/TechMinimalistTemplate";
import { TechMinimalistPdfTemplate } from "@/components/resume-templates/TechMinimalistPdfTemplate";
import { ElegantTimelineTemplate } from "@/components/resume-templates/ElegantTimelineTemplate";
import { ElegantTimelinePdfTemplate } from "@/components/resume-templates/ElegantTimelinePdfTemplate";
import { GradientProTemplate } from "@/components/resume-templates/GradientProTemplate";
import { GradientProPdfTemplate } from "@/components/resume-templates/GradientProPdfTemplate";
import { TwoToneLightTemplate } from "@/components/resume-templates/TwoToneLightTemplate";
import { TwoToneLightPdfTemplate } from "@/components/resume-templates/TwoToneLightPdfTemplate";
import { CompactInfographicTemplate } from "@/components/resume-templates/CompactInfographicTemplate";
import { CompactInfographicPdfTemplate } from "@/components/resume-templates/CompactInfographicPdfTemplate";
import { ClassicAcademicTemplate } from "@/components/resume-templates/ClassicAcademicTemplate";
import { ClassicAcademicPdfTemplate } from "@/components/resume-templates/ClassicAcademicPdfTemplate";
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
    desc: "Single-column with a subtle indigo header band and elegant typography.",
    preview: "minimal",
  },
  {
    id: "bold-header",
    name: "Bold Header",
    desc: "Impactful dark header with a visual skills grid and structured sections.",
    preview: "bold",
  },
  {
    id: "executive-classic",
    name: "Executive Classic",
    desc: "Traditional serif, centered header, bordered sections. Conservative and authoritative.",
    preview: "executive",
  },
  {
    id: "navy-corporate",
    name: "Navy Corporate",
    desc: "Full-width navy header with gold accent dividers. Professional and polished.",
    preview: "navy",
  },
  {
    id: "creative-portfolio",
    name: "Creative Portfolio",
    desc: "Thin violet left strip, sidebar layout, and a wide canvas for portfolio feel.",
    preview: "portfolio",
  },
  {
    id: "tech-minimalist",
    name: "Tech Minimalist",
    desc: "Monospace font, code-style section dividers, dark terminal aesthetic.",
    preview: "tech",
  },
  {
    id: "elegant-timeline",
    name: "Elegant Timeline",
    desc: "Vertical timeline through experience with dot markers and rose accents.",
    preview: "timeline",
  },
  {
    id: "gradient-pro",
    name: "Gradient Pro",
    desc: "Deep blue gradient header with full-bleed top section and sky blue accents.",
    preview: "gradient",
  },
  {
    id: "two-tone-light",
    name: "Two-Tone Light",
    desc: "Warm gray sidebar with clean white main column and amber highlights.",
    preview: "twotone",
  },
  {
    id: "compact-infographic",
    name: "Compact Infographic",
    desc: "Skill tag chips, two-column experience layout, and a dense teal design.",
    preview: "infographic",
  },
  {
    id: "classic-academic",
    name: "Classic Academic",
    desc: "Centered serif header, thin HR dividers, formal justified text for academia.",
    preview: "academic",
  },
];

const steps = [
  { num: 1, label: "Job Details" },
  { num: 2, label: "Strategy" },
  { num: 3, label: "Generate" },
  { num: 4, label: "Preview" },
];

export default function ResumeWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="p-6 md:p-8 max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-muted rounded-full border-t-foreground animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    }>
      <ResumeWorkspaceContent />
    </Suspense>
  );
}

function ResumeWorkspaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const [preFilledFrom, setPreFilledFrom] = useState<string | null>(null);
  
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProfile().then(setProfile);

    // Check if pre-filled from a job listing
    if (searchParams.get("fromJob") === "true") {
      try {
        const stored = sessionStorage.getItem("jobflow_selected_job");
        if (stored) {
          const jobData = JSON.parse(stored);
          if (jobData.targetRole) setTargetRole(jobData.targetRole);
          if (jobData.company) setCompany(jobData.company);
          if (jobData.jobDescription) setJobDescription(jobData.jobDescription);
          setPreFilledFrom(jobData.company || "job listing");
          // Clean up sessionStorage
          sessionStorage.removeItem("jobflow_selected_job");
        }
      } catch {
        // Silently fail if sessionStorage access fails
      }
    }
  }, [searchParams]);

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

      const newId = generateResumeId();
      setSavedResumeId(newId);
      await saveResume({
        id: newId,
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
    setSavedResumeId(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Resume content copied to clipboard");
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Generating your high-end PDF...");

    try {
      let data = null;
      try {
        data = JSON.parse(generatedContent);
      } catch (e) {
        throw new Error("Cannot export raw text to PDF. Missing structured data.");
      }

      // Dynamic Engine: Select correct PDF component
      let pdfComponent = <AtsPdfTemplate data={data} />;
      
      if (optimizationType === "creative") {
        if (selectedTemplate === "modern-split") {
          pdfComponent = <ModernSplitPdfTemplate data={data} />;
        } else if (selectedTemplate === "minimal-pro") {
          pdfComponent = <MinimalProPdfTemplate data={data} />;
        } else if (selectedTemplate === "bold-header") {
          pdfComponent = <BoldHeaderPdfTemplate data={data} />;
        } else if (selectedTemplate === "executive-classic") {
          pdfComponent = <ExecutiveClassicPdfTemplate data={data} />;
        } else if (selectedTemplate === "navy-corporate") {
          pdfComponent = <NavyCorporatePdfTemplate data={data} />;
        } else if (selectedTemplate === "creative-portfolio") {
          pdfComponent = <CreativePortfolioPdfTemplate data={data} />;
        } else if (selectedTemplate === "tech-minimalist") {
          pdfComponent = <TechMinimalistPdfTemplate data={data} />;
        } else if (selectedTemplate === "elegant-timeline") {
          pdfComponent = <ElegantTimelinePdfTemplate data={data} />;
        } else if (selectedTemplate === "gradient-pro") {
          pdfComponent = <GradientProPdfTemplate data={data} />;
        } else if (selectedTemplate === "two-tone-light") {
          pdfComponent = <TwoToneLightPdfTemplate data={data} />;
        } else if (selectedTemplate === "compact-infographic") {
          pdfComponent = <CompactInfographicPdfTemplate data={data} />;
        } else if (selectedTemplate === "classic-academic") {
          pdfComponent = <ClassicAcademicPdfTemplate data={data} />;
        }
      }

      // Generate actual vector PDF natively
      const rawBlob = await pdf(pdfComponent).toBlob();
      // Ensure the blob has the correct MIME type for PDF
      const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `JobFlow_Resume_${targetRole.replace(/\s+/g, "_")}.pdf`;
      link.type = "application/pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
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
            {savedResumeId && (
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/resumes/${savedResumeId}`)}
                className="gap-2 rounded-xl text-sm"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Resume
              </Button>
            )}
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
            {/* Pre-filled badge */}
            {preFilledFrom && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Pre-filled from {preFilledFrom} job listing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Review the details below and continue to generate your resume.
                  </p>
                </div>
              </div>
            )}

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

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
              <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="gap-1.5 rounded-lg text-xs"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </Button>
                
                <Button
                  onClick={() => {
                    sessionStorage.setItem("jobflow_outreach_context", JSON.stringify({
                      targetRole,
                      company,
                      jobDescription,
                      resumeContent: generatedContent
                    }));
                    router.push("/dashboard/outreach");
                  }}
                  size="sm"
                  variant="secondary"
                  className="gap-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border border-primary/20"
                >
                  <Mail className="w-3.5 h-3.5" /> Write Outreach Email
                </Button>
              </div>
            </div>

            {/* Resume Document */}
            <div 
              ref={resumeRef}
              className="rounded-xl border border-border/40 bg-muted/20 shadow-sm overflow-hidden flex justify-center p-4 sm:p-8"
            >
              {optimizationType === "ats" ? (
                 <AtsTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "modern-split" ? (
                 <ModernSplitTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "minimal-pro" ? (
                 <MinimalProTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "bold-header" ? (
                 <BoldHeaderTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "executive-classic" ? (
                 <ExecutiveClassicTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "navy-corporate" ? (
                 <NavyCorporateTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "creative-portfolio" ? (
                 <CreativePortfolioTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "tech-minimalist" ? (
                 <TechMinimalistTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "elegant-timeline" ? (
                 <ElegantTimelineTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "gradient-pro" ? (
                 <GradientProTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "two-tone-light" ? (
                 <TwoToneLightTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "compact-infographic" ? (
                 <CompactInfographicTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : optimizationType === "creative" && selectedTemplate === "classic-academic" ? (
                 <ClassicAcademicTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              ) : (
                 <AtsTemplate content={generatedContent} className="shadow-lg border border-border/50" />
              )}
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
        <rect x="0" y="0" width="40" height="160" rx="2" fill="#18181b" opacity="0.85" />
        <rect x="6" y="10" width="28" height="3" rx="1" fill="#ffffff" opacity="0.5" />
        <rect x="6" y="18" width="20" height="2" rx="1" fill="#ffffff" opacity="0.3" />
        <rect x="6" y="30" width="28" height="2" rx="1" fill="#ffffff" opacity="0.35" />
        <rect x="6" y="35" width="24" height="2" rx="1" fill="#ffffff" opacity="0.25" />
        <rect x="6" y="40" width="26" height="2" rx="1" fill="#ffffff" opacity="0.25" />
        <rect x="6" y="55" width="28" height="2" rx="1" fill="#ffffff" opacity="0.35" />
        <rect x="6" y="60" width="22" height="2" rx="1" fill="#ffffff" opacity="0.25" />
        <rect x="6" y="65" width="26" height="2" rx="1" fill="#ffffff" opacity="0.25" />
        <rect x="48" y="10" width="50" height="4" rx="1" fill="#111827" opacity="0.7" />
        <rect x="48" y="18" width="66" height="2" rx="1" fill="#6b7280" opacity="0.4" />
        <rect x="48" y="28" width="30" height="2" rx="1" fill="#374151" opacity="0.5" />
        <rect x="48" y="34" width="66" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="48" y="39" width="60" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="48" y="44" width="64" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="48" y="56" width="30" height="2" rx="1" fill="#374151" opacity="0.5" />
        <rect x="48" y="62" width="66" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="48" y="67" width="60" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="48" y="72" width="55" height="2" rx="1" fill="#6b7280" opacity="0.3" />
      </svg>
    );
  }
  if (type === "minimal") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="24" rx="2" fill="#eef2ff" />
        <rect x="0" y="22" width="120" height="2" fill="#a5b4fc" />
        <rect x="8" y="7" width="55" height="4" rx="1" fill="#4338ca" opacity="0.7" />
        <rect x="8" y="15" width="38" height="2" rx="1" fill="#6366f1" opacity="0.5" />
        <rect x="2" y="32" width="3" height="10" rx="1" fill="#818cf8" />
        <rect x="8" y="34" width="22" height="2" rx="1" fill="#4b5563" opacity="0.4" />
        <rect x="8" y="39" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="44" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="2" y="54" width="3" height="10" rx="1" fill="#818cf8" />
        <rect x="8" y="56" width="22" height="2" rx="1" fill="#4b5563" opacity="0.4" />
        <rect x="8" y="62" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="67" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="2" y="77" width="3" height="10" rx="1" fill="#818cf8" />
        <rect x="8" y="79" width="22" height="2" rx="1" fill="#4b5563" opacity="0.4" />
        <rect x="8" y="85" width="95" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="90" width="80" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "bold") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="36" rx="2" fill="#111827" />
        <rect x="8" y="9" width="65" height="5" rx="1" fill="#ffffff" opacity="0.85" />
        <rect x="8" y="18" width="45" height="2" rx="1" fill="#9ca3af" opacity="0.7" />
        <rect x="8" y="23" width="35" height="2" rx="1" fill="#6b7280" opacity="0.5" />
        <rect x="8" y="44" width="20" height="2" rx="1" fill="#374151" opacity="0.5" />
        <rect x="8" y="50" width="22" height="10" rx="2" fill="#f3f4f6" />
        <rect x="34" y="50" width="22" height="10" rx="2" fill="#f3f4f6" />
        <rect x="60" y="50" width="22" height="10" rx="2" fill="#f3f4f6" />
        <rect x="86" y="50" width="22" height="10" rx="2" fill="#f3f4f6" />
        <rect x="8" y="68" width="22" height="2" rx="1" fill="#111827" opacity="0.5" />
        <rect x="8" y="74" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="79" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="84" width="95" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="96" width="22" height="2" rx="1" fill="#111827" opacity="0.5" />
        <rect x="8" y="102" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="107" width="80" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "executive") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="10" y="8" width="100" height="1" fill="#9ca3af" />
        <rect x="20" y="12" width="80" height="5" rx="1" fill="#111827" opacity="0.7" />
        <rect x="30" y="20" width="60" height="2" rx="1" fill="#6b7280" opacity="0.4" />
        <rect x="10" y="27" width="100" height="1" fill="#9ca3af" />
        <rect x="10" y="35" width="50" height="2" rx="1" fill="#374151" opacity="0.5" />
        <rect x="10" y="36" width="100" height="1" fill="#d1d5db" />
        <rect x="10" y="40" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="45" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="55" width="50" height="2" rx="1" fill="#374151" opacity="0.5" />
        <rect x="10" y="56" width="100" height="1" fill="#d1d5db" />
        <rect x="10" y="60" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="65" width="95" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="70" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="80" width="50" height="2" rx="1" fill="#374151" opacity="0.5" />
        <rect x="10" y="81" width="100" height="1" fill="#d1d5db" />
        <rect x="10" y="85" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="90" width="70" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "navy") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="30" rx="2" fill="#1a2f4e" />
        <rect x="8" y="8" width="55" height="4" rx="1" fill="#ffffff" opacity="0.85" />
        <rect x="8" y="16" width="35" height="2" rx="1" fill="#c9a84c" opacity="0.9" />
        <rect x="8" y="22" width="80" height="1.5" rx="0.5" fill="#a8c0d6" opacity="0.5" />
        <rect x="0" y="30" width="120" height="2.5" fill="#c9a84c" />
        <rect x="8" y="40" width="35" height="2" rx="1" fill="#1a2f4e" opacity="0.6" />
        <rect x="8" y="41" width="104" height="1.5" fill="#c9a84c" opacity="0.5" />
        <rect x="8" y="46" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="51" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="61" width="35" height="2" rx="1" fill="#1a2f4e" opacity="0.6" />
        <rect x="8" y="62" width="104" height="1.5" fill="#c9a84c" opacity="0.5" />
        <rect x="8" y="67" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="72" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="82" width="35" height="2" rx="1" fill="#1a2f4e" opacity="0.6" />
        <rect x="8" y="83" width="104" height="1.5" fill="#c9a84c" opacity="0.5" />
        <rect x="8" y="88" width="70" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "portfolio") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="5" height="160" fill="#7c3aed" />
        <rect x="5" y="0" width="35" height="160" fill="#f8f7ff" />
        <rect x="10" y="10" width="25" height="4" rx="1" fill="#4c1d95" opacity="0.7" />
        <rect x="10" y="18" width="18" height="2" rx="1" fill="#7c3aed" opacity="0.5" />
        <rect x="10" y="28" width="25" height="1.5" rx="0.5" fill="#7c3aed" opacity="0.3" />
        <rect x="10" y="33" width="22" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="10" y="38" width="20" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="10" y="50" width="25" height="1.5" rx="0.5" fill="#7c3aed" opacity="0.3" />
        <rect x="10" y="55" width="8" height="5" rx="3" fill="#ede9fe" />
        <rect x="20" y="55" width="8" height="5" rx="3" fill="#ede9fe" />
        <rect x="10" y="63" width="8" height="5" rx="3" fill="#ede9fe" />
        <rect x="48" y="10" width="22" height="2" rx="1" fill="#7c3aed" opacity="0.4" />
        <rect x="48" y="18" width="60" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="48" y="23" width="55" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="48" y="33" width="22" height="2" rx="1" fill="#7c3aed" opacity="0.4" />
        <rect x="46" y="38" width="2" height="30" fill="#ddd6fe" />
        <rect x="50" y="40" width="55" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="45" width="50" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="55" width="55" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="60" width="45" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "tech") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="160" rx="2" fill="#0f1117" />
        <rect x="8" y="8" width="35" height="2" rx="1" fill="#38bdf8" opacity="0.6" />
        <rect x="8" y="14" width="55" height="4" rx="1" fill="#ffffff" opacity="0.8" />
        <rect x="8" y="22" width="40" height="2" rx="1" fill="#94a3b8" opacity="0.5" />
        <rect x="8" y="27" width="80" height="1" fill="#1e2d3d" />
        <rect x="8" y="33" width="40" height="2" rx="1" fill="#38bdf8" opacity="0.5" />
        <rect x="8" y="39" width="18" height="6" rx="1" fill="#0c1a33" stroke="#1e40af" strokeWidth="0.5" />
        <rect x="28" y="39" width="18" height="6" rx="1" fill="#0c1a33" stroke="#1e40af" strokeWidth="0.5" />
        <rect x="48" y="39" width="18" height="6" rx="1" fill="#0c1a33" stroke="#1e40af" strokeWidth="0.5" />
        <rect x="8" y="52" width="40" height="2" rx="1" fill="#38bdf8" opacity="0.5" />
        <rect x="8" y="58" width="55" height="2" rx="1" fill="#a3e635" opacity="0.6" />
        <rect x="8" y="64" width="95" height="2" rx="1" fill="#94a3b8" opacity="0.3" />
        <rect x="8" y="69" width="85" height="2" rx="1" fill="#94a3b8" opacity="0.3" />
        <rect x="8" y="79" width="40" height="2" rx="1" fill="#38bdf8" opacity="0.5" />
        <rect x="8" y="85" width="55" height="2" rx="1" fill="#a3e635" opacity="0.6" />
        <rect x="8" y="91" width="90" height="2" rx="1" fill="#94a3b8" opacity="0.3" />
        <rect x="8" y="96" width="75" height="2" rx="1" fill="#94a3b8" opacity="0.3" />
      </svg>
    );
  }
  if (type === "timeline") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="3" fill="#f43f5e" />
        <rect x="8" y="10" width="55" height="4" rx="1" fill="#111827" opacity="0.7" />
        <rect x="8" y="18" width="35" height="2" rx="1" fill="#f43f5e" opacity="0.7" />
        <rect x="8" y="24" width="90" height="1.5" rx="0.5" fill="#f3f4f6" />
        <rect x="8" y="32" width="22" height="2" rx="1" fill="#fb7185" opacity="0.5" />
        <rect x="18" y="42" width="1.5" height="70" fill="#fecdd3" />
        <circle cx="19" cy="42" r="4" fill="#f43f5e" />
        <rect x="26" y="40" width="35" height="2" rx="1" fill="#111827" opacity="0.5" />
        <rect x="26" y="45" width="25" height="2" rx="1" fill="#f43f5e" opacity="0.4" />
        <rect x="26" y="51" width="70" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="26" y="56" width="65" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <circle cx="19" cy="68" r="4" fill="#f43f5e" />
        <rect x="26" y="66" width="35" height="2" rx="1" fill="#111827" opacity="0.5" />
        <rect x="26" y="71" width="25" height="2" rx="1" fill="#f43f5e" opacity="0.4" />
        <rect x="26" y="77" width="70" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="26" y="82" width="60" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <circle cx="19" cy="94" r="4" fill="#f43f5e" />
        <rect x="26" y="92" width="35" height="2" rx="1" fill="#111827" opacity="0.5" />
        <rect x="26" y="97" width="65" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "gradient") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <defs>
          <linearGradient id="gPro" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="120" height="38" rx="2" fill="url(#gPro)" />
        <rect x="8" y="9" width="60" height="5" rx="1" fill="#ffffff" opacity="0.85" />
        <rect x="8" y="18" width="40" height="2" rx="1" fill="#bae6fd" opacity="0.7" />
        <rect x="8" y="23" width="75" height="1.5" rx="0.5" fill="#bae6fd" opacity="0.4" />
        <rect x="8" y="48" width="18" height="2" rx="1" fill="#0284c7" opacity="0.5" />
        <rect x="8" y="54" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="59" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="69" width="18" height="2" rx="1" fill="#0284c7" opacity="0.5" />
        <rect x="8" y="75" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="80" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="85" width="95" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="95" width="18" height="2" rx="1" fill="#0284c7" opacity="0.5" />
        <rect x="8" y="101" width="80" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="8" y="106" width="65" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "twotone") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="42" height="160" rx="2" fill="#f5f0eb" />
        <rect x="8" y="10" width="28" height="4" rx="1" fill="#78350f" opacity="0.6" />
        <rect x="8" y="18" width="20" height="2" rx="1" fill="#b45309" opacity="0.5" />
        <rect x="8" y="27" width="28" height="1" fill="#fde68a" opacity="0.8" />
        <rect x="8" y="32" width="22" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="8" y="37" width="20" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="8" y="47" width="28" height="1" fill="#fde68a" opacity="0.8" />
        <rect x="10" y="52" width="4" height="4" rx="2" fill="#f59e0b" />
        <rect x="16" y="53" width="20" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="10" y="59" width="4" height="4" rx="2" fill="#f59e0b" />
        <rect x="16" y="60" width="18" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="10" y="66" width="4" height="4" rx="2" fill="#f59e0b" />
        <rect x="16" y="67" width="22" height="2" rx="1" fill="#6b7280" opacity="0.3" />
        <rect x="50" y="10" width="22" height="2" rx="1" fill="#b45309" opacity="0.4" />
        <rect x="50" y="12" width="62" height="1" fill="#f3f4f6" />
        <rect x="50" y="17" width="62" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="22" width="55" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="32" width="22" height="2" rx="1" fill="#b45309" opacity="0.4" />
        <rect x="50" y="34" width="62" height="1" fill="#f3f4f6" />
        <rect x="50" y="39" width="62" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="44" width="55" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="50" y="49" width="48" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "infographic") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="0" y="0" width="120" height="26" rx="2" fill="#0f766e" />
        <rect x="6" y="7" width="45" height="4" rx="1" fill="#ffffff" opacity="0.85" />
        <rect x="6" y="15" width="30" height="2" rx="1" fill="#99f6e4" opacity="0.7" />
        <rect x="0" y="26" width="120" height="10" fill="#f0fdfa" />
        <rect x="6" y="29" width="12" height="4" rx="4" fill="#ccfbf1" />
        <rect x="20" y="29" width="14" height="4" rx="4" fill="#ccfbf1" />
        <rect x="36" y="29" width="10" height="4" rx="4" fill="#ccfbf1" />
        <rect x="48" y="29" width="16" height="4" rx="4" fill="#ccfbf1" />
        <rect x="66" y="29" width="12" height="4" rx="4" fill="#ccfbf1" />
        <rect x="80" y="29" width="14" height="4" rx="4" fill="#ccfbf1" />
        <rect x="6" y="43" width="35" height="1.5" fill="#ccfbf1" />
        <rect x="62" y="43" width="50" height="1.5" fill="#ccfbf1" />
        <rect x="6" y="48" width="35" height="2" rx="1" fill="#374151" opacity="0.4" />
        <rect x="6" y="53" width="22" height="2" rx="1" fill="#0f766e" opacity="0.4" />
        <rect x="6" y="58" width="50" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="6" y="63" width="48" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="62" y="48" width="35" height="2" rx="1" fill="#374151" opacity="0.4" />
        <rect x="62" y="53" width="22" height="2" rx="1" fill="#0f766e" opacity="0.4" />
        <rect x="62" y="58" width="50" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="62" y="63" width="45" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="6" y="80" width="35" height="1.5" fill="#ccfbf1" />
        <rect x="6" y="85" width="35" height="2" rx="1" fill="#374151" opacity="0.4" />
        <rect x="6" y="91" width="22" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="62" y="80" width="50" height="1.5" fill="#ccfbf1" />
        <rect x="62" y="85" width="35" height="2" rx="1" fill="#374151" opacity="0.4" />
        <rect x="62" y="91" width="45" height="2" rx="1" fill="#6b7280" opacity="0.2" />
      </svg>
    );
  }
  if (type === "academic") {
    return (
      <svg viewBox="0 0 120 160" className="w-full h-full p-3">
        <rect x="10" y="8" width="100" height="5" rx="1" fill="#111827" opacity="0.6" />
        <rect x="20" y="16" width="80" height="2" rx="1" fill="#4b5563" opacity="0.3" />
        <rect x="25" y="21" width="70" height="2" rx="1" fill="#6b7280" opacity="0.25" />
        <rect x="10" y="27" width="100" height="2" fill="#1f2937" opacity="0.7" />
        <rect x="10" y="33" width="55" height="2" rx="1" fill="#374151" opacity="0.45" />
        <rect x="10" y="34" width="100" height="1" fill="#9ca3af" opacity="0.5" />
        <rect x="10" y="38" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="43" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="53" width="55" height="2" rx="1" fill="#374151" opacity="0.45" />
        <rect x="10" y="54" width="100" height="1" fill="#9ca3af" opacity="0.5" />
        <rect x="10" y="58" width="90" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="63" width="100" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="68" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="78" width="55" height="2" rx="1" fill="#374151" opacity="0.45" />
        <rect x="10" y="79" width="100" height="1" fill="#9ca3af" opacity="0.5" />
        <rect x="10" y="83" width="85" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="88" width="65" height="2" rx="1" fill="#6b7280" opacity="0.2" />
        <rect x="10" y="103" width="100" height="1" fill="#9ca3af" opacity="0.4" />
      </svg>
    );
  }
  // default split fallback
  return (
    <svg viewBox="0 0 120 160" className="w-full h-full p-3">
      <rect x="0" y="0" width="40" height="160" rx="2" fill="currentColor" opacity="0.08" />
      <rect x="48" y="10" width="50" height="4" rx="1" fill="currentColor" opacity="0.25" />
      <rect x="48" y="28" width="66" height="2" rx="1" fill="currentColor" opacity="0.08" />
    </svg>
  );
}
