import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getChatMessages, deleteChatThread } from "@/lib/historyStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { repositoryId } = await params;
  const messages = await getChatMessages(userId, repositoryId);

  return NextResponse.json({ success: true, messages });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ repositoryId: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { repositoryId } = await params;
  const deleted = await deleteChatThread(userId, repositoryId);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Chat thread not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
