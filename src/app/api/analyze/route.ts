import { NextResponse } from "next/server";
import { cloneRepository } from "@/lib/github";
import { scanDirectory } from "@/lib/scanner";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();

    const repo = await cloneRepository(repoUrl);

    const files = scanDirectory(repo.repoPath);
     console.log("Repo Path:", repo.repoPath);
    return NextResponse.json({
      success: true,
      repoName: repo.repoName,
      repoPath: repo.repoPath,
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze repository",
      },
      {
        status: 500,
      }
    );
  }
}