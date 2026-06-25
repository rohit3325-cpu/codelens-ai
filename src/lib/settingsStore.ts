import { connectToDatabase } from "@/lib/mongodb";
import { UserSettings, type UserSettingsDocument } from "@/models/UserSettings";
import { Repository } from "@/models/Repository";
import { Chat } from "@/models/Chat";
import { SummaryHistory } from "@/models/SummaryHistory";
import { OnboardingGuide } from "@/models/OnboardingGuide";

export type SettingsUpdate = Partial<{
  theme: UserSettingsDocument["theme"];
  defaultDashboardTab: UserSettingsDocument["defaultDashboardTab"];
  ai: Partial<UserSettingsDocument["ai"]>;
  autoGenerate: Partial<UserSettingsDocument["autoGenerate"]>;
}>;

export async function getOrCreateUserSettings(
  userId: string
): Promise<UserSettingsDocument> {
  await connectToDatabase();

  const existing = await UserSettings.findOne({ userId });

  if (existing) {
    return existing;
  }

  try {
    return await UserSettings.create({ userId });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const winner = await UserSettings.findOne({ userId });

      if (winner) {
        return winner;
      }
    }

    throw error;
  }
}

export async function updateUserSettings(
  userId: string,
  update: SettingsUpdate
): Promise<UserSettingsDocument> {
  await connectToDatabase();

  await getOrCreateUserSettings(userId);

  const setOps: Record<string, unknown> = {};

  if (update.theme) setOps.theme = update.theme;
  if (update.defaultDashboardTab) setOps.defaultDashboardTab = update.defaultDashboardTab;

  if (update.ai) {
    for (const [key, value] of Object.entries(update.ai)) {
      if (value !== undefined) setOps[`ai.${key}`] = value;
    }
  }

  if (update.autoGenerate) {
    for (const [key, value] of Object.entries(update.autoGenerate)) {
      if (value !== undefined) setOps[`autoGenerate.${key}`] = value;
    }
  }

  const updated = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: setOps },
    { new: true }
  );

  if (!updated) {
    throw new Error("Failed to update settings");
  }

  return updated;
}

export interface UsageCounts {
  totalRepositories: number;
  totalChats: number;
  totalSummaries: number;
  totalOnboardingGuides: number;
}

export async function getUsageCounts(userId: string): Promise<UsageCounts> {
  await connectToDatabase();

  const [totalRepositories, totalChats, totalSummaries, totalOnboardingGuides] =
    await Promise.all([
      Repository.countDocuments({ userId }),
      Chat.countDocuments({ userId }),
      SummaryHistory.countDocuments({ userId }),
      OnboardingGuide.countDocuments({ userId }),
    ]);

  return { totalRepositories, totalChats, totalSummaries, totalOnboardingGuides };
}

const DUPLICATE_KEY_ERROR_CODE = 11000;

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === DUPLICATE_KEY_ERROR_CODE
  );
}
