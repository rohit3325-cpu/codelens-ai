import { IconGithub } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 py-12">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold">CodeLens AI</h3>
          <p className="mt-1 text-sm text-slate-400">
            Understand any codebase, instantly.
          </p>
        </div>

        <div className="flex items-center gap-8 text-sm text-slate-400">
          <button className="transition hover:text-white">Features</button>
          <button className="transition hover:text-white">Docs</button>
          <button className="flex items-center gap-2 transition hover:text-white">
            <IconGithub className="h-4 w-4" />
            GitHub
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} CodeLens AI. All rights reserved.
      </p>
    </footer>
  );
}
