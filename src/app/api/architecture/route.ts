import { NextRequest, NextResponse } from "next/server";
import { getRepositoryContext } from "@/lib/repository";
import { generateArchitectureDiagram } from "@/lib/ai";
import { decodeRepoId } from "@/lib/github";

export async function POST(req: NextRequest) {
  try {
    const { repoId } = await req.json();
    const ref = decodeRepoId(repoId);

    const context = await getRepositoryContext(ref);

    const diagram = await generateArchitectureDiagram(context);

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
