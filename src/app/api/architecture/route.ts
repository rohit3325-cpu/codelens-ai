import { NextRequest, NextResponse } from "next/server";
import { getRepositoryContext } from "@/lib/repository";
import { generateArchitectureDiagram } from "@/lib/ai";
import { getRepoPath } from "@/lib/github";

export async function POST(
  req: NextRequest
) {
  try {
    const { repoId } =
      await req.json();

    const context =
  getRepositoryContext(getRepoPath(repoId));

const trimmedContext =
  context.slice(0, 12000);

const diagram =
  await generateArchitectureDiagram(
    trimmedContext
  );

    return NextResponse.json({
      success: true,
      diagram,
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