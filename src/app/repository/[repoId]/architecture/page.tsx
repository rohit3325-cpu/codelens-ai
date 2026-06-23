"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import MermaidDiagram from "@/components/MermaidDiagram";
import { useRepositoryData } from "@/components/RepositoryDataProvider";

export default function ArchitecturePage() {
  const { repoId } = useParams<{ repoId: string }>();
  const { architecture, setArchitecture } = useRepositoryData();

  const isLoading = architecture === null;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current || !isLoading) return;
    hasFetched.current = true;

    const load = async () => {
      const res = await fetch("/api/architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId }),
      });

      const data = await res.json();

      setArchitecture(data.diagram || "");
    };

    load();
  }, [repoId, isLoading, setArchitecture]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Architecture</h1>
      <p className="mt-2 text-slate-400">
        AI-generated, high-level architecture diagram for this repository.
      </p>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <span className="text-slate-400">Generating diagram...</span>
          </div>
        ) : (
          <MermaidDiagram chart={architecture} />
        )}
      </div>
    </div>
  );
}
