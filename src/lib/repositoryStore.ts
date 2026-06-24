import { connectToDatabase } from "@/lib/mongodb";
import { Repository, type RepositoryDocument } from "@/models/Repository";
import { Chat, type ChatRole } from "@/models/Chat";
import {
  encodeRepoId,
  parseGitHubUrl,
  resolveRepoRef,
} from "@/lib/github";
import { getRepositoryContext, listRepositoryFiles } from "@/lib/repository";
import { computeRepositoryHealth, getRepositoryInsights } from "@/lib/insights";
import {
  generateArchitectureDiagram,
  generateOnboardingGuide,
  generateRepositoryOverview,
} from "@/lib/ai";

const DUPLICATE_KEY_ERROR_CODE = 11000;

/**
 * Returns the cached analysis for this user+repository if one exists.
 * Otherwise runs the full analysis pipeline (GitHub fetch + AI generation)
 * once and persists it, so subsequent calls are a single cheap lookup.
 */
export async function getOrCreateRepositoryAnalysis(
  userId: string,
  repoUrl: string
): Promise<RepositoryDocument> {
  await connectToDatabase();

  const { owner, repo } = parseGitHubUrl(repoUrl);

  const existing = await Repository.findOne({ userId, owner, repo });

  if (existing) {
    return existing;
  }

  const ref = await resolveRepoRef(repoUrl);
  const repoId = encodeRepoId(ref);

  const [context, files, insights] = await Promise.all([
    getRepositoryContext(ref),
    listRepositoryFiles(ref),
    getRepositoryInsights(ref),
  ]);

  const [overview, architectureDiagram, onboardingGuide] = await Promise.all([
    generateRepositoryOverview(context),
    generateArchitectureDiagram(context),
    generateOnboardingGuide(context),
  ]);

  const repositoryHealth = computeRepositoryHealth(insights);

  try {
    return await Repository.create({
      userId,
      repoUrl,
      repoName: `${ref.owner}/${ref.repo}`,
      repoId,
      owner: ref.owner,
      repo: ref.repo,
      branch: ref.branch,
      overview,
      architectureDiagram,
      onboardingGuide,
      repositoryHealth,
      totalFiles: files.length,
      analyzedAt: new Date(),
    });
  } catch (error) {
    // Two concurrent requests for the same never-before-seen repo can both
    // miss the cache check above; the unique index then rejects the loser.
    // Treat that as a cache hit rather than an error.
    if (isDuplicateKeyError(error)) {
      const winner = await Repository.findOne({ userId, owner, repo });

      if (winner) {
        return winner;
      }
    }

    throw error;
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === DUPLICATE_KEY_ERROR_CODE
  );
}

export async function getRepositoryChatHistory(
  repositoryId: string,
  userId: string
) {
  await connectToDatabase();

  return Chat.find({ repositoryId, userId }).sort({ createdAt: 1 }).lean();
}

export async function appendChatMessage(
  repositoryId: string,
  userId: string,
  role: ChatRole,
  content: string
) {
  await connectToDatabase();

  return Chat.create({ repositoryId, userId, role, content });
}
