"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  IconArchitecture,
  IconChat,
  IconFiles,
  IconOverview,
  IconSearch,
  IconWorkspace,
} from "@/components/icons";

gsap.registerPlugin(ScrollTrigger);

const FEATURE_CARDS = [
  {
    title: "Repository Analyzer",
    description:
      "Paste any public GitHub URL and get a full structural scan in seconds — no cloning, no setup.",
    icon: IconSearch,
  },
  {
    title: "AI-Generated Overview",
    description:
      "Project type, tech stack, core workflow and a repository health score, generated automatically.",
    icon: IconOverview,
  },
  {
    title: "File Explorer & AI Summaries",
    description:
      "Browse the real source tree and get an instant AI explanation of any file you open.",
    icon: IconFiles,
  },
  {
    title: "Architecture Diagrams",
    description:
      "Auto-generated diagrams that map how the codebase actually fits together.",
    icon: IconArchitecture,
  },
  {
    title: "Repository Chat",
    description:
      "Ask questions in plain English and get answers grounded in the actual code, not guesses.",
    icon: IconChat,
  },
  {
    title: "Persistent Workspace",
    description:
      "Every repository you analyze is saved to your workspace — pick up exactly where you left off.",
    icon: IconWorkspace,
  },
];

export default function StackedFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(
      (el): el is HTMLDivElement => el !== null
    );

    if (!section || cards.length === 0) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const lastIndex = cards.length - 1;

      cards.forEach((card, i) => {
        const isLast = i === lastIndex;

        // Every card shrinks slightly the deeper it sits in the deck —
        // the last card follows the exact same scale as the rest so it
        // doesn't look oddly bigger once it's the only one left. Only
        // its position/tilt resets to neutral, since unlike the others
        // it never gets animated away and needs to sit flat once revealed.
        gsap.set(card, {
          y: isLast ? 0 : i * 14,
          scale: 1 - i * 0.025,
          rotate: isLast ? 0 : i % 2 === 0 ? -2 : 2,
          zIndex: cards.length - i,
        });
      });

      const animatedCards = cards.slice(0, lastIndex);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${cards.length * 480}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      animatedCards.forEach((card, i) => {
        // Phase 1: rise up and pass in front of the heading, fully opaque.
        tl.to(card, {
          y: "-85%",
          rotate: i % 2 === 0 ? -6 : 6,
          ease: "power1.in",
          duration: 0.6,
        });

        // Phase 2: keep rising and fade out once clear of the heading.
        tl.to(card, {
          y: "-180%",
          opacity: 0,
          rotate: i % 2 === 0 ? -12 : 12,
          ease: "power1.out",
          duration: 0.5,
        });
      });

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      <div className="bg-feature-grid pointer-events-none absolute inset-0 -z-10" />

      {/* Desktop: pinned scroll-peel stack */}
      <div className="hidden h-screen flex-col items-center justify-center px-4 md:flex">
        <h2 className="mb-14 text-center text-4xl font-bold sm:text-5xl">
          Everything You Need
        </h2>

        <div className="relative h-[460px] w-full max-w-xl">
          {FEATURE_CARDS.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-10 shadow-2xl shadow-black/40"
              >
                <Image
                  src="/backg.png"
                  alt=""
                  fill
                  className="object-cover "
                />
                <div className="absolute inset-0 bg-neutral-950/55" />

                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-400">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-2xl font-semibold">{feature.title}</h3>

                  <p className="mt-4 text-lg text-neutral-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: static grid, no scroll-jacking */}
      <div className="py-16 md:hidden">
        <h2 className="mb-10 text-center text-4xl font-bold">
          Everything You Need
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {FEATURE_CARDS.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 p-8"
              >
                <Image
                  src="/backg.png"
                  alt=""
                  fill
                  className="object-cover opacity-45"
                />
                <div className="absolute inset-0 bg-neutral-950/55" />

                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/10 text-red-400">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-xl font-semibold">{feature.title}</h3>

                  <p className="mt-3 text-neutral-400">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
