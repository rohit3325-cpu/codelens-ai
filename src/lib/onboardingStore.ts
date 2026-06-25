import { connectToDatabase } from "@/lib/mongodb";
import { Repository } from "@/models/Repository";
import { OnboardingGuide, type OnboardingGuideDocument } from "@/models/OnboardingGuide";
import { getRepositoryContext } from "@/lib/repository";
import { generateOnboardingGuide } from "@/lib/ai";
import { resolveAIClientConfig } from "@/lib/aiProviderStore";

export class RepositoryNotFoundError extends Error {
  constructor() {
    super("Repository not found");
    this.name = "RepositoryNotFoundError";
  }
}

/**
 * Generates a fresh onboarding guide for a saved repository, appends it to
 * the OnboardingGuide history collection, and refreshes the quick-access
 * cache field on the Repository document itself.
 */
export async function generateAndSaveOnboardingGuide(
  userId: string,
  repositoryId: string
): Promise<OnboardingGuideDocument> {
  await connectToDatabase();

  const repository = await Repository.findOne({ _id: repositoryId, userId });

  if (!repository) {
    throw new RepositoryNotFoundError();
  }

  const ref = {
    owner: repository.owner,
    repo: repository.repo,
    branch: repository.branch,
  };

  const context = await getRepositoryContext(ref);
  const config = await resolveAIClientConfig(userId);
  const content = await generateOnboardingGuide(context, config);

  const guide = await OnboardingGuide.create({
    userId,
    repoId: repository._id,
    repoName: repository.repoName,
    content,
  });

  repository.onboardingGuide = content;
  await repository.save();

  return guide;
}

export async function getLatestOnboardingGuide(
  userId: string,
  repositoryId: string
): Promise<OnboardingGuideDocument | null> {
  await connectToDatabase();

  return OnboardingGuide.findOne({ userId, repoId: repositoryId })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getOnboardingHistory(userId: string) {
  await connectToDatabase();

  return OnboardingGuide.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function deleteOnboardingGuide(
  userId: string,
  guideId: string
): Promise<boolean> {
  await connectToDatabase();

  const result = await OnboardingGuide.deleteOne({ _id: guideId, userId });

  return result.deletedCount > 0;
}
