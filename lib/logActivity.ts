"use server";
import prisma from "@/lib/prisma";

export async function logUserActivity(
  userId: string,
  action: string,
  metadata?: object
) {
  try {
    await prisma.userActivityLog.create({
      data: {
        userId,
        action,
        metadata: metadata ? metadata : undefined,
      },
    });
  } catch (error) {
    console.error("Failed to log user activity:", error);
  }
}
