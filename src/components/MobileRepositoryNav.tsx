"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRepositoryNavLinks } from "@/lib/repositoryNav";
import { getDashboardNavLinks } from "@/lib/dashboardNav";
import { IconClose, IconMenu } from "@/components/icons";

type NavLink = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export default function MobileRepositoryNav({ repoId }: { repoId?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const repoLinks = repoId ? getRepositoryNavLinks(repoId) : [];
  const dashboardLinks = getDashboardNavLinks();
  const currentLink = [...repoLinks, ...dashboardLinks].find(
    (link) => link.href === pathname
  );
  const CurrentIcon = currentLink?.icon;

  return (
    <div className="border-b border-neutral-800 bg-neutral-950 lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-white">
          {CurrentIcon && <CurrentIcon className="h-4 w-4" />}
          {currentLink?.name || "Menu"}
        </span>

        {isOpen ? (
          <IconClose className="h-5 w-5 text-neutral-400" />
        ) : (
          <IconMenu className="h-5 w-5 text-neutral-400" />
        )}
      </button>

      {isOpen && (
        <nav className="space-y-4 border-t border-neutral-800 px-3 py-4">
          {repoId && (
            <NavSection
              label="Repository"
              links={repoLinks}
              pathname={pathname}
              onNavigate={() => setIsOpen(false)}
            />
          )}

          <NavSection
            label="Workspace"
            links={dashboardLinks}
            pathname={pathname}
            onNavigate={() => setIsOpen(false)}
          />
        </nav>
      )}
    </div>
  );
}

function NavSection({
  label,
  links,
  pathname,
  onNavigate,
}: {
  label: string;
  links: NavLink[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div>
      <p className="mb-1 px-2 text-xs font-medium tracking-wider text-neutral-500 uppercase">
        {label}
      </p>

      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
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
      </div>
    </div>
  );
}
