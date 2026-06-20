export default function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">
     <div
    className="
      absolute
      top-[-200px]
      left-1/2
      -translate-x-1/2
      w-[700px]
      h-[700px]
      bg-violet-600/20
      blur-[180px]
      rounded-full
      pointer-events-none
    "
  />
  <div className="relative z-10 max-w-5xl mx-auto text-center">
      <div className="max-w-5xl mx-auto text-center">
        <div
  className="
    inline-flex
    items-center
    gap-2
    px-4
    py-2
    rounded-full
    bg-zinc-900
    border
    border-zinc-800
    text-zinc-400
    mb-8
  "
>
  ✨ AI-Powered Repository Analysis
</div>
        <h1
          className="
          text-4xl
          sm:text-5xl
          lg:text-7xl
          font-bold
          leading-tight
        "
        >
          Understand Any

          <span
            className="
            block
            text-transparent
            bg-clip-text
            bg-gradient-to-r
            from-violet-500
            to-fuchsia-500
          "
          >
            Codebase Instantly
          </span>

        </h1>

        <p
          className="
          mt-8
          text-zinc-400
          text-lg
          sm:text-xl
          max-w-3xl
          mx-auto
        "
        >
          AI-powered repository analysis,
          architecture diagrams,
          code summaries,
          onboarding guides
          and repository-aware chat.
        </p>

      </div>
   </div>
    </section>
  );
}