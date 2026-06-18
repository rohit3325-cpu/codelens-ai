import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInsights } from "@/lib/insights";

export async function POST(
  req: NextRequest
) {
  try {
    const { repoPath } =
      await req.json();

    const insights =
      getRepositoryInsights(repoPath);

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