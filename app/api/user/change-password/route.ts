import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import bcrypt from "bcryptjs";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing currentPassword, newPassword", {
        status: 400,
      });
    }
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const password = user!.password as string;
    const isMatch = await bcrypt.compare(currentPassword, password);
    if (!isMatch)
      return new NextResponse("Wrong currentPassword", {
        status: 202,
      });
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    await logUserActivity(user.id, UserActionType.PASSWORD_UPDATED, {
      ip: req?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: req?.headers?.get("user-agent") || "Unknown",
    });
    return NextResponse.json(
      { message: "successfully updated password" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
