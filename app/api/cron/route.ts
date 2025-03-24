import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all users
    console.log("Cron job started");
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Count user activity logs
      console.log(`Processing user ID: ${user.id}`);
      const activityCount = await prisma.userActivityLog.count({
        where: { userId: user.id },
      });
      console.log(`User ID: ${user.id} has ${activityCount} activity logs`);

      if (activityCount > 100) {
        console.log(
          `User ID: ${user.id} has more than 100 logs, preparing to delete excess logs`
        );
        // Fetch IDs of the oldest logs exceeding 100 entries
        const logsToDelete = await prisma.userActivityLog.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "asc" },
          take: activityCount - 100, // Get only the excess logs
          select: { id: true },
        });
        console.log(
          `User ID: ${user.id} will delete ${logsToDelete.length} logs`
        );

        // Delete excess logs
        await prisma.userActivityLog.deleteMany({
          where: { id: { in: logsToDelete.map((log) => log.id) } },
        });
        console.log(`Deleted logs for user ID: ${user.id}`);
      } else {
        console.log(
          `User ID: ${user.id} has 100 or fewer logs, no action taken`
        );
      }
    }
    console.log("Cleanup completed successfully");

    return NextResponse.json({ success: true, message: "Cleanup completed" });
  } catch (error) {
    console.error("Error cleaning up user activity logs:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
