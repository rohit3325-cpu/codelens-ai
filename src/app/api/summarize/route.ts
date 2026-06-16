import { NextRequest, NextResponse } from "next/server";
import { summarizeCode } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    const summary = await summarizeCode(code);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to summarize code",
      },
      {
        status: 500,
      }
    );
  }
}