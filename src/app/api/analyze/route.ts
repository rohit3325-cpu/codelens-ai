import { NextResponse } from "next/server";
import { encodeRepoId, resolveRepoRef, GitHubApiError } from "@/lib/github";
import { listRepositoryFiles } from "@/lib/repository";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { success: false, message: "A GitHub repository URL is required." },
        { status: 400 }
      );
    }

    const ref = await resolveRepoRef(repoUrl);
    const files = await listRepositoryFiles(ref);

    return NextResponse.json({
      success: true,
      repoName: encodeRepoId(ref),
      totalFiles: files.length,
      files,
    });
  } catch (error) {
    console.error(error);

    const status = error instanceof GitHubApiError ? error.status : 500;
    const message =
      error instanceof GitHubApiError ? error.message : "Failed to analyze repository";

    return NextResponse.json({ success: false, message }, { status });
  }
}
