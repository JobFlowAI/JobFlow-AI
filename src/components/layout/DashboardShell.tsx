"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import { isProfileComplete } from "@/lib/profile-store";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isOnboarding = pathname === "/dashboard/onboarding";
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check if profile onboarding is completed
    if (!isOnboarding && !isProfileComplete()) {
      router.replace("/dashboard/onboarding");
    }
    setChecked(true);
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
      <AppSidebar />
      <div className="flex-1 flex flex-col ml-[252px] transition-all duration-300 h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
