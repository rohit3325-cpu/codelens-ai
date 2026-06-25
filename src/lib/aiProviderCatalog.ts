// Pure data, zero imports — safe to import from both server code and
// client components without pulling AI provider SDKs into the browser bundle.

export type AIProviderName = "openai" | "gemini" | "claude" | "openrouter";

export interface ProviderModelOption {
  id: string;
  label: string;
}

export const PROVIDER_CATALOG: Record<AIProviderName, ProviderModelOption[]> = {
  openai: [
    { id: "gpt-4o", label: "GPT-4o" },
    { id: "gpt-4.1-mini", label: "GPT-4.1 mini" },
  ],
  gemini: [
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  ],
  claude: [
    { id: "claude-sonnet-4-5", label: "Claude Sonnet" },
    { id: "claude-opus-4-1", label: "Claude Opus" },
  ],
  // OpenRouter routes to whatever model string the user configures.
  openrouter: [{ id: "openrouter/free", label: "OpenRouter (free)" }],
};

export const DEFAULT_MODELS: Record<AIProviderName, string> = {
  openai: "gpt-4o",
  gemini: "gemini-2.5-flash",
  claude: "claude-sonnet-4-5",
  openrouter: "openrouter/free",
};

export const PROVIDER_LABELS: Record<AIProviderName, string> = {
  openai: "OpenAI",
  gemini: "Gemini",
  claude: "Claude",
  openrouter: "OpenRouter",
};

export const ALL_PROVIDERS: AIProviderName[] = ["openai", "gemini", "claude", "openrouter"];
