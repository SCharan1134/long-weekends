import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOtp } from "@/utils/generateAndSendOtp";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Missing email", {
        status: 400,
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    await logUserActivity(user.id, UserActionType.OTP_SENT, {
      ip: req?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: req?.headers?.get("user-agent") || "Unknown",
    });
    await generateAndSendOtp(email);

    return new NextResponse("OTP Sent successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
