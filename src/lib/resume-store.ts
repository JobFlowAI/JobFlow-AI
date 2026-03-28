// Resume data store — localStorage-based until backend integration

export interface GeneratedResume {
  id: string;
  targetRole: string;
  company: string;
  jobDescription: string;
  optimizationType: "ats" | "creative";
  atsScore: number | null;
  status: "draft" | "active" | "complete";
  templateId?: string;
  generatedContent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeStats {
  totalResumes: number;
  avgAtsScore: number;
  atsResumes: number;
  creativeResumes: number;
  activeResumes: number;
  completedResumes: number;
}

const RESUMES_KEY = "jobflow_resumes";

export function getResumes(): GeneratedResume[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(RESUMES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveResume(resume: GeneratedResume): GeneratedResume[] {
  const resumes = getResumes();
  const existingIndex = resumes.findIndex((r) => r.id === resume.id);

  if (existingIndex >= 0) {
    resumes[existingIndex] = { ...resume, updatedAt: new Date().toISOString() };
  } else {
    resumes.unshift(resume);
  }

  localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
  return resumes;
}

export function deleteResume(id: string): GeneratedResume[] {
  const resumes = getResumes().filter((r) => r.id !== id);
  localStorage.setItem(RESUMES_KEY, JSON.stringify(resumes));
  return resumes;
}

export function getResumeStats(): ResumeStats {
  const resumes = getResumes();
  const atsResumes = resumes.filter((r) => r.optimizationType === "ats");
  const atsScores = atsResumes
    .map((r) => r.atsScore)
    .filter((s): s is number => s !== null);

  return {
    totalResumes: resumes.length,
    avgAtsScore:
      atsScores.length > 0
        ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
        : 0,
    atsResumes: atsResumes.length,
    creativeResumes: resumes.filter((r) => r.optimizationType === "creative")
      .length,
    activeResumes: resumes.filter((r) => r.status === "active").length,
    completedResumes: resumes.filter((r) => r.status === "complete").length,
  };
}

export function generateResumeId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}
