"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import AIProviderSettings from "@/components/settings/AIProviderSettings";
import { PROVIDER_CATALOG, PROVIDER_LABELS, type AIProviderName } from "@/lib/aiProviderCatalog";

interface Settings {
  theme: "light" | "dark" | "system";
  defaultDashboardTab: "overview" | "files" | "chat" | "architecture" | "onboarding";
  ai: {
    summaryLength: "short" | "medium" | "detailed";
    architectureDetail: "simple" | "advanced";
    chatStyle: "concise" | "detailed";
    preferredProvider: AIProviderName;
    preferredModel: string;
  };
  autoGenerate: {
    overview: boolean;
    architectureDiagram: boolean;
    fileSummaries: boolean;
    onboardingGuide: boolean;
  };
}

interface Usage {
  totalRepositories: number;
  totalChats: number;
  totalSummaries: number;
  totalOnboardingGuides: number;
}

export default function SettingsPage() {
  const { openUserProfile } = useClerk();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings));

    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setUsage(data.usage));
  }, []);

  const persist = async (update: Record<string, unknown>) => {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });

    setSavedAt(Date.now());
  };

  const updateField = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (!settings) return;

    setSettings({ ...settings, [key]: value });
    persist({ [key]: value });
  };

  const updateAI = (field: keyof Settings["ai"], value: string) => {
    if (!settings) return;

    const nextAI = { ...settings.ai, [field]: value };
    setSettings({ ...settings, ai: nextAI });
    persist({ ai: { [field]: value } });
  };

  const updateAutoGenerate = (field: keyof Settings["autoGenerate"], value: boolean) => {
    if (!settings) return;

    const next = { ...settings.autoGenerate, [field]: value };
    setSettings({ ...settings, autoGenerate: next });
    persist({ autoGenerate: { [field]: value } });
  };

  if (!settings) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
        <span className="text-neutral-400">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-neutral-400">
          Configure how CodeLens AI looks and generates results for you.
        </p>
        {savedAt && <p className="mt-2 text-xs text-emerald-400">Saved</p>}
      </div>

      <Section title="General">
        <Field label="Theme">
          <Select
            value={settings.theme}
            onChange={(v) => updateField("theme", v as Settings["theme"])}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
        </Field>

        <Field label="Default Dashboard Tab">
          <Select
            value={settings.defaultDashboardTab}
            onChange={(v) => updateField("defaultDashboardTab", v as Settings["defaultDashboardTab"])}
            options={[
              { value: "overview", label: "Overview" },
              { value: "files", label: "Files" },
              { value: "chat", label: "Chat" },
              { value: "architecture", label: "Architecture" },
              { value: "onboarding", label: "Onboarding" },
            ]}
          />
        </Field>
      </Section>

      <Section title="AI Preferences">
        <Field label="Summary Length">
          <Select
            value={settings.ai.summaryLength}
            onChange={(v) => updateAI("summaryLength", v)}
            options={[
              { value: "short", label: "Short" },
              { value: "medium", label: "Medium" },
              { value: "detailed", label: "Detailed" },
            ]}
          />
        </Field>

        <Field label="Architecture Detail">
          <Select
            value={settings.ai.architectureDetail}
            onChange={(v) => updateAI("architectureDetail", v)}
            options={[
              { value: "simple", label: "Simple" },
              { value: "advanced", label: "Advanced" },
            ]}
          />
        </Field>

        <Field label="Repository Chat Style">
          <Select
            value={settings.ai.chatStyle}
            onChange={(v) => updateAI("chatStyle", v)}
            options={[
              { value: "concise", label: "Concise" },
              { value: "detailed", label: "Detailed" },
            ]}
          />
        </Field>

        <Field label="Preferred Provider">
          <Select
            value={settings.ai.preferredProvider}
            onChange={(v) => {
              const provider = v as AIProviderName;
              const nextAI = {
                ...settings.ai,
                preferredProvider: provider,
                preferredModel: PROVIDER_CATALOG[provider][0].id,
              };
              setSettings({ ...settings, ai: nextAI });
              persist({ ai: nextAI });
            }}
            options={Object.entries(PROVIDER_LABELS).map(([value, label]) => ({ value, label }))}
          />
        </Field>

        <Field label="Model">
          <Select
            value={settings.ai.preferredModel}
            onChange={(v) => updateAI("preferredModel", v)}
            options={PROVIDER_CATALOG[settings.ai.preferredProvider].map((m) => ({
              value: m.id,
              label: m.label,
            }))}
          />
        </Field>
      </Section>

      <Section title="Repository Preferences">
        <p className="mb-2 text-sm text-neutral-400">Auto-generate on analysis:</p>

        <Toggle
          label="Overview"
          checked={settings.autoGenerate.overview}
          onChange={(v) => updateAutoGenerate("overview", v)}
        />
        <Toggle
          label="Architecture Diagram"
          checked={settings.autoGenerate.architectureDiagram}
          onChange={(v) => updateAutoGenerate("architectureDiagram", v)}
        />
        <Toggle
          label="File Summaries"
          checked={settings.autoGenerate.fileSummaries}
          onChange={(v) => updateAutoGenerate("fileSummaries", v)}
        />
        <Toggle
          label="Onboarding Guide"
          checked={settings.autoGenerate.onboardingGuide}
          onChange={(v) => updateAutoGenerate("onboardingGuide", v)}
        />
      </Section>

      <Section title="AI Providers (Bring Your Own Key)">
        <AIProviderSettings />
      </Section>

      <Section title="Usage">
        {usage ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <UsageStat label="Repositories" value={usage.totalRepositories} />
            <UsageStat label="Chats" value={usage.totalChats} />
            <UsageStat label="Summaries" value={usage.totalSummaries} />
            <UsageStat label="Onboarding Guides" value={usage.totalOnboardingGuides} />
          </div>
        ) : (
          <p className="text-sm text-neutral-500">Loading usage...</p>
        )}
      </Section>

      <Section title="Account">
        <button
          type="button"
          onClick={() => openUserProfile()}
          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-red-700"
        >
          Manage Account
        </button>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5">
        {children}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <label className="text-sm text-neutral-300">{label}</label>
      <div className="sm:w-56">{children}</div>
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-red-500"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm text-neutral-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? "bg-red-600" : "bg-neutral-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function UsageStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{label}</p>
    </div>
  );
}
