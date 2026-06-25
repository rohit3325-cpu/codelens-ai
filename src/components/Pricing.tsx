"use client";

import { motion } from "framer-motion";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "For trying things out",
    features: [
      "5 repositories / month",
      "AI-generated overview",
      "File explorer",
      "Public repos only",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For individual developers",
    features: [
      "Unlimited repositories",
      "Architecture diagrams",
      "Repository chat",
      "Private repositories",
      "Persistent workspace",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    description: "For teams shipping together",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Priority support",
      "API access",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <h2 className="text-center text-4xl font-bold sm:text-5xl">
        Simple, Transparent Pricing
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-center text-neutral-400">
        Choose the plan that fits how you work. Upgrade or cancel anytime.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:items-center">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-3xl border p-8 ${
              plan.highlighted
                ? "border-red-500 bg-neutral-900 shadow-2xl shadow-red-600/10 md:-translate-y-4 md:scale-105"
                : "border-neutral-800 bg-neutral-900/60"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-xs font-semibold whitespace-nowrap text-white">
                Most Popular
              </span>
            )}

            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-neutral-400">{plan.description}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-neutral-400">{plan.period}</span>
            </div>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-neutral-300"
                >
                  <span className="mt-0.5 text-red-400">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                plan.highlighted
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "border border-neutral-700 text-white hover:border-red-500"
              }`}
            >
              {plan.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
