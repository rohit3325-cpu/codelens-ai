"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { deleteRepositoryCascade } from "@/lib/repositoryStore";

export async function deleteRepositoryAction(repositoryId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false as const, message: "Unauthorized" };
  }

  const deleted = await deleteRepositoryCascade(userId, repositoryId);

  if (!deleted) {
    return { success: false as const, message: "Repository not found" };
  }

  revalidatePath("/dashboard/repositories");
  revalidatePath("/dashboard/history");

  return { success: true as const };
}
