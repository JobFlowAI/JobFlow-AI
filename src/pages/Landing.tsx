import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolutionCards from "@/components/landing/ProblemSolutionCards";
import PricingSection from "@/components/landing/PricingSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <ProblemSolutionCards />
      <PricingSection />
      <LandingFooter />
    </div>
  );
}
