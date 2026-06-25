import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOnboardingHistory } from "@/lib/onboardingStore";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const guides = await getOnboardingHistory(userId);

  return NextResponse.json({ success: true, guides });
}
