import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  duration: string;
  grade: string;
};

export type ProfileData = {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    dob: string;
    country: string;
    currentAddress: string;
    permanentAddress: string;
    summary: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: string[];
};

const defaultProfile: ProfileData = {
  personal: { 
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "", 
    location: "", 
    dob: "",
    country: "",
    currentAddress: "",
    permanentAddress: "",
    summary: "",
    linkedin: "",
    github: "",
    portfolio: ""
  },
  experience: [],
  education: [],
  skills: [],
};

type ProfileContextType = {
  profile: ProfileData;
  setProfile: (profile: ProfileData | ((prev: ProfileData) => ProfileData)) => void;
  isHydrated: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<ProfileData>(defaultProfile);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    try {
      const stored = localStorage.getItem("jobflow_master_profile");
      if (stored) {
        setProfileState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load profile from local storage:", e);
    }
    setIsHydrated(true);
  }, []);

  const setProfile = (newProfileOrUpdater: ProfileData | ((prev: ProfileData) => ProfileData)) => {
    setProfileState((prev) => {
      const updated = typeof newProfileOrUpdater === "function" ? newProfileOrUpdater(prev) : newProfileOrUpdater;
      try {
        localStorage.setItem("jobflow_master_profile", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save profile to local storage:", e);
      }
      return updated;
    });
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isHydrated }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
