import RepoInput from "@/components/RepoInput";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import StackedFeatures from "@/components/StackedFeatures";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <Hero />

        <RepoInput />
        <Stats />
      </main>

      <StackedFeatures />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
