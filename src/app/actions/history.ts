"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteChatThread } from "@/lib/historyStore";
import { deleteSummary } from "@/lib/summaryStore";
import { deleteOnboardingGuide } from "@/lib/onboardingStore";

export async function deleteChatThreadAction(repositoryId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  const deleted = await deleteChatThread(userId, repositoryId);

  revalidatePath("/dashboard/history");

  return deleted
    ? { success: true as const }
    : { success: false as const, message: "Chat thread not found" };
}

export async function deleteSummaryAction(summaryId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  const deleted = await deleteSummary(userId, summaryId);

  revalidatePath("/dashboard/history");

  return deleted
    ? { success: true as const }
    : { success: false as const, message: "Summary not found" };
}

export async function deleteOnboardingGuideAction(guideId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  const deleted = await deleteOnboardingGuide(userId, guideId);

  revalidatePath("/dashboard/history");

  return deleted
    ? { success: true as const }
    : { success: false as const, message: "Onboarding guide not found" };
}
