import { NextRequest, NextResponse } from "next/server";
import { getRepositoryContext } from "@/lib/repository";
import { generateRepositoryOverview } from "@/lib/ai";
import { getRepoPath } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { repoId } = await req.json();

    const context = getRepositoryContext(getRepoPath(repoId));

    const overview =
      await generateRepositoryOverview(context);

    return NextResponse.json({
      success: true,
      overview,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate overview",
      },
      {
        status: 500,
      }
    );
  }
}