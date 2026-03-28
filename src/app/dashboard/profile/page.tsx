"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  FolderOpen,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Globe,
  Link2,
  MapPin,
  Mail,
  Phone,
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
  type WorkExperience,
  type Education,
  type Certification,
  type Project,
} from "@/lib/profile-store";

function SectionCard({
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border/40 bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-border/30">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handleSave = () => {
    saveProfile(profile);
    toast.success("Profile saved successfully");
  };

  const updateField = (field: keyof UserProfile, value: unknown) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const addExperience = () => {
    const newExp: WorkExperience = {
      id: generateId(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    };
    updateField("experience", [...profile.experience, newExp]);
  };

  const removeExperience = (id: string) => {
    updateField("experience", profile.experience.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: unknown) => {
    updateField(
      "experience",
      profile.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
    };
    updateField("education", [...profile.education, newEdu]);
  };

  const removeEducation = (id: string) => {
    updateField("education", profile.education.filter((e) => e.id !== id));
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      updateField("skills", [...profile.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    updateField("skills", profile.skills.filter((s) => s !== skill));
  };

  const addProject = () => {
    const newProj: Project = {
      id: generateId(),
      title: "",
      description: "",
      techStack: [],
      url: "",
    };
    updateField("projects", [...profile.projects, newProj]);
  };

  const removeProject = (id: string) => {
    updateField("projects", profile.projects.filter((p) => p.id !== id));
  };

  const addCertification = () => {
    const newCert: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
    };
    updateField("certifications", [...profile.certifications, newCert]);
  };

  const removeCertification = (id: string) => {
    updateField("certifications", profile.certifications.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Master Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            This data powers all your generated resumes.
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2 rounded-xl shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      {/* Personal Info */}
      <SectionCard title="Personal Information" icon={User} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              First Name
            </label>
            <div className="relative">
              <Input
                value={profile.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="John"
                className="rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Last Name
            </label>
            <Input
              value={profile.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Doe"
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3 h-3" /> Email
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
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> Phone
            </label>
            <Input
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Location
            </label>
            <Input
              value={profile.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Link2 className="w-3 h-3" /> LinkedIn URL
            </label>
            <Input
              value={profile.linkedinUrl}
              onChange={(e) => updateField("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
              className="rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> Portfolio URL
            </label>
            <Input
              value={profile.portfolioUrl}
              onChange={(e) => updateField("portfolioUrl", e.target.value)}
              placeholder="https://johndoe.dev"
              className="rounded-lg"
            />
          </div>
        </div>
      </SectionCard>

      {/* Professional Summary */}
      <SectionCard title="Professional Summary" icon={User} defaultOpen={true}>
        <div className="mt-3">
          <Textarea
            value={profile.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Write a compelling professional summary that highlights your key strengths, years of experience, and career focus..."
            className="min-h-[120px] rounded-lg resize-none leading-relaxed"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {profile.summary.length} characters
          </p>
        </div>
      </SectionCard>

      {/* Work Experience */}
      <SectionCard title="Work Experience" icon={Briefcase}>
        <div className="space-y-4 mt-3">
          {profile.experience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-lg border border-border/30 bg-muted/10 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <Input
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(exp.id, "title", e.target.value)
                    }
                    placeholder="Job Title"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    placeholder="Company"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "startDate", e.target.value)
                    }
                    placeholder="Start Date (e.g. Jan 2023)"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, "endDate", e.target.value)
                    }
                    placeholder="End Date (or Present)"
                    className="rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-3 shrink-0"
                  aria-label="Remove experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Textarea
                value={exp.bullets.join("\n")}
                onChange={(e) =>
                  updateExperience(
                    exp.id,
                    "bullets",
                    e.target.value.split("\n")
                  )
                }
                placeholder="Bullet points (one per line)&#10;• Led migration improving performance by 40%&#10;• Managed team of 5 engineers"
                className="min-h-[80px] rounded-lg text-sm resize-none"
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addExperience}
            className="gap-2 rounded-lg text-xs w-full border-dashed"
          >
            <Plus className="w-3 h-3" /> Add Experience
          </Button>
        </div>
      </SectionCard>

      {/* Education */}
      <SectionCard title="Education" icon={GraduationCap}>
        <div className="space-y-4 mt-3">
          {profile.education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-lg border border-border/30 bg-muted/10 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
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
                    placeholder="Degree (e.g. B.S. Computer Science)"
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
                  <Input
                    value={edu.startDate}
                    onChange={(e) =>
                      updateField(
                        "education",
                        profile.education.map((ed) =>
                          ed.id === edu.id
                            ? { ...ed, startDate: e.target.value }
                            : ed
                        )
                      )
                    }
                    placeholder="Start Year"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={edu.endDate}
                    onChange={(e) =>
                      updateField(
                        "education",
                        profile.education.map((ed) =>
                          ed.id === edu.id
                            ? { ...ed, endDate: e.target.value }
                            : ed
                        )
                      )
                    }
                    placeholder="End Year"
                    className="rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-3 shrink-0"
                  aria-label="Remove education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addEducation}
            className="gap-2 rounded-lg text-xs w-full border-dashed"
          >
            <Plus className="w-3 h-3" /> Add Education
          </Button>
        </div>
      </SectionCard>

      {/* Skills */}
      <SectionCard title="Skills" icon={Code}>
        <div className="mt-3">
          <div className="flex gap-2 mb-3">
            <Input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Type a skill and press Enter"
              className="rounded-lg text-sm"
            />
            <Button
              variant="outline"
              onClick={addSkill}
              className="rounded-lg shrink-0"
              size="sm"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="gap-1.5 py-1.5 px-3 rounded-lg cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                onClick={() => removeSkill(skill)}
              >
                {skill}
                <span className="text-xs opacity-50">×</span>
              </Badge>
            ))}
            {profile.skills.length === 0 && (
              <p className="text-xs text-muted-foreground">
                No skills added yet. Start typing above.
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Projects */}
      <SectionCard title="Projects" icon={FolderOpen}>
        <div className="space-y-4 mt-3">
          {profile.projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-lg border border-border/30 bg-muted/10 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <Input
                    value={proj.title}
                    onChange={(e) =>
                      updateField(
                        "projects",
                        profile.projects.map((p) =>
                          p.id === proj.id
                            ? { ...p, title: e.target.value }
                            : p
                        )
                      )
                    }
                    placeholder="Project Title"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={proj.url || ""}
                    onChange={(e) =>
                      updateField(
                        "projects",
                        profile.projects.map((p) =>
                          p.id === proj.id ? { ...p, url: e.target.value } : p
                        )
                      )
                    }
                    placeholder="Project URL"
                    className="rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => removeProject(proj.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-3 shrink-0"
                  aria-label="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Textarea
                value={proj.description}
                onChange={(e) =>
                  updateField(
                    "projects",
                    profile.projects.map((p) =>
                      p.id === proj.id
                        ? { ...p, description: e.target.value }
                        : p
                    )
                  )
                }
                placeholder="Brief project description"
                className="min-h-[60px] rounded-lg text-sm resize-none"
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addProject}
            className="gap-2 rounded-lg text-xs w-full border-dashed"
          >
            <Plus className="w-3 h-3" /> Add Project
          </Button>
        </div>
      </SectionCard>

      {/* Certifications */}
      <SectionCard title="Certifications" icon={Award}>
        <div className="space-y-4 mt-3">
          {profile.certifications.map((cert) => (
            <div
              key={cert.id}
              className="rounded-lg border border-border/30 bg-muted/10 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                  <Input
                    value={cert.name}
                    onChange={(e) =>
                      updateField(
                        "certifications",
                        profile.certifications.map((c) =>
                          c.id === cert.id
                            ? { ...c, name: e.target.value }
                            : c
                        )
                      )
                    }
                    placeholder="Certification Name"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={cert.issuer}
                    onChange={(e) =>
                      updateField(
                        "certifications",
                        profile.certifications.map((c) =>
                          c.id === cert.id
                            ? { ...c, issuer: e.target.value }
                            : c
                        )
                      )
                    }
                    placeholder="Issuer"
                    className="rounded-lg text-sm"
                  />
                  <Input
                    value={cert.date}
                    onChange={(e) =>
                      updateField(
                        "certifications",
                        profile.certifications.map((c) =>
                          c.id === cert.id
                            ? { ...c, date: e.target.value }
                            : c
                        )
                      )
                    }
                    placeholder="Date"
                    className="rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => removeCertification(cert.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-3 shrink-0"
                  aria-label="Remove certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addCertification}
            className="gap-2 rounded-lg text-xs w-full border-dashed"
          >
            <Plus className="w-3 h-3" /> Add Certification
          </Button>
        </div>
      </SectionCard>

      {/* Bottom Save */}
      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} className="gap-2 rounded-xl shadow-sm px-8">
          <Save className="w-4 h-4" /> Save All Changes
        </Button>
      </div>
    </div>
  );
}
