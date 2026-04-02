import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up | JobFlow AI',
  description: 'Create your JobFlow AI account to build ATS-optimized resumes and accelerate your job search.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
