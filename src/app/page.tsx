import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import LogoCloud from "@/components/landing/LogoCloud";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import StatsSection from "@/components/landing/StatsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTABanner from "@/components/landing/CTABanner";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <LandingNav />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full">
          <HeroSection />
          <LogoCloud />
          <FeaturesGrid />
          <HowItWorks />
          <TestimonialsSection />
          <StatsSection />
          <PricingSection />
          <FAQSection />
          <CTABanner />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
