import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { UserActionType } from "@/types/UserActionTypes";
import { logUserActivity } from "@/lib/logActivity";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    await del(url);

    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    await logUserActivity(userId, UserActionType.FILE_DELETED, {
      ip: req?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: req?.headers?.get("user-agent") || "Unknown",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("File deletion failed:", error);
    return NextResponse.json(
      { error: "File deletion failed" },
      { status: 500 }
    );
  }
}
