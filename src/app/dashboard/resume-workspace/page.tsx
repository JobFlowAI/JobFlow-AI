"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Zap,
  FileCheck,
  Layers,
  Sparkles,
  Download,
  ArrowRight,
  CheckCircle2,
  Copy,
  RotateCcw,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getProfile } from "@/lib/profile-store";
import { saveResume, generateResumeId } from "@/lib/resume-store";

type OptType = "ats" | "creative" | null;
type Phase = "input" | "generating" | "preview";

const atsTemplates = [
  { id: "clean", name: "Clean Standard", desc: "Single column, no graphics" },
];

const creativeTemplates = [
  { id: "modern-split", name: "Modern Split", desc: "Two-column with accent bar" },
  { id: "minimal-pro", name: "Minimal Pro", desc: "Clean with subtle color header" },
  { id: "bold-header", name: "Bold Header", desc: "Large header with skills grid" },
];

export default function ResumeWorkspacePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [company, setCompany] = useState("");
  const [optimizationType, setOptimizationType] = useState<OptType>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [generatedContent, setGeneratedContent] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [generatingStep, setGeneratingStep] = useState(0);

  const profile = getProfile();

  const generatingSteps = [
    "Analyzing job description...",
    "Extracting key requirements...",
    "Mapping your experience...",
    "Optimizing content...",
    "Generating resume...",
  ];

  const canGenerate =
    jobDescription.trim().length > 20 &&
    optimizationType !== null &&
    targetRole.trim() !== "";

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setPhase("generating");
    setGeneratingStep(0);

    // Simulate step-by-step generation
    for (let i = 0; i < generatingSteps.length; i++) {
      setGeneratingStep(i);
      await new Promise((r) => setTimeout(r, 800));
    }

    // Generate mock resume content based on profile and JD
    const mockContent = generateMockResume(
      profile,
      targetRole,
      company,
      optimizationType!
    );
    const mockScore =
      optimizationType === "ats" ? Math.floor(Math.random() * 15) + 82 : null;

    setGeneratedContent(mockContent);
    setAtsScore(mockScore);

    // Save to resume store
    saveResume({
      id: generateResumeId(),
      targetRole,
      company,
      jobDescription,
      optimizationType: optimizationType!,
      atsScore: mockScore,
      status: "active",
      templateId: selectedTemplate,
      generatedContent: mockContent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setPhase("preview");
  };

  const handleReset = () => {
    setPhase("input");
    setGeneratedContent("");
    setAtsScore(null);
    setJobDescription("");
    setTargetRole("");
    setCompany("");
    setOptimizationType(null);
    setSelectedTemplate("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success("Resume content copied to clipboard");
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/30 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Resume Workspace
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create AI-optimized resumes tailored to any job description
          </p>
        </div>
        {phase === "preview" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2 rounded-xl text-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> New Resume
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="gap-2 rounded-xl text-sm"
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </Button>
            <Button className="gap-2 rounded-xl text-sm shadow-sm">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* INPUT PHASE */}
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex"
            >
              {/* Left Panel — Job Description Input */}
              <div className="flex-1 p-6 overflow-y-auto border-r border-border/30">
                <div className="max-w-xl mx-auto space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-primary" />
                      Target Position
                    </h2>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block font-medium">
                          Job Title *
                        </label>
                        <Input
                          value={targetRole}
                          onChange={(e) => setTargetRole(e.target.value)}
                          placeholder="Senior Frontend Engineer"
                          className="rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block font-medium">
                          Company
                        </label>
                        <Input
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Stripe"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      Job Description *
                    </label>
                    <Textarea
                      placeholder="Paste the full job description here. Our AI will extract key requirements, skills, and qualifications to optimize your resume..."
                      className="min-h-[200px] rounded-xl bg-muted/20 border-border/40 resize-none text-sm leading-relaxed focus-visible:ring-primary/20"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-muted-foreground">
                        Minimum 20 characters
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
                </div>
              </div>

              {/* Right Panel — Optimization Type Selection */}
              <div className="w-[400px] p-6 overflow-y-auto bg-muted/10">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-foreground mb-1">
                      Optimization Strategy
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Select based on how you&apos;re applying.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* ATS Mode */}
                    <button
                      onClick={() => {
                        setOptimizationType("ats");
                        setSelectedTemplate("clean");
                      }}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        optimizationType === "ats"
                          ? "border-success bg-success/5 shadow-sm"
                          : "border-border/40 hover:border-success/30 bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            optimizationType === "ats"
                              ? "bg-success/20 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-sm">
                              ATS Optimized
                            </h3>
                            {optimizationType === "ats" && (
                              <CheckCircle2 className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Simple single-column format. No tables, no graphics.
                            Maximum keyword density and ATS parsability.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Creative Mode */}
                    <button
                      onClick={() => {
                        setOptimizationType("creative");
                        setSelectedTemplate("modern-split");
                      }}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                        optimizationType === "creative"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/40 hover:border-primary/30 bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            optimizationType === "creative"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground text-sm">
                              Non-ATS (Visual)
                            </h3>
                            {optimizationType === "creative" && (
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Graphically beautiful templates with columns, color
                            accents. Perfect for networking and creative roles.
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Template Selection for Creative */}
                  {optimizationType === "creative" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <h3 className="text-xs font-medium text-muted-foreground">
                        Choose Template
                      </h3>
                      {creativeTemplates.map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                            selectedTemplate === tpl.id
                              ? "border-primary/30 bg-primary/5"
                              : "border-border/30 hover:border-border/50"
                          }`}
                        >
                          <span className="font-medium text-foreground">
                            {tpl.name}
                          </span>
                          <span className="text-xs text-muted-foreground block mt-0.5">
                            {tpl.desc}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {/* Generate Button */}
                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate}
                    className="w-full gap-2 rounded-xl shadow-sm py-3"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Resume
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* GENERATING PHASE */}
          {phase === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-6"
            >
              <div className="relative mb-8">
                <div className="w-20 h-20 border-[3px] border-muted rounded-full border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
                AI is generating your resume
              </h2>
              <div className="space-y-2 max-w-sm">
                {generatingSteps.map((step, i) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: i <= generatingStep ? 1 : 0.3,
                      x: 0,
                    }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    {i < generatingStep ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : i === generatingStep ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                    )}
                    <span
                      className={
                        i <= generatingStep
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* PREVIEW PHASE */}
          {phase === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex"
            >
              {/* Resume Preview */}
              <div className="flex-1 p-6 overflow-y-auto flex justify-center">
                <div className="w-full max-w-[700px]">
                  {/* ATS Score badge */}
                  {atsScore !== null && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <span className="text-sm font-semibold text-success">
                          ATS Score: {atsScore}%
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Optimized for {targetRole}
                        {company ? ` at ${company}` : ""}
                      </span>
                    </div>
                  )}

                  {/* Resume document */}
                  <div className="bg-white dark:bg-card rounded-xl border border-border/40 shadow-lg p-8 md:p-12 text-foreground">
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-sm leading-relaxed font-[system-ui]"
                      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                    >
                      {generatedContent}
                    </div>
                  </div>
                </div>
              </div>

              {/* Side info panel */}
              <div className="w-[300px] p-6 border-l border-border/30 bg-muted/10 overflow-y-auto">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Resume Details
                </h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">
                      Target Role
                    </span>
                    <span className="font-medium text-foreground">
                      {targetRole}
                    </span>
                  </div>
                  {company && (
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">
                        Company
                      </span>
                      <span className="font-medium text-foreground">
                        {company}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">
                      Optimization
                    </span>
                    <span className="font-medium text-foreground">
                      {optimizationType === "ats"
                        ? "ATS Optimized"
                        : "Visual Design"}
                    </span>
                  </div>
                  {atsScore && (
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">
                        ATS Score
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-success rounded-full transition-all"
                            style={{ width: `${atsScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-success text-xs">
                          {atsScore}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Mock resume content generator
function generateMockResume(
  profile: ReturnType<typeof getProfile>,
  targetRole: string,
  company: string,
  type: "ats" | "creative"
): string {
  const name =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : "John Doe";
  const email = profile.email || "john@example.com";
  const phone = profile.phone || "(555) 123-4567";
  const location = profile.location || "San Francisco, CA";
  const summary =
    profile.summary ||
    `Results-driven professional with extensive experience in software development and a proven track record of delivering high-impact solutions.`;

  const skills =
    profile.skills.length > 0
      ? profile.skills.join(" • ")
      : "React • TypeScript • Node.js • Python • AWS • Docker • CI/CD • REST APIs";

  const experienceBlock =
    profile.experience.length > 0
      ? profile.experience
          .map(
            (exp) =>
              `${exp.title || "Software Engineer"} | ${exp.company || "Tech Company"}\n${exp.startDate || "2022"} - ${exp.endDate || "Present"}\n${exp.bullets
                .filter((b) => b.trim())
                .map((b) => `• ${b}`)
                .join("\n")}`
          )
          .join("\n\n")
      : `Senior Software Engineer | TechCorp Inc.\n2022 - Present\n• Led the development of a React-based dashboard serving 50K+ daily active users\n• Implemented CI/CD pipelines reducing deployment time by 60%\n• Mentored 4 junior developers and conducted technical interviews\n\nSoftware Engineer | StartupXYZ\n2020 - 2022\n• Built RESTful APIs using Node.js and Express serving 100K+ requests/day\n• Optimized database queries achieving 40% improvement in response times\n• Collaborated with product team to deliver 3 major feature releases`;

  const educationBlock =
    profile.education.length > 0
      ? profile.education
          .map(
            (edu) =>
              `${edu.degree || "B.S. Computer Science"} | ${edu.institution || "University"}`
          )
          .join("\n")
      : `B.S. Computer Science | Stanford University`;

  if (type === "ats") {
    return `${name.toUpperCase()}
${email} | ${phone} | ${location}
${profile.linkedinUrl || "linkedin.com/in/profile"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL SUMMARY
${summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILLS
${skills}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROFESSIONAL EXPERIENCE
${experienceBlock}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EDUCATION
${educationBlock}`;
  }

  // Creative format
  return `╔══════════════════════════════════════╗
║  ${name.toUpperCase()}
║  ${targetRole}${company ? ` | ${company}` : ""}
╚══════════════════════════════════════╝

📧 ${email}  📞 ${phone}  📍 ${location}

─── About Me ───────────────────────
${summary}

─── Technical Skills ───────────────
${skills}

─── Experience ─────────────────────
${experienceBlock}

─── Education ──────────────────────
${educationBlock}`;
}
