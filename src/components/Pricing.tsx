"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { loadRazorpayCheckoutScript } from "@/lib/razorpayCheckout";
import { FREE_PLAN_REPO_LIMIT } from "@/lib/plans";

interface SubscriptionSummary {
  plan: "free" | "pro";
  currentPeriodEnd: string | null;
  reposUsedThisMonth: number;
  repoLimit: number | null;
}

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface Plan {
  name: "Free" | "Pro" | "Team";
  price: string;
  period: string;
  description: string;
  features: string[];
  cta?: string;
  highlighted: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "₹0",
    period: "/mo",
    description: "For trying things out",
    features: [
      "5 repositories / month",
      "AI-generated overview",
      "File explorer",
      "Public repos only",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹999",
    period: "/mo",
    description: "For individual developers",
    features: [
      "Unlimited repositories",
      "Architecture diagrams",
      "Repository chat",
      "Private repositories",
      "Persistent workspace",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: "₹2,999",
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
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn, openSignUp } = useClerk();

  const [summary, setSummary] = useState<SubscriptionSummary | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function refreshSummary() {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();

      if (data.success) {
        setSummary(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      try {
        const res = await fetch("/api/subscription");
        const data = await res.json();

        if (data.success) {
          setSummary(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [isSignedIn]);

  function handleFreeClick() {
    if (!isSignedIn) {
      openSignUp();
      return;
    }

    router.push("/dashboard/repositories");
  }

  async function handleProClick() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }

    if (summary?.plan === "pro" || isPaying) {
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsPaying(true);

    try {
      await loadRazorpayCheckoutScript();

      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "pro" }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        setError(orderData.message || "Failed to start checkout.");
        setIsPaying(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "TraceLens AI",
        description: "Pro plan - 30 days",
        prefill: {
          name: user?.fullName ?? undefined,
          email: user?.primaryEmailAddress?.emailAddress ?? undefined,
        },
        theme: { color: "#dc2626" },
        handler: async (response: RazorpayHandlerResponse) => {
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setSuccessMessage("Payment successful! You're now on the Pro plan.");
              await refreshSummary();
            } else {
              setError(verifyData.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            setError("Payment verification failed.");
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      });

      razorpay.open();
    } catch (err) {
      console.error(err);
      setError("Failed to start checkout.");
      setIsPaying(false);
    }
  }

  function freeCta() {
    if (!isLoaded) return "Get Started";
    if (!isSignedIn) return "Sign Up Free";
    return "Go to Dashboard";
  }

  function proCta() {
    if (!isLoaded) return "Start Free Trial";
    if (!isSignedIn) return "Sign In to Upgrade";
    if (summary?.plan === "pro") return "Pro Active";
    if (isPaying) return "Processing...";
    return "Upgrade to Pro";
  }

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

            {plan.name === "Free" && (
              <button
                type="button"
                onClick={handleFreeClick}
                className="mt-8 w-full rounded-xl border border-neutral-700 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-500"
              >
                {freeCta()}
              </button>
            )}

            {plan.name === "Pro" && (
              <button
                type="button"
                onClick={handleProClick}
                disabled={isPaying || summary?.plan === "pro"}
                className="mt-8 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {proCta()}
              </button>
            )}

            {plan.name === "Team" && (
              <button
                type="button"
                className="mt-8 w-full rounded-xl border border-neutral-700 px-4 py-3 text-sm font-semibold text-white transition hover:border-red-500"
              >
                {plan.cta}
              </button>
            )}

            {plan.name === "Free" && isSignedIn && summary?.plan === "free" && (
              <p className="mt-3 text-center text-xs text-neutral-500">
                {summary.reposUsedThisMonth}/{FREE_PLAN_REPO_LIMIT} repositories used this month
              </p>
            )}

            {plan.name === "Pro" && isSignedIn && summary?.plan === "pro" && summary.currentPeriodEnd && (
              <p className="mt-3 text-center text-xs text-neutral-500">
                Renews on {new Date(summary.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {(error || successMessage) && (
        <p
          className={`mx-auto mt-6 max-w-xl text-center text-sm ${
            error ? "text-amber-400" : "text-emerald-400"
          }`}
        >
          {error || successMessage}
        </p>
      )}
    </section>
  );
}
