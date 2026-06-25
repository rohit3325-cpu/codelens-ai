"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

export default function Hero() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const [quickUrl, setQuickUrl] = useState("");
  const [isTrying, setIsTrying] = useState(false);
  const [tryError, setTryError] = useState("");

  const handleQuickTry = async () => {
    if (!quickUrl.trim()) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    setIsTrying(true);
    setTryError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: quickUrl }),
      });

      const data = await res.json();

      if (!data.success) {
        setTryError(data.message || "Failed to analyze repository.");
        setIsTrying(false);
        return;
      }

      router.push(`/repository/${data.repoName}/overview`);
    } catch (err) {
      console.error(err);
      setTryError("Failed to analyze repository.");
      setIsTrying(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      <Image
        src="/hero-bg2.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div  id="analyze-section" className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/40 to-neutral-950" />

      {/* <div className="pointer-events-none absolute top-[-200px] left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/20 blur-[180px]" /> */}

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-neutral-400"
        >
          ✨ AI-Powered Repository Analysis
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl"
        >
          Understand Any
          <span className="block bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
            Codebase Instantly
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-8 max-w-3xl text-lg text-neutral-400 sm:text-xl"
        >
          AI-powered repository analysis, architecture diagrams, code
          summaries, onboarding guides and repository-aware chat.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuickTry()}
              placeholder="https://github.com/vercel/next.js"
              disabled={isTrying}
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-sm text-white outline-none focus:border-red-500 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={handleQuickTry}
              disabled={isTrying}
              className="whitespace-nowrap rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold transition hover:bg-red-700 disabled:opacity-50"
            >
              {isTrying ? "Analyzing..." : "Try It"}
            </button>
          </div>

          {tryError && (
            <p className="mt-3 text-sm text-amber-400">{tryError}</p>
          )}

          
        </motion.div>
      </div>
    </section>
  );
}
