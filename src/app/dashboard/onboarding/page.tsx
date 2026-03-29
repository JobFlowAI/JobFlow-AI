"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Sparkles,
  CheckCircle2,
  Zap,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  getProfile,
  saveProfile,
  generateId,
  type UserProfile,
} from "@/lib/profile-store";

const steps = [
  { id: "welcome", label: "Welcome", icon: Sparkles },
  { id: "personal", label: "Personal Info", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "complete", label: "Complete", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfile().then(p => setProfile(p));
  }, []);

  const updateField = (field: keyof UserProfile, value: unknown) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case "personal":
        return profile && profile.firstName.trim() !== "" && profile.lastName.trim() !== "";
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1 && profile) {
      setIsSaving(true);
      try {
        await saveProfile(profile);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        console.error("Onboarding save error:", error);
        toast.error("Failed to save profile. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleComplete = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await saveProfile({ ...profile, completedOnboarding: true });
      toast.success("Profile setup complete!");
      router.replace("/dashboard");
    } catch {
      toast.error("Failed to save final profile.");
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await saveProfile({ ...profile, completedOnboarding: true });
      router.replace("/dashboard");
    } catch {
      toast.error("Failed to skip onboarding.");
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (profile && skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      updateField("skills", [...profile.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-foreground">
                JobFlow AI
              </span>
            </div>
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <button
                onClick={handleSkip}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <SkipForward className="w-3 h-3" /> Skip for now
              </button>
            )}
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`text-[10px] font-medium transition-colors ${
                  i <= currentStep
                    ? "text-primary"
                    : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </div>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-border/40 bg-card p-8 md:p-10 min-h-[400px] flex flex-col shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {/* Welcome */}
              {steps[currentStep].id === "welcome" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
                    Let&apos;s set up your profile
                  </h2>
                  <p className="text-muted-foreground max-w-md leading-relaxed mb-2">
                    We&apos;ll use this information to generate tailored,
                    ATS-optimized resumes for every job you apply to. This takes
                    about 3 minutes.
                  </p>
                </div>
              )}

              {/* Personal Info */}
              {steps[currentStep].id === "personal" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Personal Information
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    The basics for your resume header.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        First Name *
                      </label>
                      <Input
                        value={profile.firstName}
                        onChange={(e) =>
                          updateField("firstName", e.target.value)
                        }
                        placeholder="John"
                        className="rounded-lg"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Last Name *
                      </label>
                      <Input
                        value={profile.lastName}
                        onChange={(e) =>
                          updateField("lastName", e.target.value)
                        }
                        placeholder="Doe"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="john@example.com"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Phone
                      </label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Location
                      </label>
                      <Input
                        value={profile.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
                        placeholder="San Francisco, CA"
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        LinkedIn URL
                      </label>
                      <Input
                        value={profile.linkedinUrl}
                        onChange={(e) =>
                          updateField("linkedinUrl", e.target.value)
                        }
                        placeholder="linkedin.com/in/johndoe"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Experience */}
              {steps[currentStep].id === "experience" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Work Experience
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add your most recent positions. You can add more later.
                  </p>
                  <div className="space-y-4">
                    {profile.experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="rounded-lg border border-border/30 bg-muted/10 p-4 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={exp.title}
                            onChange={(e) =>
                              updateField(
                                "experience",
                                profile.experience.map((ex) =>
                                  ex.id === exp.id
                                    ? { ...ex, title: e.target.value }
                                    : ex
                                )
                              )
                            }
                            placeholder="Job Title"
                            className="rounded-lg text-sm"
                          />
                          <Input
                            value={exp.company}
                            onChange={(e) =>
                              updateField(
                                "experience",
                                profile.experience.map((ex) =>
                                  ex.id === exp.id
                                    ? { ...ex, company: e.target.value }
                                    : ex
                                )
                              )
                            }
                            placeholder="Company"
                            className="rounded-lg text-sm"
                          />
                        </div>
                        <Textarea
                          value={exp.bullets.join("\n")}
                          onChange={(e) =>
                            updateField(
                              "experience",
                              profile.experience.map((ex) =>
                                ex.id === exp.id
                                  ? {
                                      ...ex,
                                      bullets: e.target.value.split("\n"),
                                    }
                                  : ex
                              )
                            )
                          }
                          placeholder="Key achievements (one per line)"
                          className="min-h-[60px] rounded-lg text-sm resize-none"
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateField("experience", [
                          ...profile.experience,
                          {
                            id: generateId(),
                            title: "",
                            company: "",
                            location: "",
                            startDate: "",
                            endDate: "",
                            current: false,
                            bullets: [""],
                          },
                        ])
                      }
                      className="gap-2 rounded-lg text-xs w-full border-dashed"
                    >
                      <Briefcase className="w-3 h-3" /> Add Position
                    </Button>
                  </div>
                </div>
              )}

              {/* Education */}
              {steps[currentStep].id === "education" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Education
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add your educational background.
                  </p>
                  <div className="space-y-4">
                    {profile.education.map((edu) => (
                      <div
                        key={edu.id}
                        className="rounded-lg border border-border/30 bg-muted/10 p-4"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={edu.degree}
                            onChange={(e) =>
                              updateField(
                                "education",
                                profile.education.map((ed) =>
                                  ed.id === edu.id
                                    ? { ...ed, degree: e.target.value }
                                    : ed
                                )
                              )
                            }
                            placeholder="Degree"
                            className="rounded-lg text-sm"
                          />
                          <Input
                            value={edu.institution}
                            onChange={(e) =>
                              updateField(
                                "education",
                                profile.education.map((ed) =>
                                  ed.id === edu.id
                                    ? { ...ed, institution: e.target.value }
                                    : ed
                                )
                              )
                            }
                            placeholder="Institution"
                            className="rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        updateField("education", [
                          ...profile.education,
                          {
                            id: generateId(),
                            degree: "",
                            institution: "",
                            location: "",
                            startDate: "",
                            endDate: "",
                          },
                        ])
                      }
                      className="gap-2 rounded-lg text-xs w-full border-dashed"
                    >
                      <GraduationCap className="w-3 h-3" /> Add Education
                    </Button>
                  </div>
                </div>
              )}

              {/* Skills */}
              {steps[currentStep].id === "skills" && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Skills
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Add your technical and soft skills.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      placeholder="Type a skill and press Enter"
                      className="rounded-lg"
                      autoFocus
                    />
                    <Button
                      variant="outline"
                      onClick={addSkill}
                      className="rounded-lg shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                        onClick={() =>
                          updateField(
                            "skills",
                            profile.skills.filter((s) => s !== skill)
                          )
                        }
                      >
                        {skill} <span className="opacity-50">×</span>
                      </Badge>
                    ))}
                  </div>
                  {profile.skills.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Try: React, TypeScript, Node.js, Python, AWS, Leadership
                    </p>
                  )}
                </div>
              )}

              {/* Complete */}
              {steps[currentStep].id === "complete" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-success" />
                  </motion.div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                    You&apos;re all set!
                  </h2>
                  <p className="text-muted-foreground max-w-md mb-8">
                    Your profile is ready. You can always update it later from
                    the Profile page. Now let&apos;s create your first AI-optimized
                    resume.
                  </p>
                  <Button
                    onClick={handleComplete}
                    className="gap-2 rounded-xl shadow-md px-8 py-3"
                    size="lg"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {steps[currentStep].id !== "complete" && (
            <div className="flex items-center justify-between pt-6 mt-auto border-t border-border/30">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isSaving}
                className="gap-2 rounded-xl shadow-sm"
              >
                {isSaving ? "Saving..." : (currentStep === steps.length - 2 ? "Finish" : "Continue")}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
