import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { listProviderStatuses, upsertProviderKey } from "@/lib/aiProviderStore";
import type { AIProviderName } from "@/lib/aiProviders";

const VALID_PROVIDERS: AIProviderName[] = ["openai", "gemini", "claude", "openrouter"];

function isValidProvider(value: unknown): value is AIProviderName {
  return typeof value === "string" && VALID_PROVIDERS.includes(value as AIProviderName);
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const providers = await listProviderStatuses(userId);

  return NextResponse.json({ success: true, providers });
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
    const { provider, apiKey } = await req.json();

    if (!isValidProvider(provider)) {
      return NextResponse.json(
        { success: false, message: "Invalid provider" },
        { status: 400 }
      );
    }

    if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "An API key is required" },
        { status: 400 }
      );
    }

    const status = await upsertProviderKey(userId, provider, apiKey.trim());

    return NextResponse.json({ success: true, provider: status });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to save API key" },
      { status: 500 }
    );
  }
}
