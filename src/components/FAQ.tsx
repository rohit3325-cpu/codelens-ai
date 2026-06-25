"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQS = [
  {
    q: "Is CodeLens AI free to use?",
    a: "Yes, our free tier supports up to 5 repositories per month with core features.",
  },
  {
    q: "Does it work with private repositories?",
    a: "Private repo support is available on Pro and Team plans via GitHub OAuth.",
  },
  {
    q: "How accurate is the AI analysis?",
    a: "Our analysis is grounded in the actual source code, not documentation, making it highly accurate for structure and flow.",
  },
  {
    q: "What languages and frameworks are supported?",
    a: "CodeLens AI works with any public GitHub repository regardless of language or framework.",
  },
  {
    q: "Is my code stored or used for training?",
    a: "No. We do not store your code or use it to train any models.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, all plans are month-to-month with no lock-in.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20">
      <h2 className="text-center text-4xl font-bold sm:text-5xl">
        Frequently Asked Questions
      </h2>

      <div className="mx-auto mt-14 max-w-3xl space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;

          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-white">{faq.q}</span>
                <span
                  className={`text-xl text-red-400 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-neutral-400">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
