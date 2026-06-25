import { connectToDatabase } from "@/lib/mongodb";
import { UserAIProvider, type UserAIProviderDocument } from "@/models/UserAIProvider";
import { decrypt, encrypt, maskApiKey } from "@/lib/encryption";
import { getOrCreateUserSettings } from "@/lib/settingsStore";
import {
  DEFAULT_MODELS,
  getPlatformApiKey,
  NoApiKeyAvailableError,
  testProviderConnection,
  type AIClientConfig,
  type AIProviderName,
} from "@/lib/aiProviders";

export interface ProviderStatus {
  provider: AIProviderName;
  status: "connected" | "not_connected";
  maskedApiKey: string | null;
  isActive: boolean;
  lastValidatedAt: Date | null;
  lastValidationError: string | null;
}

const ALL_PROVIDERS: AIProviderName[] = ["openai", "gemini", "claude", "openrouter"];

/** Connection status for every provider — never returns the real key. */
export async function listProviderStatuses(userId: string): Promise<ProviderStatus[]> {
  await connectToDatabase();

  const records = await UserAIProvider.find({ userId }).lean();
  const byProvider = new Map(records.map((r) => [r.provider, r]));

  return ALL_PROVIDERS.map((provider) => {
    const record = byProvider.get(provider);

    if (!record) {
      return {
        provider,
        status: "not_connected",
        maskedApiKey: null,
        isActive: false,
        lastValidatedAt: null,
        lastValidationError: null,
      };
    }

    return {
      provider,
      status: record.isActive ? "connected" : "not_connected",
      maskedApiKey: maskApiKey(decrypt(record.encryptedApiKey)),
      isActive: record.isActive,
      lastValidatedAt: record.lastValidatedAt ?? null,
      lastValidationError: record.lastValidationError ?? null,
    };
  });
}

/** Add or update (upsert) a user's API key for a provider. */
export async function upsertProviderKey(
  userId: string,
  provider: AIProviderName,
  apiKey: string
): Promise<ProviderStatus> {
  await connectToDatabase();

  const encryptedApiKey = encrypt(apiKey);

  await UserAIProvider.findOneAndUpdate(
    { userId, provider },
    {
      $set: {
        encryptedApiKey,
        isActive: true,
        lastValidatedAt: null,
        lastValidationError: null,
      },
    },
    { upsert: true, new: true }
  );

  const statuses = await listProviderStatuses(userId);

  return statuses.find((s) => s.provider === provider)!;
}

export async function removeProviderKey(
  userId: string,
  provider: AIProviderName
): Promise<void> {
  await connectToDatabase();

  await UserAIProvider.deleteOne({ userId, provider });
}

/** Runs a live request against the provider to confirm the key works. */
export async function testProviderKey(
  userId: string,
  provider: AIProviderName,
  model?: string
): Promise<{ ok: boolean; error?: string }> {
  await connectToDatabase();

  const record = await UserAIProvider.findOne({ userId, provider });

  if (!record) {
    return { ok: false, error: "No API key saved for this provider yet." };
  }

  const apiKey = decrypt(record.encryptedApiKey);
  const result = await testProviderConnection({
    provider,
    apiKey,
    model: model || DEFAULT_MODELS[provider],
  });

  record.lastValidatedAt = new Date();
  record.lastValidationError = result.ok ? undefined : result.error;
  await record.save();

  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

/**
 * The actual BYOK priority chain used by every AI generation call site:
 * user's own active key for their preferred provider, falling back to the
 * platform key for that same provider, falling back to the platform's
 * default OpenRouter key as a last resort.
 */
export async function resolveAIClientConfig(
  userId: string | null
): Promise<AIClientConfig> {
  if (!userId) {
    return platformFallbackOrThrow("openrouter");
  }

  await connectToDatabase();

  const settings = await getOrCreateUserSettings(userId);
  const provider = settings.ai.preferredProvider;
  const model = settings.ai.preferredModel || DEFAULT_MODELS[provider];

  const userKey = await UserAIProvider.findOne({ userId, provider, isActive: true });

  if (userKey) {
    return { provider, apiKey: decrypt(userKey.encryptedApiKey), model };
  }

  const platformKey = getPlatformApiKey(provider);

  if (platformKey) {
    return { provider, apiKey: platformKey, model };
  }

  return platformFallbackOrThrow(provider);
}

function platformFallbackOrThrow(requestedProvider: AIProviderName): AIClientConfig {
  const openRouterKey = getPlatformApiKey("openrouter");

  if (openRouterKey) {
    return { provider: "openrouter", apiKey: openRouterKey, model: DEFAULT_MODELS.openrouter };
  }

  throw new NoApiKeyAvailableError(requestedProvider);
}

export type { UserAIProviderDocument };
