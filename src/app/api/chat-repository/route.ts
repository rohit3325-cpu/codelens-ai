import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRepositoryContext } from "@/lib/repository";
import { chatWithRepository } from "@/lib/ai";
import { decodeRepoId } from "@/lib/github";
import { appendChatMessage, getOrCreateRepositoryAnalysis } from "@/lib/repositoryStore";
import { resolveAIClientConfig } from "@/lib/aiProviderStore";

export async function POST(req: NextRequest) {
  try {
    const { repoId, question } = await req.json();
    const ref = decodeRepoId(repoId);

    const { userId } = await auth();

    const [context, config] = await Promise.all([
      getRepositoryContext(ref),
      resolveAIClientConfig(userId),
    ]);

    const answer = await chatWithRepository(context, question, config);

    // Persisting chat history is a best-effort side effect — a DB hiccup
    // should never block the user from getting their answer.
    if (userId) {
      persistChatTurn(userId, ref, question, answer).catch((error) => {
        console.error("Failed to persist chat history:", error);
      });
    }

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

async function persistChatTurn(
  userId: string,
  ref: { owner: string; repo: string },
  question: string,
  answer: string
) {
  const repoUrl = `https://github.com/${ref.owner}/${ref.repo}`;
  const repository = await getOrCreateRepositoryAnalysis(userId, repoUrl);

  const repositoryId = repository._id.toString();

  await appendChatMessage(repositoryId, userId, "user", question);
  await appendChatMessage(repositoryId, userId, "assistant", answer);
}
