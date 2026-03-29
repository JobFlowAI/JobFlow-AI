import { createClient } from "@/lib/supabase/client";

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  url?: string;
}

export interface UserProfile {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  // Professional Summary
  summary: string;
  // Experience
  experience: WorkExperience[];
  // Education
  education: Education[];
  // Skills
  skills: string[];
  // Certifications
  certifications: Certification[];
  // Projects
  projects: Project[];
  // Metadata
  completedOnboarding: boolean;
  lastUpdated: string;
}

export const defaultProfile: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  linkedinUrl: "",
  portfolioUrl: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
  completedOnboarding: false,
  lastUpdated: new Date().toISOString(),
};

export async function getProfile(): Promise<UserProfile> {
  if (typeof window === "undefined") return defaultProfile;
  
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return defaultProfile;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) return defaultProfile;

    return {
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      linkedinUrl: data.linkedin_url || "",
      portfolioUrl: data.portfolio_url || "",
      summary: data.summary || "",
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      certifications: data.certifications || [],
      projects: data.projects || [],
      completedOnboarding: data.completed_onboarding || false,
      lastUpdated: data.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return defaultProfile;
  }
}

export async function saveProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const currentProfile = await getProfile();
    const newProfile = { ...currentProfile, ...profile };

    const dbPayload = {
      id: user.id,
      full_name: `${newProfile.firstName} ${newProfile.lastName}`.trim(),
      first_name: newProfile.firstName,
      last_name: newProfile.lastName,
      email: newProfile.email,
      phone: newProfile.phone,
      location: newProfile.location,
      linkedin_url: newProfile.linkedinUrl,
      portfolio_url: newProfile.portfolioUrl,
      summary: newProfile.summary,
      experience: newProfile.experience,
      education: newProfile.education,
      skills: newProfile.skills,
      certifications: newProfile.certifications,
      projects: newProfile.projects,
      completed_onboarding: newProfile.completedOnboarding,
      updated_at: new Date().toISOString(),
    };

    // Use upsert to handle both existing and missing profile rows
    const { error } = await supabase
      .from('profiles')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error("Supabase upsert error:", error);
      throw error;
    }
    
    return newProfile;
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
}

export async function isProfileComplete(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const p = await getProfile();
  return p.completedOnboarding;
}

export async function getProfileCompleteness(): Promise<number> {
  if (typeof window === "undefined") return 0;
  const p = await getProfile();
  let score = 0;
  const total = 8;

  if (p.firstName && p.lastName) score++;
  if (p.email) score++;
  if (p.phone || p.location) score++;
  if (p.summary && p.summary.length > 20) score++;
  if (p.experience.length > 0) score++;
  if (p.education.length > 0) score++;
  if (p.skills.length >= 3) score++;
  if (p.linkedinUrl || p.portfolioUrl) score++;

  return Math.round((score / total) * 100);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
