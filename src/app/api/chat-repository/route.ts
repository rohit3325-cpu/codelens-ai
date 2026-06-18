import { NextRequest, NextResponse } from "next/server";
import { getRepositoryContext } from "@/lib/repository";
import { chatWithRepository } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { repoPath, question } =
      await req.json();

    const context =
      getRepositoryContext(repoPath);

    const answer =
      await chatWithRepository(
        context,
        question
      );

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}