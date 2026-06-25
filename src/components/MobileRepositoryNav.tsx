"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRepositoryNavLinks } from "@/lib/repositoryNav";
import { getDashboardNavLinks } from "@/lib/dashboardNav";

export default function MobileRepositoryNav({ repoId }: { repoId?: string }) {
  const pathname = usePathname();
  const links = repoId
    ? [...getRepositoryNavLinks(repoId), ...getDashboardNavLinks()]
    : getDashboardNavLinks();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-neutral-800 bg-neutral-950 px-4 py-3 lg:hidden">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-red-600 text-white"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
