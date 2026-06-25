"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateUserSettings, type SettingsUpdate } from "@/lib/settingsStore";

export async function updateSettingsAction(update: SettingsUpdate) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  const settings = await updateUserSettings(userId, update);

  revalidatePath("/dashboard/settings");

  return { success: true as const, settings: JSON.parse(JSON.stringify(settings)) };
}
