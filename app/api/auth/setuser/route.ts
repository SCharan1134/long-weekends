import { logUserActivity } from "@/lib/logActivity";
import prisma from "@/lib/prisma";
import { UserActionType } from "@/types/UserActionTypes";
import { processLongWeekends } from "@/utils/processLongWeekends";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Received request:", req);
    const body = await req.json();
    const { email, salary, paidLeaves, unpaidLeaves, companyName } = body;
    console.log("Parsed body:", body);

    if (!salary || !email || !companyName || !paidLeaves || !unpaidLeaves) {
      console.log("Validation failed:", {
        salary,
        email,
        companyName,
        paidLeaves,
        unpaidLeaves,
      });
      return new NextResponse("Missing name, email, or password", {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.log("User not found for email:", email);
      return new NextResponse("User not found", { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        salary: salary,
        paidLeaves: paidLeaves,
        unpaidLeaves: unpaidLeaves,
        companyName: companyName,
      },
    });
    console.log("User updated successfully:", updatedUser);

    // console.log("Logging user activity...");
    // await logUserActivity(user.id, UserActionType.PROFILE_UPDATED, {
    //   ip: req?.headers?.get("x-forwarded-for") || "Unknown",
    //   userAgent: req?.headers?.get("user-agent") || "Unknown",
    // });
    // console.log("User activity logged successfully");

    // console.log("Processing long weekends...");
    // await processLongWeekends(user.id);
    // console.log("Long weekends processed successfully");

    Promise.all([
      logUserActivity(user.id, UserActionType.PROFILE_UPDATED, {
        ip: req.headers.get("x-forwarded-for") || "Unknown",
        userAgent: req.headers.get("user-agent") || "Unknown",
      }),
      processLongWeekends(user.id),
    ])
      .then(() => console.log("Background tasks completed successfully"))
      .catch((error) =>
        console.error("Error processing background tasks:", error)
      );

    console.log("Returning updated user:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
