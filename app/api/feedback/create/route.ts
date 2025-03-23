import { logUserActivity } from "@/lib/logActivity";
import prisma from "@/lib/prisma";
import { UserActionType } from "@/types/UserActionTypes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, inquiryType, message } = body;

    if (!name || !email || !inquiryType || !message) {
      return new NextResponse("Missing name, email, type,message", {
        status: 400,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate inquiry type
    const validTypes = ["general", "bug", "feedback", "other"];
    if (!validTypes.includes(inquiryType)) {
      return NextResponse.json(
        { error: "Invalid inquiry type" },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        name: name,
        email: email,
        inquiryType: inquiryType,
        message: message,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      await logUserActivity(user.id, UserActionType.FEEDBACK_SUBMITTED, {
        ip: req?.headers?.get("x-forwarded-for") || "Unknown",
        userAgent: req?.headers?.get("user-agent") || "Unknown",
      });
    }

    return NextResponse.json(feedback, { status: 200 });
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
