import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSummaryHistory } from "@/lib/summaryStore";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const summaries = await getSummaryHistory(userId);

  return NextResponse.json({ success: true, summaries });
}
