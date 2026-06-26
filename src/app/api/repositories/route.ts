import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Repository } from "@/models/Repository";
import { getOrCreateRepositoryAnalysis } from "@/lib/repositoryStore";
import { GitHubApiError, parseGitHubUrl } from "@/lib/github";
import { getActivePlan, startOfCurrentMonth } from "@/lib/subscriptionStore";
import { FREE_PLAN_REPO_LIMIT } from "@/lib/plans";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectToDatabase();

  const search = req.nextUrl.searchParams.get("q")?.trim();

  const query = search
    ? { userId, repoName: { $regex: escapeRegExp(search), $options: "i" } }
    : { userId };

  const repositories = await Repository.find(query)
    .sort({ analyzedAt: -1 })
    .lean();

  return NextResponse.json({ success: true, repositories });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { repoUrl } = await req.json();

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { success: false, message: "A GitHub repository URL is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { owner, repo } = parseGitHubUrl(repoUrl);
    const alreadyTracked = await Repository.exists({ userId, owner, repo });

    if (!alreadyTracked) {
      const { plan } = await getActivePlan(userId);

      if (plan === "free") {
        const usedThisMonth = await Repository.countDocuments({
          userId,
          analyzedAt: { $gte: startOfCurrentMonth() },
        });

        if (usedThisMonth >= FREE_PLAN_REPO_LIMIT) {
          return NextResponse.json(
            {
              success: false,
              message: `You've used all ${FREE_PLAN_REPO_LIMIT} repository analyses included in the Free plan this month. Upgrade to Pro for unlimited repositories, or wait until next month.`,
            },
            { status: 403 }
          );
        }
      }
    }

    const repository = await getOrCreateRepositoryAnalysis(userId, repoUrl);

    return NextResponse.json({ success: true, repository });
  } catch (error) {
    console.error(error);

    const status = error instanceof GitHubApiError ? error.status : 500;
    const message =
      error instanceof GitHubApiError
        ? error.message
        : "Failed to save repository analysis";

    return NextResponse.json({ success: false, message }, { status });
  }
}
