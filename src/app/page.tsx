import RepoInput from "@/components/RepoInput";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Hero />

        <RepoInput />
        <Stats />
        <Features />
      </main>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
