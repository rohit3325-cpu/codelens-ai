import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { repoPath, filePath } = await req.json();

    const fullPath = path.join(repoPath, filePath);

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