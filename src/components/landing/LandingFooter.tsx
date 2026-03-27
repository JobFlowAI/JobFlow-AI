import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border py-12 bg-card">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">JobFlow AI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              AI-powered job acquisition platform that optimizes resumes, matches jobs, and automates outreach.
            </p>
            <p className="text-sm font-medium text-foreground">
              Contact: <a href="mailto:aifunk63@gmail.com" className="text-primary hover:underline">aifunk63@gmail.com</a>
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Product</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate("/features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button></li>
              <li><a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><button onClick={() => navigate("/dashboard")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate("/about")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</button></li>
              <li><button onClick={() => navigate("/careers")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Careers</button></li>
              <li><button onClick={() => navigate("/blog")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate("/privacy")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigate("/terms")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigate("/cookies")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 JobFlow AI. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Twitter</button>
            <button className="hover:text-foreground transition-colors">LinkedIn</button>
            <button className="hover:text-foreground transition-colors">GitHub</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
