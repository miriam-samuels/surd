import { BenefitsSection } from "@/components/sections/landing/benefits-section";
import { CalculatorSection } from "@/components/sections/landing/calculator-section";
import { FaqSection } from "@/components/sections/landing/faq-section";
import { GoalsMarquee } from "@/components/sections/landing/goals-marquee";
import { HeroSection } from "@/components/sections/landing/hero-section";
import { ProductsSection } from "@/components/sections/landing/products-section";
import { TestimonialsSection } from "@/components/sections/landing/testimonials-section";
import { WhySurdSection } from "@/components/sections/landing/why-surd-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <WhySurdSection />
      <BenefitsSection />
      <GoalsMarquee />
      <CalculatorSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
