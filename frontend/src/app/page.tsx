import { BackgroundGlow } from "@/components/background-glow";
import { BentoSection } from "@/components/bento-section";
import { HeroSection } from "@/components/hero-section";
import { MarketplaceSection } from "@/components/marketplace-section";
import { MonitoringSection } from "@/components/monitoring-section";
import { PricingSection } from "@/components/pricing-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar";
import { ScrollAnimationProvider } from "@/components/scroll-animation-provider";

export default function Home() {
  return (
    <ScrollAnimationProvider>
      <div className="font-geist relative min-h-screen bg-slate-50 text-slate-900">
        <NavBar />
        <main className="pt-16">
          <HeroSection />
          <div className="relative z-0 -mt-8">
            <BackgroundGlow
              className="absolute inset-0 -z-10"
              videoSrc="/background.mp4"
            />
            <div className="relative z-10 pt-8">
              <BentoSection />
              <MarketplaceSection />
              <MonitoringSection />
              <PricingSection />
              <TestimonialsSection />
              <FaqSection />
              <CtaSection />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ScrollAnimationProvider>
  );
}
