import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInsights } from "@/lib/insights";
import { getRepoPath } from "@/lib/github";

export async function POST(
  req: NextRequest
) {
  try {
    const { repoId } =
      await req.json();

    const insights =
      getRepositoryInsights(getRepoPath(repoId));

    return NextResponse.json(
      insights
    );
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