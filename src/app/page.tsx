import RepoInput from "@/components/RepoInput";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import SocialProof from "@/components/SocialProof";
import HowItWorks from "@/components/HowItWorks";
import StackedFeatures from "@/components/StackedFeatures";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTAWaitlist from "@/components/CTAWaitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <Hero />

        <RepoInput />
        <Stats />
        <SocialProof />
        <HowItWorks />
      </main>

      <StackedFeatures />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTAWaitlist />
        <Footer />
      </div>
    </div>
  );
}
