import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { action, userIds } = await request.json();

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: "Invalid request. Action and userIds array are required." },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "activate":
        result = await prisma.user.updateMany({
          where: {
            id: {
              in: userIds,
            },
          },
          data: {
            isActive: true,
            lastActive: new Date(),
          },
        });

        break;

      case "deactivate":
        result = await prisma.user.updateMany({
          where: {
            id: {
              in: userIds,
            },
          },
          data: {
            isActive: false,
          },
        });
        break;

      case "delete":
        result = await prisma.user.deleteMany({
          where: {
            id: {
              in: userIds,
            },
          },
        });
        break;

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: activate, deactivate, delete",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${action} operation completed successfully`,
      affected: result.count,
    });
  } catch (error) {
    console.error(`Error performing bulk action:`, error);
    return NextResponse.json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}
