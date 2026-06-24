"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
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
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/30 via-neutral-950/40 to-neutral-950" />

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
      </div>
    </section>
  );
}
