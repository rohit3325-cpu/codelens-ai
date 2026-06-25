"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDashboardNavLinks } from "@/lib/dashboardNav";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const links = getDashboardNavLinks();

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-neutral-800 bg-neutral-950 p-6 lg:flex">
      <Link href="/dashboard/repositories" className="mb-10 block text-xl font-bold">
        CodeLens AI
      </Link>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
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
        })}
      </nav>
    </aside>
  );
}
