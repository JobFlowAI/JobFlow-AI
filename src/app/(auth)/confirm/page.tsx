import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 text-center">
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm border border-primary/20">
          <MailCheck className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Check your email
        </h1>
        
        <p className="text-base text-muted-foreground mb-8 px-4">
          We've sent you a confirmation link. Please check your inbox and click the link to verify your account and continue to the dashboard.
        </p>

        <div className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-8 max-w-sm mx-auto">
          <Link href="/login" className="w-full block">
            <Button className="w-full h-11 rounded-xl font-medium shadow-md transition-all">
              Return to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
