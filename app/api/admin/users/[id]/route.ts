import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const userId = params.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const userId = params.id;
    const userData = await request.json();

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If email is being changed, check if it's already in use
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: userData,
    });
    await logUserActivity(updatedUser.id, UserActionType.ADMIN_UPDATED_USER, {
      ip: request?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers?.get("user-agent") || "Unknown",
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const userId = params.id;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });
    await logUserActivity(userId, UserActionType.ACCOUNT_DELETED, {
      ip: request?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers?.get("user-agent") || "Unknown",
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
