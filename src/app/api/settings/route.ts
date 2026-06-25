import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getOrCreateUserSettings,
  updateUserSettings,
  type SettingsUpdate,
} from "@/lib/settingsStore";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const settings = await getOrCreateUserSettings(userId);

  return NextResponse.json({ success: true, settings });
}

export async function PUT(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const update: SettingsUpdate = await req.json();

    const settings = await updateUserSettings(userId, update);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    );
  }
}
