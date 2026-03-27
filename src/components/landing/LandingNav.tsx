import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "../ThemeToggle";

export default function LandingNav() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">JobFlow AI</span>
        </button>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => navigate("/features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button>
          <a href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <button onClick={() => navigate("/about")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</button>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => navigate("/dashboard")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log In
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
