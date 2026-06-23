import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getRepoPath } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { repoId, filePath } = await req.json();

    const fullPath = path.join(getRepoPath(repoId), filePath);

    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        {
          success: false,
          message: "File not found",
        },
        {
          status: 404,
        }
      );
    }

    const content = fs.readFileSync(fullPath, "utf-8");

    return NextResponse.json({
      success: true,
      filePath,
      content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to read file",
      },
      {
        status: 500,
      }
    );
  }
}