import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { IconArrowLeft } from "@/components/icons";

export default function RepositoryTopbar({
  repoId,
}: {
  repoId: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="hidden text-xs uppercase tracking-wider text-slate-500 sm:inline">
          Repository
        </span>
        <span className="truncate font-mono text-sm text-slate-300">
          {repoId}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <IconArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Analyze another repository</span>
        </Link>

        <UserButton />
      </div>
    </header>
  );
}
