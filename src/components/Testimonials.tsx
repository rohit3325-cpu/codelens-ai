"use client";

import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote:
      "TraceLens saved me hours when I joined a new team. I understood the entire codebase in 20 minutes.",
    name: "Alex R.",
    title: "Senior Engineer",
  },
  {
    quote:
      "The architecture diagrams are insane. I used to draw these manually.",
    name: "Priya M.",
    title: "Tech Lead",
  },
  {
    quote:
      "Finally a tool that actually reads the code, not just the README.",
    name: "James T.",
    title: "Indie Developer",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Testimonials() {
  return (
    <section className="py-20">
      <h2 className="text-center text-4xl font-bold sm:text-5xl">
        What Developers Are Saying
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial, i) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8"
          >
            <span className="text-4xl text-red-500/40">&ldquo;</span>

            <p className="mt-2 text-neutral-300">{testimonial.quote}</p>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10 text-sm font-semibold text-red-400">
                {initials(testimonial.name)}
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {testimonial.name}
                </p>
                <p className="text-xs text-neutral-500">{testimonial.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
