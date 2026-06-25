"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  generateAndSaveOnboardingGuide,
  RepositoryNotFoundError,
} from "@/lib/onboardingStore";

export async function generateOnboardingGuideAction(repositoryId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  try {
    const guide = await generateAndSaveOnboardingGuide(userId, repositoryId);

    revalidatePath("/dashboard/onboarding");
    revalidatePath("/dashboard/history");

    return { success: true as const, guide: JSON.parse(JSON.stringify(guide)) };
  } catch (error) {
    const message =
      error instanceof RepositoryNotFoundError
        ? error.message
        : "Failed to generate onboarding guide";

    return { success: false as const, message };
  }
}
