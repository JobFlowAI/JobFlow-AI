import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Log In | JobFlow AI',
  description: 'Log in to your JobFlow AI account to manage your resumes, profile, and job search.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
