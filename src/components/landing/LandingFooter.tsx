import Link from "next/link";
import { Zap, Github } from "lucide-react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/40 py-16 relative z-10">
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
                <Zap className="w-4 h-4" fill="currentColor" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">JobFlow AI</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              The intelligent career operating system. Optimize your resume, automate your job search, and get personalized outreach strategies.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com/shahrozimran/JobFlow-AI" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
                <Github className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Resume Optimizer</Link></li>
              <li><Link href="/features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Outreach Hub</Link></li>
              <li><Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-6 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookies Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} JobFlow AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
