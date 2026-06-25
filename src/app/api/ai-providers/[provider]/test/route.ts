import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { testProviderKey } from "@/lib/aiProviderStore";
import type { AIProviderName } from "@/lib/aiProviders";

const VALID_PROVIDERS: AIProviderName[] = ["openai", "gemini", "claude", "openrouter"];

function isValidProvider(value: unknown): value is AIProviderName {
  return typeof value === "string" && VALID_PROVIDERS.includes(value as AIProviderName);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { provider } = await params;

  if (!isValidProvider(provider)) {
    return NextResponse.json(
      { success: false, message: "Invalid provider" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const model = typeof body?.model === "string" ? body.model : undefined;

  const result = await testProviderKey(userId, provider, model);

  return NextResponse.json({ success: result.ok, error: result.ok ? undefined : result.error });
}
