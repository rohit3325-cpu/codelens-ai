"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

export default function CTAWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
  };

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950/30 p-10 text-center sm:p-14"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Join 500+ Developers on the Waitlist
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-neutral-400">
          Get early access, updates and a free Pro trial when we launch.
        </p>

        {submitted ? (
          <p className="mt-8 font-medium text-red-400">
            You&apos;re on the list! We&apos;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 p-3 text-white outline-none focus:border-red-500"
            />

            <button
              type="submit"
              className="rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:bg-red-700"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}
