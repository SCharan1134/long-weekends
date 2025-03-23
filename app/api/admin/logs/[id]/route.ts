import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// GET /api/user-logs/[id] - Get user activity logs by user ID
export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const id = params.id;
    const logs = await prisma.userActivityLog.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      include: {
        // Use include to get user details
        user: {
          select: {
            // Select only the fields you need
            email: true,
            name: true,
            id: true,
            image: true,
          },
        },
      },
    });

    if (!logs.length) {
      return NextResponse.json(
        { error: "No activity logs found for this user" },
        { status: 404 }
      );
    }

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch user logs" },
      { status: 500 }
    );
  }
}
