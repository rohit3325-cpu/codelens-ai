import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEFAULT_MODELS, type AIProviderName } from "@/lib/aiProviderCatalog";

export type { AIProviderName };
export { DEFAULT_MODELS, PROVIDER_CATALOG } from "@/lib/aiProviderCatalog";

export interface AIClientConfig {
  provider: AIProviderName;
  apiKey: string;
  model: string;
}

export const PLATFORM_DEFAULT_CONFIG: AIClientConfig = {
  provider: "openrouter",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  model: DEFAULT_MODELS.openrouter,
};

export class NoApiKeyAvailableError extends Error {
  constructor(provider: AIProviderName) {
    super(
      `No API key available for provider "${provider}" — the user hasn't connected one and no platform key is configured.`
    );
    this.name = "NoApiKeyAvailableError";
  }
}

export class AIProviderRequestError extends Error {
  provider: AIProviderName;

  constructor(provider: AIProviderName, message: string) {
    super(message);
    this.name = "AIProviderRequestError";
    this.provider = provider;
  }
}

/** Platform-level fallback keys, read directly from env — never from the DB. */
export function getPlatformApiKey(provider: AIProviderName): string | null {
  switch (provider) {
    case "openrouter":
      return process.env.OPENROUTER_API_KEY || null;
    case "gemini":
      return process.env.GEMINI_API_KEY || null;
    case "openai":
      return process.env.OPENAI_API_KEY || null;
    case "claude":
      return process.env.ANTHROPIC_API_KEY || null;
  }
}

/**
 * Single entry point for talking to any supported provider. Each provider
 * has a different SDK and response shape — this normalizes all of them to
 * a plain string so the rest of the app (lib/ai.ts) never has to know which
 * provider actually served the request.
 */
export async function generateCompletion(
  config: AIClientConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    switch (config.provider) {
      case "openai":
        return await generateWithOpenAICompatible(config, systemPrompt, userPrompt);
      case "openrouter":
        return await generateWithOpenAICompatible(
          config,
          systemPrompt,
          userPrompt,
          "https://openrouter.ai/api/v1"
        );
      case "gemini":
        return await generateWithGemini(config, systemPrompt, userPrompt);
      case "claude":
        return await generateWithClaude(config, systemPrompt, userPrompt);
    }
  } catch (error) {
    if (error instanceof AIProviderRequestError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    throw new AIProviderRequestError(config.provider, message);
  }
}

async function generateWithOpenAICompatible(
  config: AIClientConfig,
  systemPrompt: string,
  userPrompt: string,
  baseURL?: string
): Promise<string> {
  const client = new OpenAI({ apiKey: config.apiKey, baseURL });

  const completion = await client.chat.completions.create({
    model: config.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return completion.choices[0]?.message?.content || "";
}

async function generateWithGemini(
  config: AIClientConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = new GoogleGenerativeAI(config.apiKey);

  const geminiModel = client.getGenerativeModel({
    model: config.model,
    systemInstruction: systemPrompt,
  });

  const result = await geminiModel.generateContent(userPrompt);

  return result.response.text() || "";
}

async function generateWithClaude(
  config: AIClientConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const client = new Anthropic({ apiKey: config.apiKey });

  const message = await client.messages.create({
    model: config.model,
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((block) => block.type === "text");

  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}

/**
 * A cheap, low-token request used purely to validate that an API key works,
 * for the Settings → AI Providers "Test Connection" action.
 */
export async function testProviderConnection(
  config: AIClientConfig
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await generateCompletion(config, "Reply with the single word: ok.", "ok");
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Connection test failed";
    return { ok: false, error: message };
  }
}
