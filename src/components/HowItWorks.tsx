"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { IconArrowLeft, IconChat, IconCpu, IconLink } from "@/components/icons";

const STEPS = [
  {
    number: "01",
    title: "Paste a GitHub URL",
    description: "Drop in any public repository link to get started.",
    icon: IconLink,
  },
  {
    number: "02",
    title: "AI Analyzes the Repo",
    description: "Our AI scans the structure, code and architecture in seconds.",
    icon: IconCpu,
  },
  {
    number: "03",
    title: "Explore, Chat & Understand",
    description: "Browse files, view diagrams, and ask questions about the code.",
    icon: IconChat,
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <h2 className="text-center text-4xl font-bold sm:text-5xl">
        How It Works
      </h2>

      <div className="mt-16 flex flex-col items-stretch gap-8 md:flex-row md:items-start md:justify-between md:gap-4">
        {STEPS.map((step, i) => {
          const Icon = step.icon;

          return (
            <Fragment key={step.number}>
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-1 flex-col items-center text-center"
              >
                <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 text-red-400">
                  <Icon className="h-7 w-7" />
                  <span className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold">{step.title}</h3>

                <p className="mt-2 max-w-xs text-neutral-400">
                  {step.description}
                </p>
              </motion.div>

              {i < STEPS.length - 1 && (
                <div className="hidden items-center justify-center pt-6 md:flex">
                  <IconArrowLeft className="h-6 w-6 rotate-180 text-neutral-700" />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
