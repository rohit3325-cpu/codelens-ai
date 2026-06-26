import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  IconArchitecture,
  IconChat,
  IconFiles,
  IconOverview,
  IconSearch,
  IconSettings,
  IconWorkspace,
} from "@/components/icons";

const TOC = [
  { href: "#getting-started", label: "Getting Started" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#byok", label: "Bring Your Own AI Key" },
  { href: "#faq", label: "FAQ" },
];

const FEATURES = [
  {
    title: "Repository Analyzer",
    description: "Paste any public GitHub URL and get a full structural scan in seconds.",
    icon: IconSearch,
  },
  {
    title: "AI-Generated Overview",
    description: "Project type, tech stack, core workflow and a repository health score.",
    icon: IconOverview,
  },
  {
    title: "File Explorer & AI Summaries",
    description: "Browse the real source tree and get an instant AI explanation of any file.",
    icon: IconFiles,
  },
  {
    title: "Architecture Diagrams",
    description: "Auto-generated diagrams that map how the codebase actually fits together.",
    icon: IconArchitecture,
  },
  {
    title: "Repository Chat",
    description: "Ask questions in plain English, answered using the actual code.",
    icon: IconChat,
  },
  {
    title: "Persistent Workspace",
    description: "Every repository you analyze is saved — pick up exactly where you left off.",
    icon: IconWorkspace,
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
          <aside className="hidden lg:block">
            <nav className="sticky top-24 space-y-1">
              {TOC.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <div className="max-w-3xl space-y-16">
            <div>
              <h1 className="text-4xl font-bold">Documentation</h1>
              <p className="mt-3 text-neutral-400">
                Everything you need to know to get the most out of TraceLens AI.
              </p>
            </div>

            <section id="getting-started">
              <h2 className="text-2xl font-bold">Getting Started</h2>
              <ol className="mt-4 space-y-3 text-neutral-300">
                <li className="flex gap-3">
                  <span className="font-semibold text-red-400">1.</span>
                  Sign in with the button in the top right — TraceLens AI uses Clerk, so
                  there&apos;s no separate account to create.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-red-400">2.</span>
                  Paste any public GitHub repository URL into the analyze box on the
                  homepage and click <span className="text-white">Analyze</span>.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-red-400">3.</span>
                  You&apos;ll land in that repository&apos;s workspace — Overview, Files,
                  Architecture and Chat are ready as soon as analysis finishes.
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-red-400">4.</span>
                  Every repository you analyze is saved automatically. Find it again
                  anytime under{" "}
                  <span className="text-white">Dashboard → Repositories</span>.
                </li>
              </ol>
            </section>

            <section id="how-it-works">
              <h2 className="text-2xl font-bold">How It Works</h2>
              <p className="mt-4 text-neutral-300">
                TraceLens AI fetches your repository&apos;s file tree and contents
                directly from the GitHub API — there&apos;s no cloning and nothing is
                written to disk. The most relevant files are sent to an AI model to
                generate an overview, an architecture diagram, and answers to your
                questions, grounded in the real source code rather than the README.
              </p>
            </section>

            <section id="features">
              <h2 className="text-2xl font-bold">Features</h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FEATURES.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
                    >
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="mt-1 text-sm text-neutral-400">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="byok">
              <h2 className="text-2xl font-bold">Bring Your Own AI Key</h2>
              <p className="mt-4 text-neutral-300">
                By default, every generation uses TraceLens AI&apos;s platform key. If
                you&apos;d rather use your own OpenAI, Gemini, Claude or OpenRouter key
                — for higher rate limits, a specific model, or your own billing — add
                it under{" "}
                <span className="text-white">Dashboard → Settings → AI Providers</span>.
                Once connected, it&apos;s used automatically for every overview,
                summary, chat and architecture diagram. Keys are encrypted before
                they&apos;re stored and are never exposed to the browser.
              </p>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                  <IconSettings className="h-5 w-5" />
                </div>
                <p className="text-sm text-neutral-400">
                  Manage connected providers, test a key, or switch back to the
                  platform default anytime from Settings.
                </p>
              </div>
            </section>

            <section id="faq">
              <h2 className="text-2xl font-bold">FAQ</h2>
              <p className="mt-4 text-neutral-300">
                Common questions about pricing, privacy and supported repositories are
                answered on the{" "}
                <Link href="/#faq" className="font-medium text-red-400 hover:text-red-300">
                  homepage FAQ
                </Link>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  );
}
