"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import InsightCards from "@/components/InsightCards";
import { useRepositoryData } from "@/components/RepositoryDataProvider";

export default function OverviewPage() {
  const { repoId } = useParams<{ repoId: string }>();
  const { insights, setInsights, overview, setOverview } = useRepositoryData();

  const isLoading = insights === null || overview === null;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current || !isLoading) return;
    hasFetched.current = true;

    const load = async () => {
      const [insightsRes, overviewRes] = await Promise.all([
        fetch("/api/repository-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoId }),
        }),
        fetch("/api/repository-overview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoId }),
        }),
      ]);

      const insightsData = await insightsRes.json();
      const overviewData = await overviewRes.json();

      setInsights(insightsData);
      setOverview(overviewData.overview || "");
    };

    load();
  }, [repoId, isLoading, setInsights, setOverview]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-3xl font-bold">Repository Overview</h1>
      <p className="mt-2 text-slate-400">
        A high-level, AI-generated summary of this repository.
      </p>

      {isLoading ? (
        <div className="mt-8 flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-slate-400">Analyzing repository...</span>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {insights && <InsightCards insights={insights} />}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>
                {overview || "No overview available."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
