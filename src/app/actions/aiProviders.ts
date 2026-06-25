"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  removeProviderKey,
  testProviderKey,
  upsertProviderKey,
} from "@/lib/aiProviderStore";
import type { AIProviderName } from "@/lib/aiProviders";

export async function saveProviderKeyAction(provider: AIProviderName, apiKey: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  if (!apiKey.trim()) {
    return { success: false as const, message: "An API key is required" };
  }

  const status = await upsertProviderKey(userId, provider, apiKey.trim());

  revalidatePath("/dashboard/settings");

  return { success: true as const, provider: status };
}

export async function removeProviderKeyAction(provider: AIProviderName) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  await removeProviderKey(userId, provider);

  revalidatePath("/dashboard/settings");

  return { success: true as const };
}

export async function testProviderKeyAction(provider: AIProviderName, model?: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  const result = await testProviderKey(userId, provider, model);

  return result.ok
    ? { success: true as const }
    : { success: false as const, message: result.error };
}
