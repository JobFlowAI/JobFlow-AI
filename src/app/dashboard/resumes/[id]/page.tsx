"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Download,
  Loader2,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getResumeById, saveResume, GeneratedResume } from "@/lib/resume-store";
import { AtsTemplate, ResumeData } from "@/components/resume-templates/AtsTemplate";
import { ModernSplitTemplate } from "@/components/resume-templates/ModernSplitTemplate";
import { pdf } from "@react-pdf/renderer";
import { AtsPdfTemplate } from "@/components/resume-templates/AtsPdfTemplate";
import { ModernSplitPdfTemplate } from "@/components/resume-templates/ModernSplitPdfTemplate";

export default function ResumeEditorPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const [resume, setResume] = useState<GeneratedResume | null>(null);
  const [data, setData] = useState<ResumeData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    setLoading(true);
    const r = await getResumeById(resumeId);
    if (!r) {
      toast.error("Resume not found");
      router.push("/dashboard/resumes");
      return;
    }
    setResume(r);
    try {
      const parsed =
        typeof r.generatedContent === "string"
          ? JSON.parse(r.generatedContent)
          : r.generatedContent;
      setData(parsed || {});
    } catch {
      setData({});
    }
    setLoading(false);
  };

  // Debounced auto-save
  const triggerAutoSave = useCallback(
    (newData: ResumeData) => {
      setHasChanges(true);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(async () => {
        if (!resume) return;
        const updated: GeneratedResume = {
          ...resume,
          generatedContent: JSON.stringify(newData),
          updatedAt: new Date().toISOString(),
        };
        const ok = await saveResume(updated);
        if (ok) {
          setResume(updated);
          setHasChanges(false);
        }
      }, 2000);
    },
    [resume]
  );

  const updateData = (updater: (prev: ResumeData) => ResumeData) => {
    setData((prev) => {
      const next = updater(prev);
      triggerAutoSave(next);
      return next;
    });
  };

  const handleManualSave = async () => {
    if (!resume) return;
    setSaving(true);
    const updated: GeneratedResume = {
      ...resume,
      generatedContent: JSON.stringify(data),
      updatedAt: new Date().toISOString(),
    };
    const ok = await saveResume(updated);
    if (ok) {
      setResume(updated);
      setHasChanges(false);
      toast.success("Resume saved successfully!");
    } else {
      toast.error("Failed to save resume.");
    }
    setSaving(false);
  };

  const handleExportPDF = async () => {
    if (!resume) return;
    setExporting(true);
    const toastId = toast.loading("Generating PDF…");
    try {
      let pdfComponent = <AtsPdfTemplate data={data} />;
      if (
        resume.optimizationType === "creative" &&
        resume.templateId === "modern-split"
      ) {
        pdfComponent = <ModernSplitPdfTemplate data={data} />;
      }
      const rawBlob = await pdf(pdfComponent).toBlob();
      // Ensure the blob has the correct MIME type for PDF
      const pdfBlob = new Blob([rawBlob], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `JobFlow_Resume_${resume.targetRole.replace(/\s+/g, "_")}.pdf`;
      link.type = "application/pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast.success("Resume exported!", { id: toastId });
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Export failed", { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Loading resume…</p>
      </div>
    );
  }

  if (!resume) return null;

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "summary", label: "Summary", icon: AlignLeft },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "certifications", label: "Certifications", icon: Award },
  ];

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/resumes")}
            className="gap-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">
              {resume.targetRole}
            </h1>
            <p className="text-xs text-muted-foreground">
              {resume.company ? `${resume.company} · ` : ""}
              {resume.optimizationType === "ats" ? "ATS Optimized" : "Visual"}
              {resume.atsScore ? ` · ATS ${resume.atsScore}%` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-amber-500 font-medium animate-pulse">
              Unsaved changes
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualSave}
            disabled={saving || !hasChanges}
            className="gap-1.5 rounded-lg"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            size="sm"
            onClick={handleExportPDF}
            disabled={exporting}
            className="gap-1.5 rounded-lg shadow-sm"
          >
            <Download
              className={cn("w-3.5 h-3.5", exporting && "animate-bounce")}
            />
            {exporting ? "Exporting…" : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Form Editor */}
        <div className="space-y-4 order-2 lg:order-1">
          {/* Section Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                  activeSection === sec.id
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <sec.icon className="w-3.5 h-3.5" />
                {sec.label}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="rounded-xl border border-border/40 bg-card p-5 space-y-5 min-h-[500px]">
            {/* Personal Info */}
            {activeSection === "personal" && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "name", label: "Full Name", placeholder: "John Doe" },
                    { key: "email", label: "Email", placeholder: "john@example.com" },
                    { key: "phone", label: "Phone", placeholder: "555-0100" },
                    { key: "location", label: "Location", placeholder: "San Francisco, CA" },
                    { key: "linkedin", label: "LinkedIn", placeholder: "linkedin.com/in/…" },
                    { key: "github", label: "Portfolio / GitHub", placeholder: "github.com/…" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        {field.label}
                      </label>
                      <Input
                        value={(data.personalInfo as any)?.[field.key] || ""}
                        onChange={(e) =>
                          updateData((prev) => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              [field.key]: e.target.value,
                            },
                          }))
                        }
                        placeholder={field.placeholder}
                        className="rounded-lg bg-muted/30 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Summary */}
            {activeSection === "summary" && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-primary" />
                  Professional Summary
                </h2>
                <Textarea
                  value={data.summary || ""}
                  onChange={(e) =>
                    updateData((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Write a compelling 3-4 sentence professional summary…"
                  className="min-h-[180px] rounded-xl bg-muted/30 text-sm leading-relaxed resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {(data.summary || "").length} characters
                </p>
              </motion.div>
            )}

            {/* Experience */}
            {activeSection === "experience" && (
              <motion.div
                key="experience"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    Professional Experience
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 rounded-lg text-xs h-7"
                    onClick={() =>
                      updateData((prev) => ({
                        ...prev,
                        experience: [
                          ...(prev.experience || []),
                          { title: "", company: "", location: "", dates: "", bullets: [""] },
                        ],
                      }))
                    }
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
                {(data.experience || []).map((exp, ei) => (
                  <div
                    key={ei}
                    className="p-4 rounded-lg border border-border/30 bg-muted/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <GripVertical className="w-3 h-3" />
                        Position {ei + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            experience: prev.experience?.filter((_, i) => i !== ei),
                          }))
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={exp.title || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.experience || [])];
                            updated[ei] = { ...updated[ei], title: e.target.value };
                            return { ...prev, experience: updated };
                          })
                        }
                        placeholder="Job Title"
                        className="rounded-lg bg-background text-sm"
                      />
                      <Input
                        value={exp.company || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.experience || [])];
                            updated[ei] = { ...updated[ei], company: e.target.value };
                            return { ...prev, experience: updated };
                          })
                        }
                        placeholder="Company"
                        className="rounded-lg bg-background text-sm"
                      />
                      <Input
                        value={exp.location || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.experience || [])];
                            updated[ei] = { ...updated[ei], location: e.target.value };
                            return { ...prev, experience: updated };
                          })
                        }
                        placeholder="Location"
                        className="rounded-lg bg-background text-sm"
                      />
                      <Input
                        value={exp.dates || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.experience || [])];
                            updated[ei] = { ...updated[ei], dates: e.target.value };
                            return { ...prev, experience: updated };
                          })
                        }
                        placeholder="Dates (e.g. 2020 – Present)"
                        className="rounded-lg bg-background text-sm"
                      />
                    </div>
                    {/* Bullets */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Bullet Points
                      </label>
                      {(exp.bullets || []).map((bullet, bi) => (
                        <div key={bi} className="flex gap-2">
                          <span className="mt-2.5 text-muted-foreground text-xs">•</span>
                          <Textarea
                            value={bullet}
                            onChange={(e) =>
                              updateData((prev) => {
                                const updated = [...(prev.experience || [])];
                                const bullets = [...(updated[ei].bullets || [])];
                                bullets[bi] = e.target.value;
                                updated[ei] = { ...updated[ei], bullets };
                                return { ...prev, experience: updated };
                              })
                            }
                            className="min-h-[60px] rounded-lg bg-background text-sm resize-none flex-1"
                            placeholder="Describe an achievement…"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 mt-2 text-destructive/60 hover:text-destructive"
                            onClick={() =>
                              updateData((prev) => {
                                const updated = [...(prev.experience || [])];
                                const bullets = updated[ei].bullets?.filter(
                                  (_, i) => i !== bi
                                );
                                updated[ei] = { ...updated[ei], bullets };
                                return { ...prev, experience: updated };
                              })
                            }
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 text-xs text-muted-foreground h-7"
                        onClick={() =>
                          updateData((prev) => {
                            const updated = [...(prev.experience || [])];
                            updated[ei] = {
                              ...updated[ei],
                              bullets: [...(updated[ei].bullets || []), ""],
                            };
                            return { ...prev, experience: updated };
                          })
                        }
                      >
                        <Plus className="w-3 h-3" />
                        Add bullet
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Education */}
            {activeSection === "education" && (
              <motion.div
                key="education"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    Education
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 rounded-lg text-xs h-7"
                    onClick={() =>
                      updateData((prev) => ({
                        ...prev,
                        education: [
                          ...(prev.education || []),
                          { degree: "", school: "", location: "", dates: "" },
                        ],
                      }))
                    }
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
                {(data.education || []).map((edu, ei) => (
                  <div
                    key={ei}
                    className="p-4 rounded-lg border border-border/30 bg-muted/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Education {ei + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            education: prev.education?.filter((_, i) => i !== ei),
                          }))
                        }
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        value={edu.degree || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.education || [])];
                            updated[ei] = { ...updated[ei], degree: e.target.value };
                            return { ...prev, education: updated };
                          })
                        }
                        placeholder="Degree (e.g. B.S. Computer Science)"
                        className="rounded-lg bg-background text-sm"
                      />
                      <Input
                        value={edu.school || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.education || [])];
                            updated[ei] = { ...updated[ei], school: e.target.value };
                            return { ...prev, education: updated };
                          })
                        }
                        placeholder="University"
                        className="rounded-lg bg-background text-sm"
                      />
                      <Input
                        value={edu.location || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.education || [])];
                            updated[ei] = { ...updated[ei], location: e.target.value };
                            return { ...prev, education: updated };
                          })
                        }
                        placeholder="Location"
                        className="rounded-lg bg-background text-sm"
                      />
                      <Input
                        value={edu.dates || ""}
                        onChange={(e) =>
                          updateData((prev) => {
                            const updated = [...(prev.education || [])];
                            updated[ei] = { ...updated[ei], dates: e.target.value };
                            return { ...prev, education: updated };
                          })
                        }
                        placeholder="Dates"
                        className="rounded-lg bg-background text-sm"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Skills */}
            {activeSection === "skills" && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-primary" />
                  Skills & Competencies
                </h2>
                <p className="text-xs text-muted-foreground">
                  Press Enter or comma to add a new skill. Click the × to remove.
                </p>
                <div className="flex flex-wrap gap-2">
                  {(data.skills || []).map((skill, si) => (
                    <span
                      key={si}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border border-border/40 rounded-lg text-xs font-medium text-foreground group"
                    >
                      {skill}
                      <button
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            skills: prev.skills?.filter((_, i) => i !== si),
                          }))
                        }
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Type a skill and press Enter…"
                  className="rounded-lg bg-muted/30 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        updateData((prev) => ({
                          ...prev,
                          skills: [...(prev.skills || []), val],
                        }));
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </motion.div>
            )}

            {/* Certifications */}
            {activeSection === "certifications" && (
              <motion.div
                key="certifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    Certifications
                  </h2>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 rounded-lg text-xs h-7"
                    onClick={() =>
                      updateData((prev) => ({
                        ...prev,
                        certifications: [...(prev.certifications || []), ""],
                      }))
                    }
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </Button>
                </div>
                {(data.certifications || []).map((cert, ci) => (
                  <div key={ci} className="flex gap-2 items-center">
                    <Input
                      value={cert}
                      onChange={(e) =>
                        updateData((prev) => {
                          const updated = [...(prev.certifications || [])];
                          updated[ci] = e.target.value;
                          return { ...prev, certifications: updated };
                        })
                      }
                      placeholder="Certification name"
                      className="rounded-lg bg-muted/30 text-sm flex-1"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive/60 hover:text-destructive"
                      onClick={() =>
                        updateData((prev) => ({
                          ...prev,
                          certifications: prev.certifications?.filter((_, i) => i !== ci),
                        }))
                      }
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-border/40 bg-muted/20 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 bg-card">
              <span className="text-xs font-medium text-muted-foreground">
                Live Preview
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
              </div>
            </div>
            <div className="overflow-y-auto overflow-x-hidden max-h-[75vh]">
              <div style={{ zoom: 0.48 }}>
                {resume.optimizationType === "creative" &&
                resume.templateId === "modern-split" ? (
                  <ModernSplitTemplate
                    content={data}
                    className="shadow-lg border border-border/50"
                  />
                ) : (
                  <AtsTemplate
                    content={data}
                    className="shadow-lg border border-border/50"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
