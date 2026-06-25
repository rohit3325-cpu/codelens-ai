import { connectToDatabase } from "@/lib/mongodb";
import { Chat } from "@/models/Chat";
import { Repository } from "@/models/Repository";

export interface ChatHistoryGroup {
  repositoryId: string;
  repoName: string;
  messageCount: number;
  lastMessageAt: Date;
}

/** Chat threads are grouped by repository — deleting one clears that whole conversation. */
export async function getChatHistoryGrouped(userId: string): Promise<ChatHistoryGroup[]> {
  await connectToDatabase();

  const groups = await Chat.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$repositoryId",
        messageCount: { $sum: 1 },
        lastMessageAt: { $max: "$createdAt" },
      },
    },
    { $sort: { lastMessageAt: -1 } },
  ]);

  const repositoryIds = groups.map((g) => g._id);
  const repositories = await Repository.find({ _id: { $in: repositoryIds } })
    .select("repoName")
    .lean();

  const nameById = new Map(repositories.map((r) => [String(r._id), r.repoName]));

  return groups.map((g) => ({
    repositoryId: String(g._id),
    repoName: nameById.get(String(g._id)) ?? "Unknown repository",
    messageCount: g.messageCount,
    lastMessageAt: g.lastMessageAt,
  }));
}

export async function getChatMessages(userId: string, repositoryId: string) {
  await connectToDatabase();

  return Chat.find({ userId, repositoryId }).sort({ createdAt: 1 }).lean();
}

export async function deleteChatThread(
  userId: string,
  repositoryId: string
): Promise<boolean> {
  await connectToDatabase();

  const result = await Chat.deleteMany({ userId, repositoryId });

  return result.deletedCount > 0;
}
