import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getRepositoryContext } from "@/lib/repository";
import { generateRepositoryOverview } from "@/lib/ai";
import { decodeRepoId } from "@/lib/github";
import { resolveAIClientConfig } from "@/lib/aiProviderStore";

export async function POST(req: NextRequest) {
  try {
    const { repoId } = await req.json();
    const ref = decodeRepoId(repoId);

    const { userId } = await auth();

    const [context, config] = await Promise.all([
      getRepositoryContext(ref),
      resolveAIClientConfig(userId),
    ]);

    const overview = await generateRepositoryOverview(context, config);

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
