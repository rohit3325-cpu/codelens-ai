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
    <footer className="border-t border-neutral-800 pt-16 pb-8">
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <Image
              src="/logo1.png"
              alt="CodeLens AI"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-lg font-bold">CodeLens AI</span>
          </div>

          <p className="mt-4 max-w-xs text-sm text-neutral-400">
            AI-powered repository analysis, architecture diagrams, code
            summaries and repository-aware chat — understand any codebase,
            instantly.
          </p>

          <a
            href="https://github.com/rohit3325-cpu/codelens-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
          >
            <IconGithub className="h-4 w-4" />
            GitHub
          </a>
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
                    type="button"
                    className="text-sm text-neutral-400 transition hover:text-white"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
        <p className="text-xs text-neutral-500">
          © {new Date().getFullYear()} CodeLens AI. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-xs text-neutral-500">
          <button type="button" className="transition hover:text-white">
            Privacy
          </button>
          <button type="button" className="transition hover:text-white">
            Terms
          </button>
        </div>
      </div>
    </footer>
  );
}
