import { NextRequest, NextResponse } from "next/server";
import { getRepositoryInsights } from "@/lib/insights";
import { decodeRepoId } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { repoId } = await req.json();
    const ref = decodeRepoId(repoId);

    const insights = await getRepositoryInsights(ref);

    return NextResponse.json(insights);
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
