import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUsageCounts } from "@/lib/settingsStore";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const usage = await getUsageCounts(userId);

  return NextResponse.json({ success: true, usage });
}
