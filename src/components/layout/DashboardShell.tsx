"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import { isProfileComplete } from "@/lib/profile-store";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnboarding = pathname === "/dashboard/onboarding";
  const [checked, setChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function checkProfile() {
      // Check if profile onboarding is completed
      const isComplete = await isProfileComplete();
      if (!isOnboarding && !isComplete) {
        router.replace("/dashboard/onboarding");
      } else {
        setChecked(true);
      }
    }
    checkProfile();
  }, [isOnboarding, router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-background overflow-hidden flex flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden flex">
      <AppSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 h-screen overflow-hidden",
          collapsed ? "ml-[72px]" : "ml-[252px]"
        )}
      >
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
