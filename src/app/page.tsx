import RepoForm from "@/components/RepoForm";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
    
      <Navbar />
    
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <Hero />
    
        <RepoForm />
        <Stats/>
        <Features/>
      </main>
    
    </div>    
  );
}