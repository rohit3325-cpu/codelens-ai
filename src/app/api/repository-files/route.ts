import { NextRequest, NextResponse } from "next/server";
import { decodeRepoId } from "@/lib/github";
import { listRepositoryFiles } from "@/lib/repository";

export async function POST(req: NextRequest) {
  try {
    const { repoId } = await req.json();
    const ref = decodeRepoId(repoId);

    const files = await listRepositoryFiles(ref);

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
