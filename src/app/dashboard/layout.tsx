import DashboardShell from "@/components/layout/DashboardShell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Dashboard | JobFlow AI',
  description: 'Overview of your job search progress, active resumes, and ATS scores.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}
