"use client";

import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    {
      value: "200+",
      label: "Repositories",
    },
    {
      value: "AI",
      label: "Architecture",
    },
    {
      value: "24/7",
      label: "Repository Chat",
    },
    {
      value: "100%",
      label: "Developer Focused",
    },
  ];

  return (
    <section className="py-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-900 p-6 transition-all hover:border-red-500"
          >
            <h3 className="text-4xl font-bold">{item.value}</h3>

            <p className="mt-2 text-neutral-400">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
