import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  generateAndSaveOnboardingGuide,
  getLatestOnboardingGuide,
  RepositoryNotFoundError,
} from "@/lib/onboardingStore";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const repositoryId = req.nextUrl.searchParams.get("repositoryId");

  if (!repositoryId) {
    return NextResponse.json(
      { success: false, message: "repositoryId is required" },
      { status: 400 }
    );
  }

  const guide = await getLatestOnboardingGuide(userId, repositoryId);

  return NextResponse.json({ success: true, guide });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { repositoryId } = await req.json();

    if (!repositoryId || typeof repositoryId !== "string") {
      return NextResponse.json(
        { success: false, message: "repositoryId is required" },
        { status: 400 }
      );
    }

    const guide = await generateAndSaveOnboardingGuide(userId, repositoryId);

    return NextResponse.json({ success: true, guide });
  } catch (error) {
    console.error(error);

    const status = error instanceof RepositoryNotFoundError ? 404 : 500;
    const message =
      error instanceof RepositoryNotFoundError
        ? error.message
        : "Failed to generate onboarding guide";

    return NextResponse.json({ success: false, message }, { status });
  }
}
