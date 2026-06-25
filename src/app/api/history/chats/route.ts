import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChatHistoryGrouped } from "@/lib/historyStore";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const threads = await getChatHistoryGrouped(userId);

  return NextResponse.json({ success: true, threads });
}
