"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IconBook } from "@/components/icons";

interface SavedRepository {
  _id: string;
  repoName: string;
}

interface OnboardingGuide {
  _id: string;
  content: string;
  createdAt: string;
}

export default function OnboardingPage() {
  const [repositories, setRepositories] = useState<SavedRepository[] | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [guide, setGuide] = useState<OnboardingGuide | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/repositories")
      .then((res) => res.json())
      .then((data) => {
        const repos: SavedRepository[] = data.repositories || [];
        setRepositories(repos);

        if (repos.length > 0) {
          setSelectedId(repos[0]._id);
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    let isCancelled = false;

    const timeout = setTimeout(() => {
      if (isCancelled) return;

      setIsLoadingGuide(true);
      setGuide(null);

      fetch(`/api/onboarding?repositoryId=${selectedId}`)
        .then((res) => res.json())
        .then((data) => {
          if (!isCancelled) setGuide(data.guide || null);
        })
        .finally(() => {
          if (!isCancelled) setIsLoadingGuide(false);
        });
    }, 0);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [selectedId]);

  const handleGenerate = async () => {
    if (!selectedId) return;

    setIsGenerating(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repositoryId: selectedId }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to generate onboarding guide.");
        return;
      }

      setGuide(data.guide);
    } catch (err) {
      console.error(err);
      setError("Failed to generate onboarding guide.");
    } finally {
      setIsGenerating(false);
    }
  };

  const noRepositories = repositories !== null && repositories.length === 0;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">Onboarding Guide</h1>
      <p className="mt-2 text-neutral-400">
        An AI-generated guide to help a new developer ramp up on a repository.
      </p>

      {noRepositories ? (
        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center text-neutral-400">
          You haven&apos;t analyzed any repositories yet.
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm text-white outline-none focus:border-red-500"
            >
              {repositories === null && <option>Loading...</option>}
              {repositories?.map((repo) => (
                <option key={repo._id} value={repo._id}>
                  {repo.repoName}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !selectedId}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold whitespace-nowrap transition hover:bg-red-700 disabled:opacity-50"
            >
              <IconBook className="h-4 w-4" />
              {isGenerating ? "Generating..." : guide ? "Regenerate Guide" : "Generate Guide"}
            </button>
          </div>

          {error && <p className="mt-3 text-sm text-amber-400">{error}</p>}

          <div className="mt-6">
            {isLoadingGuide ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                <span className="text-neutral-400">Loading guide...</span>
              </div>
            ) : guide ? (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
                <p className="mb-4 text-xs text-neutral-500">
                  Generated {new Date(guide.createdAt).toLocaleString()}
                </p>

                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {guide.content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center text-neutral-400">
                No onboarding guide yet — click Generate to create one.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
