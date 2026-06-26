"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getRepositoryNavLinks } from "@/lib/repositoryNav";
import { getDashboardNavLinks } from "@/lib/dashboardNav";
import { FREE_PLAN_REPO_LIMIT } from "@/lib/plans";

interface SubscriptionSummary {
  plan: "free" | "pro";
  currentPeriodEnd: string | null;
  reposUsedThisMonth: number;
  repoLimit: number | null;
}

export default function RepositorySidebar({ repoId }: { repoId?: string }) {
  const pathname = usePathname();
  const repoLinks = repoId ? getRepositoryNavLinks(repoId) : [];
  const dashboardLinks = getDashboardNavLinks();
  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();

        if (data.success) {
          setSummary(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-950 p-6 lg:flex">
      <Link
        href="/dashboard/repositories"
        className="mb-10 flex items-center gap-2 text-xl font-bold"
      >
        <Image src="/logo6.png" alt="TraceLens AI" width={32} height={32} className="h-8 w-8" />
        TraceLens <span className="text-red-500">AI</span>
      </Link>

      {repoId && (
        <div className="mb-6">
          <p className="mb-2 px-4 text-xs font-medium tracking-wider text-neutral-500 uppercase">
            Repository
          </p>

          <nav className="space-y-1">
            {repoLinks.map((link) => (
              <NavLink key={link.name} link={link} isActive={pathname === link.href} />
            ))}
          </nav>
        </div>
      )}

      <div>
        <p className="mb-2 px-4 text-xs font-medium tracking-wider text-neutral-500 uppercase">
          Workspace
        </p>

        <nav className="space-y-1">
          {dashboardLinks.map((link) => (
            <NavLink key={link.name} link={link} isActive={pathname === link.href} />
          ))}
        </nav>
      </div>

      <div className="mt-auto pt-6">
        <PlanWidget summary={summary} />
      </div>
    </aside>
  );
}

function PlanWidget({ summary }: { summary: SubscriptionSummary | null }) {
  if (!summary) return null;

  if (summary.plan === "pro") {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">Plan</p>
        <p className="mt-1 text-sm font-semibold text-white">
          Pro <span className="text-red-500">Active</span>
        </p>
        {summary.currentPeriodEnd && (
          <p className="mt-1 text-xs text-neutral-500">
            Renews {new Date(summary.currentPeriodEnd).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  }

  const limit = summary.repoLimit ?? FREE_PLAN_REPO_LIMIT;
  const used = Math.min(summary.reposUsedThisMonth, limit);
  const pct = Math.round((used / limit) * 100);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium tracking-wider text-neutral-500 uppercase">Plan</p>
        <span className="text-xs font-semibold text-neutral-300">Free</span>
      </div>

      <p className="mt-2 text-xs text-neutral-400">
        {used}/{limit} repositories used
      </p>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-red-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <Link
        href="/#pricing"
        className="mt-3 block w-full rounded-xl bg-red-600 px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-red-700"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}

function NavLink({
  link,
  isActive,
}: {
  link: { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
  isActive: boolean;
}) {
  const Icon = link.icon;

  return (
    <Link
      href={link.href}
      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-red-600 text-white"
          : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      {link.name}
    </Link>
  );
}
