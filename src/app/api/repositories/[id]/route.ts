import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { Repository } from "@/models/Repository";
import { Chat } from "@/models/Chat";
import { deleteRepositoryCascade } from "@/lib/repositoryStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid repository id" },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const repository = await Repository.findOne({ _id: id, userId }).lean();

  if (!repository) {
    return NextResponse.json(
      { success: false, message: "Repository not found" },
      { status: 404 }
    );
  }

  const chatHistory = await Chat.find({ repositoryId: id, userId })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ success: true, repository, chatHistory });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid repository id" },
      { status: 400 }
    );
  }

  const deleted = await deleteRepositoryCascade(userId, id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Repository not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
