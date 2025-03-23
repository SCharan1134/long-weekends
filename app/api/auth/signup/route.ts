import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateAndSendOtp } from "@/utils/generateAndSendOtp";
import { UserActionType } from "@/types/UserActionTypes";
import { logUserActivity } from "@/lib/logActivity";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Missing name, email, or password", {
        status: 400,
      });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exist) {
      return new NextResponse("User already exists", { status: 400 });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          isActive: true,
        },
      });
      await logUserActivity(user.id, UserActionType.ACCOUNT_CREATED, {
        ip: req?.headers?.get("x-forwarded-for") || "Unknown",
        userAgent: req?.headers?.get("user-agent") || "Unknown",
      });

      await generateAndSendOtp(email);
      return NextResponse.json(user);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
