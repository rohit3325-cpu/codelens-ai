"use client";

import { motion } from "framer-motion";

const LOGOS = ["Next.js", "OpenAI", "Vercel", "GitHub", "TypeScript"];

export default function SocialProof() {
  return (
    <section className="py-10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-6 text-center text-sm text-neutral-500">
          Trusted by developers building with
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((logo) => (
            <span
              key={logo}
              className="text-lg font-semibold text-neutral-500 opacity-70 transition hover:opacity-100"
            >
              {logo}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
