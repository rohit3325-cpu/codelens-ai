import Image from "next/image";
import { IconGithub } from "@/components/icons";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      "Repository Analyzer",
      "AI Overview",
      "Architecture Diagrams",
      "Repository Chat",
    ],
  },
  {
    title: "Resources",
    links: ["Documentation", "Changelog", "Support"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Contact"],
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-neutral-800 pt-14 pb-8">

      {/* Grid Background */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
          pointer-events-none
          bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* Glow */}

      <div
        className="
          absolute
          left-1/2
          top-0
          -translate-x-1/2
          h-[250px]
          w-[500px]
          bg-red-600/5
          blur-[100px]
          animate-pulse
          pointer-events-none
        "
      />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* CTA */}

        <div className="text-center mb-16">

          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Understand Any Repository?
          </h2>

          <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
            Analyze GitHub repositories with AI-powered
            insights, architecture diagrams and repository chat.
          </p>

          <a
  href="#analyze-section"
  className="
    inline-block
    mt-6
    px-6
    py-3
    rounded-xl
    bg-red-600
    hover:bg-red-500
    transition-all
    duration-300
    font-medium
    shadow-lg
    shadow-red-500/20
  "
>
  Start Analyzing
</a>

        </div>

        {/* Main Footer */}

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <Image
                src="/logo6.png"
                alt="TraceLens AI"
                width={80}
                height={80}
                className="h-16 w-16"
              />

              <div>
                <h2 className="text-2xl font-bold">
                  TraceLens{" "}
                  <span className="text-red-500">
                    AI
                  </span>
                </h2>

                <p className="text-xs text-neutral-500 mt-1">
                  Understand any codebase instantly
                </p>
              </div>

            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
              AI-powered repository analysis,
              architecture diagrams, code summaries,
              onboarding guides and repository-aware chat.
            </p>

            <a
              href="https://github.com/rohit3325-cpu/codelens-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                text-sm
                text-neutral-400
                transition-all
                duration-300
                hover:text-red-400
              "
            >
              <IconGithub className="h-4 w-4" />
              GitHub
            </a>

            <div className="mt-6 flex flex-wrap gap-2">

              {[
                "Next.js",
                "TypeScript",
                "OpenRouter",
                "Mermaid",
              ].map((tech) => (
                <span
                  key={tech}
                  className="
                    rounded-full
                    border
                    border-neutral-700
                    px-3
                    py-1
                    text-xs
                    text-neutral-400
                  "
                >
                  {tech}
                </span>
              ))}

            </div>

          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>

              <h4 className="text-sm font-semibold text-white">
                {column.title}
              </h4>

              <ul className="mt-4 space-y-3">

                {column.links.map((link) => (
                  <li key={link}>
                    <button
                      className="
                        text-sm
                        text-neutral-400
                        transition-all
                        duration-300
                        hover:text-red-400
                        hover:translate-x-1
                      "
                    >
                      {link}
                    </button>
                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>

        {/* Watermark */}

        <div className="mt-12 mb-8 overflow-hidden">

          <h2
            className="
              text-center
              text-5xl
              md:text-6xl
              lg:text-7xl
              font-black
              tracking-tight
              text-white/[0.02]
              select-none
            "
          >
            TRACELENS AI
          </h2>

        </div>

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">

          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} TraceLens AI.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-neutral-500">

            <button className="hover:text-red-400 transition-all">
              Privacy
            </button>

            <button className="hover:text-red-400 transition-all">
              Terms
            </button>

          </div>

        </div>

      </div>

      {/* Small Wave */}

      <div
        className="
          absolute
          bottom-0
          left-0
          w-full
          h-[80px]
          overflow-hidden
          opacity-10
          pointer-events-none
        "
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            fill="#dc2626"
            d="
              M0,60
              C240,20
              480,20
              720,60
              C960,100
              1200,100
              1440,60
              L1440,120
              L0,120
              Z
            "
          />
        </svg>
      </div>

    </footer>
  );
}