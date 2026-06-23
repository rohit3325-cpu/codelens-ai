import { NextRequest, NextResponse } from "next/server";
import { scanDirectory } from "@/lib/scanner";
import { getRepoPath } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { repoId } = await req.json();

    const files = scanDirectory(getRepoPath(repoId));

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to list repository files",
      },
      {
        status: 500,
      }
    );
  }
}
