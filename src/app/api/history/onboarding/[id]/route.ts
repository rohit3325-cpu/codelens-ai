import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { deleteOnboardingGuide } from "@/lib/onboardingStore";

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
  const deleted = await deleteOnboardingGuide(userId, id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: "Onboarding guide not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
