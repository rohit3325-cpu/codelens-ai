import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { summarizeCode } from "@/lib/ai";
import { resolveAIClientConfig } from "@/lib/aiProviderStore";
import { decodeRepoId } from "@/lib/github";
import { getOrCreateRepositoryAnalysis } from "@/lib/repositoryStore";
import { saveSummary } from "@/lib/summaryStore";

export async function POST(req: NextRequest) {
  try {
    const { code, repoId, filePath } = await req.json();

    const { userId } = await auth();

    const config = await resolveAIClientConfig(userId);
    const summary = await summarizeCode(code, config);

    if (userId && repoId && filePath) {
      persistSummary(userId, repoId, filePath, summary).catch((error) => {
        console.error("Failed to persist summary history:", error);
      });
    }

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to summarize code",
      },
      {
        status: 500,
      }
    );
  }
}

async function persistSummary(
  userId: string,
  repoId: string,
  filePath: string,
  summary: string
) {
  const ref = decodeRepoId(repoId);
  const repoUrl = `https://github.com/${ref.owner}/${ref.repo}`;
  const repository = await getOrCreateRepositoryAnalysis(userId, repoUrl);

  await saveSummary(userId, repository._id.toString(), filePath, summary);
}
