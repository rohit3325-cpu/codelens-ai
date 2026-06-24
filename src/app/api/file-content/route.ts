import { NextRequest, NextResponse } from "next/server";
import { decodeRepoId, getFileContent, GitHubApiError } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { repoId, filePath } = await req.json();
    const ref = decodeRepoId(repoId);

    const content = await getFileContent(ref.owner, ref.repo, ref.branch, filePath);

    return NextResponse.json({
      success: true,
      filePath,
      content,
    });
  } catch (error) {
    console.error(error);

    const status = error instanceof GitHubApiError ? error.status : 500;
    const message =
      error instanceof GitHubApiError && status === 404 ? "File not found" : "Failed to read file";

    return NextResponse.json({ success: false, message }, { status });
  }
}
