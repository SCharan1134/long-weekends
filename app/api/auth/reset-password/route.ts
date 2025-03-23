import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing email, or password", {
        status: 400,
      });
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!exist) {
      return new NextResponse("User didn't exist", { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.update({
      where: { email: email },
      data: {
        password: hashedPassword,
      },
    });
    await logUserActivity(user.id, UserActionType.PASSWORD_RESET, {
      ip: req?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: req?.headers?.get("user-agent") || "Unknown",
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
