"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

function SignInPrompt() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <p className="mt-4 text-sm text-neutral-400">
      You need to sign in to analyze a repository and view results.{" "}
      <button
        type="button"
        onClick={() => openSignIn()}
        className="font-medium text-red-400 hover:text-red-300"
      >
        Sign in
      </button>{" "}
      or{" "}
      <button
        type="button"
        onClick={() => openSignUp()}
        className="font-medium text-red-400 hover:text-red-300"
      >
        sign up
      </button>
      .
    </p>
  );
}

export default function RepoInput() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeRepo = async () => {
    if (!repoUrl.trim()) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Failed to analyze repository.");
        setIsLoading(false);
        return;
      }

      router.push(`/repository/${data.repoName}/overview`);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze repository.");
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && analyzeRepo()}
            placeholder="Paste GitHub Repository URL..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 p-4 text-white outline-none focus:border-red-500 disabled:opacity-50"
          />

          <button
            type="button"
            onClick={analyzeRepo}
            disabled={isLoading}
            className="whitespace-nowrap rounded-xl bg-red-600 px-6 py-4 font-semibold transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading
              ? "Analyzing..."
              : isLoaded && !isSignedIn
                ? "Sign In to Analyze"
                : "Analyze"}
          </button>
        </div>

        {isLoaded && !isSignedIn && <SignInPrompt />}

        {error && <p className="mt-4 text-sm text-amber-400">{error}</p>}
      </div>
    </div>
  );
}
