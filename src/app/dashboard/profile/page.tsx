"use client";

import { useState, useEffect, useRef } from "react";
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
  Camera,
  Loader2,
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
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [userName, setUserName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    getProfile().then(p => setProfile(p));
    loadAvatar();
  }, []);

  async function loadAvatar() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserName(user.user_metadata?.full_name || user.email || "");

    // Try to get avatar from profiles table
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (data?.avatar_url) {
      setAvatarUrl(data.avatar_url);
    } else if (user.user_metadata?.avatar_url) {
      // Fallback to Google avatar or auth metadata
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB.');
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl + '?t=' + Date.now(); // Cache bust

      // Save to profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: publicUrl, updated_at: new Date().toISOString() });

      if (dbError) throw dbError;

      // Also update auth metadata
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      setAvatarUrl(publicUrl);
      toast.success('Profile picture updated!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      toast.error(message);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const handleSave = () => {
    if (!profile) return;
    saveProfile(profile);
    toast.success("Profile saved successfully");
  };

  const updateField = (field: keyof UserProfile, value: unknown) => {
    if (profile) {
      setProfile({ ...profile, [field]: value });
    }
  };

  const addExperience = () => {
    if (!profile) return;
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
    if (!profile) return;
    updateField("experience", profile.experience.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof WorkExperience, value: unknown) => {
    if (!profile) return;
    updateField(
      "experience",
      profile.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const addEducation = () => {
    if (!profile) return;
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
    if (!profile) return;
    updateField("education", profile.education.filter((e) => e.id !== id));
  };

  const addSkill = () => {
    if (profile && skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      updateField("skills", [...profile.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    updateField("skills", profile.skills.filter((s) => s !== skill));
  };

  const addProject = () => {
    if (!profile) return;
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
    if (!profile) return;
    updateField("projects", profile.projects.filter((p) => p.id !== id));
  };

  const addCertification = () => {
    if (!profile) return;
    const newCert: Certification = {
      id: generateId(),
      name: "",
      issuer: "",
      date: "",
    };
    updateField("certifications", [...profile.certifications, newCert]);
  };

  const removeCertification = (id: string) => {
    if (!profile) return;
    updateField("certifications", profile.certifications.filter((c) => c.id !== id));
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center -mt-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-5 animate-in fade-in duration-500">
      {/* Header with Avatar */}
      <div className="flex items-center gap-6">
        {/* Avatar Upload */}
        <div className="relative group">
          <Avatar className="w-20 h-20 border-2 border-border/50">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xl font-semibold">
              {userName ? userName.slice(0, 2).toUpperCase() : "US"}
            </AvatarFallback>
          </Avatar>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/40 flex items-center justify-center transition-all cursor-pointer"
          >
            {isUploadingAvatar ? (
              <Loader2 className="w-5 h-5 text-background animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>

        <div className="flex-1">
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
