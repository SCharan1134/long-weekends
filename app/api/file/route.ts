import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import { UserActionType } from "@/types/UserActionTypes";
import { logUserActivity } from "@/lib/logActivity";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file || !file.name) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, {
      access: "public",
    });

    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    await logUserActivity(userId, UserActionType.FILE_UPLOADED, {
      ip: req?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: req?.headers?.get("user-agent") || "Unknown",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("File upload failed:", error);
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
