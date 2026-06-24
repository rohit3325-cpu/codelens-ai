import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Repository } from "@/models/Repository";
import { getOrCreateRepositoryAnalysis } from "@/lib/repositoryStore";
import { GitHubApiError } from "@/lib/github";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await connectToDatabase();

  const repositories = await Repository.find({ userId })
    .sort({ analyzedAt: -1 })
    .lean();

  return NextResponse.json({ success: true, repositories });
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
