// Profile data store — localStorage-based until backend integration

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

const PROFILE_KEY = "jobflow_user_profile";

const defaultProfile: UserProfile = {
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

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return defaultProfile;
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(stored) };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: Partial<UserProfile>): UserProfile {
  const current = getProfile();
  const updated = {
    ...current,
    ...profile,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}

export function isProfileComplete(): boolean {
  const p = getProfile();
  return p.completedOnboarding;
}

export function getProfileCompleteness(): number {
  const p = getProfile();
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
