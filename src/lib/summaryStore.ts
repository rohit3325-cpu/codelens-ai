import { connectToDatabase } from "@/lib/mongodb";
import { SummaryHistory, type SummaryHistoryDocument } from "@/models/SummaryHistory";
import { Repository } from "@/models/Repository";

export async function saveSummary(
  userId: string,
  repositoryId: string,
  filePath: string,
  content: string
): Promise<SummaryHistoryDocument> {
  await connectToDatabase();

  return SummaryHistory.create({ userId, repoId: repositoryId, filePath, content });
}

export interface SummaryHistoryItem {
  _id: string;
  repoId: string;
  repoName: string;
  filePath: string;
  content: string;
  createdAt: Date;
}

export async function getSummaryHistory(userId: string): Promise<SummaryHistoryItem[]> {
  await connectToDatabase();

  const summaries = await SummaryHistory.find({ userId }).sort({ createdAt: -1 }).lean();
  const repoIds = [...new Set(summaries.map((s) => String(s.repoId)))];

  const repositories = await Repository.find({ _id: { $in: repoIds } })
    .select("repoName")
    .lean();

  const nameById = new Map(repositories.map((r) => [String(r._id), r.repoName]));

  return summaries.map((s) => ({
    _id: String(s._id),
    repoId: String(s.repoId),
    repoName: nameById.get(String(s.repoId)) ?? "Unknown repository",
    filePath: s.filePath,
    content: s.content,
    createdAt: s.createdAt,
  }));
}

export async function deleteSummary(userId: string, summaryId: string): Promise<boolean> {
  await connectToDatabase();

  const result = await SummaryHistory.deleteOne({ _id: summaryId, userId });

  return result.deletedCount > 0;
}
