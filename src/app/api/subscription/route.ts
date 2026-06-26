import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSubscriptionSummary } from "@/lib/subscriptionStore";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const summary = await getSubscriptionSummary(userId);

  return NextResponse.json({ success: true, ...summary });
}
