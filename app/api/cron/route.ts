import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    for (const user of users) {
      // Count user activity logs
      const activityCount = await prisma.userActivityLog.count({
        where: { userId: user.id },
      });

      if (activityCount > 100) {
        // Fetch IDs of the oldest logs exceeding 100 entries
        const logsToDelete = await prisma.userActivityLog.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "asc" },
          take: activityCount - 100, // Get only the excess logs
          select: { id: true },
        });

        // Delete excess logs
        await prisma.userActivityLog.deleteMany({
          where: { id: { in: logsToDelete.map((log) => log.id) } },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Cleanup completed" });
  } catch (error) {
    console.error("Error cleaning up user activity logs:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
