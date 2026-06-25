"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconArrowLeft, IconSearch, IconTrash } from "@/components/icons";

interface RepositoryHealth {
  score: number;
  testCoverage: string;
  documentation: string;
  typeSafety: string;
}

interface SavedRepository {
  _id: string;
  repoId: string;
  repoName: string;
  repoUrl: string;
  totalFiles: number;
  repositoryHealth: RepositoryHealth;
  analyzedAt: string;
}

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<SavedRepository[] | null>(null);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const isFirstLoad = repositories === null;

    const timeout = setTimeout(
      async () => {
        const url = query
          ? `/api/repositories?q=${encodeURIComponent(query)}`
          : "/api/repositories";

        const res = await fetch(url);
        const data = await res.json();

        setRepositories(data.repositories || []);
      },
      isFirstLoad ? 0 : 300
    );

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);

    try {
      const res = await fetch(`/api/repositories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        setRepositories((prev) => (prev || []).filter((repo) => repo._id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const isLoading = repositories === null;

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold">Saved Repositories</h1>
      <p className="mt-2 text-neutral-400">
        Every repository you&apos;ve analyzed, ready to reopen instantly.
      </p>

      <div className="relative mt-8 max-w-sm">
        <IconSearch className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories..."
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 py-2.5 pl-9 pr-4 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <span className="text-neutral-400">Loading repositories...</span>
          </div>
        ) : repositories.length === 0 ? (
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center text-neutral-400">
            {query
              ? "No repositories match your search."
              : "You haven't analyzed any repositories yet."}
          </div>
        ) : (
          <div className="space-y-3">
            {repositories.map((repo) => (
              <div
                key={repo._id}
                className="flex flex-col gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-white">
                    {repo.repoName}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500">
                    {repo.totalFiles} files · Health {repo.repositoryHealth?.score ?? "—"} · Analyzed{" "}
                    {new Date(repo.analyzedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/repository/${repo.repoId}/overview`}
                    className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700"
                  >
                    Open
                    <IconArrowLeft className="h-4 w-4 rotate-180" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(repo._id)}
                    disabled={deletingId === repo._id}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-700 text-neutral-400 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
                    aria-label={`Delete ${repo.repoName}`}
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
