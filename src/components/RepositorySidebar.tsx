"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRepositoryNavLinks } from "@/lib/repositoryNav";
import { getDashboardNavLinks } from "@/lib/dashboardNav";

export default function RepositorySidebar({ repoId }: { repoId?: string }) {
  const pathname = usePathname();
  const repoLinks = repoId ? getRepositoryNavLinks(repoId) : [];
  const dashboardLinks = getDashboardNavLinks();

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
    </aside>
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
