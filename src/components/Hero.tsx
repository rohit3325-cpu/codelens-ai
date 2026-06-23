import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/40 to-slate-950" />

      <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-slate-400">
          ✨ AI-Powered Repository Analysis
        </div>

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
          Understand Any
          <span className="block bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            Codebase Instantly
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-400 sm:text-xl">
          AI-powered repository analysis, architecture diagrams, code
          summaries, onboarding guides and repository-aware chat.
        </p>
      </div>
    </section>
  );
}