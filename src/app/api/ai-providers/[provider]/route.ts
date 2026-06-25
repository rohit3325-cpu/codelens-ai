import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { removeProviderKey } from "@/lib/aiProviderStore";
import type { AIProviderName } from "@/lib/aiProviders";

const VALID_PROVIDERS: AIProviderName[] = ["openai", "gemini", "claude", "openrouter"];

function isValidProvider(value: unknown): value is AIProviderName {
  return typeof value === "string" && VALID_PROVIDERS.includes(value as AIProviderName);
}

export async function DELETE(
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

  await removeProviderKey(userId, provider);

  return NextResponse.json({ success: true });
}
