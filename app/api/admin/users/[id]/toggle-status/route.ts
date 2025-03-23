import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

export async function PATCH(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const userId = params.id;
    // Find the user to get current status
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Toggle the status
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isActive: !user.isActive,
        lastActive: !user.isActive ? new Date() : undefined,
      },
    });

    await logUserActivity(
      updatedUser.id,
      UserActionType.ADMIN_TOGGLED_STATUS_USER,
      {
        ip: request?.headers?.get("x-forwarded-for") || "Unknown",
        userAgent: request?.headers?.get("user-agent") || "Unknown",
      }
    );

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error toggling user status:", error);
    return NextResponse.json(
      { error: "Failed to toggle user status" },
      { status: 500 }
    );
  }
}
