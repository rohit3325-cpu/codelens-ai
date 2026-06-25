"use client";

import { useEffect, useState } from "react";
import {
  ALL_PROVIDERS,
  PROVIDER_LABELS,
  type AIProviderName,
} from "@/lib/aiProviderCatalog";

interface ProviderStatus {
  provider: AIProviderName;
  status: "connected" | "not_connected";
  maskedApiKey: string | null;
}

export default function AIProviderSettings() {
  const [providers, setProviders] = useState<ProviderStatus[] | null>(null);
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({});
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<Record<string, string>>({});

  const loadProviders = async () => {
    const res = await fetch("/api/ai-providers");
    const data = await res.json();
    setProviders(data.providers || []);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProviders();
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  const handleSave = async (provider: AIProviderName) => {
    const apiKey = keyInputs[provider]?.trim();
    if (!apiKey) return;

    setBusyProvider(provider);
    setTestResult((prev) => ({ ...prev, [provider]: "" }));

    try {
      await fetch("/api/ai-providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });

      setKeyInputs((prev) => ({ ...prev, [provider]: "" }));
      await loadProviders();
    } finally {
      setBusyProvider(null);
    }
  };

  const handleRemove = async (provider: AIProviderName) => {
    setBusyProvider(provider);

    try {
      await fetch(`/api/ai-providers/${provider}`, { method: "DELETE" });
      await loadProviders();
    } finally {
      setBusyProvider(null);
    }
  };

  const handleTest = async (provider: AIProviderName) => {
    setBusyProvider(provider);
    setTestResult((prev) => ({ ...prev, [provider]: "" }));

    try {
      const res = await fetch(`/api/ai-providers/${provider}/test`, { method: "POST" });
      const data = await res.json();

      setTestResult((prev) => ({
        ...prev,
        [provider]: data.success ? "Connection successful" : data.error || "Connection failed",
      }));
    } finally {
      setBusyProvider(null);
    }
  };

  if (providers === null) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <span className="text-neutral-400">Loading providers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ALL_PROVIDERS.map((provider) => {
        const status = providers.find((p) => p.provider === provider);
        const isConnected = status?.status === "connected";
        const isBusy = busyProvider === provider;

        return (
          <div
            key={provider}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-white">{PROVIDER_LABELS[provider]}</p>
                {isConnected ? (
                  <p className="mt-1 text-sm text-emerald-400">
                    Connected · {status?.maskedApiKey}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-neutral-500">Not connected</p>
                )}
              </div>

              {isConnected && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleTest(provider)}
                    disabled={isBusy}
                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-red-500 hover:text-white disabled:opacity-50"
                  >
                    Test Connection
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(provider)}
                    disabled={isBusy}
                    className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {testResult[provider] && (
              <p
                className={`mt-2 text-xs ${
                  testResult[provider] === "Connection successful"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {testResult[provider]}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <input
                type="password"
                value={keyInputs[provider] || ""}
                onChange={(e) =>
                  setKeyInputs((prev) => ({ ...prev, [provider]: e.target.value }))
                }
                placeholder={isConnected ? "Enter a new key to update" : "Enter API key"}
                className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
              />

              <button
                type="button"
                onClick={() => handleSave(provider)}
                disabled={isBusy || !keyInputs[provider]?.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-700 disabled:opacity-50"
              >
                {isConnected ? "Update" : "Add"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
