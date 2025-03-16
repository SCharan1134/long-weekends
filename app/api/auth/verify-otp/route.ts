import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new NextResponse("Missing email, or Otp", {
        status: 400,
      });
    }
    const storedOTP = await prisma.oTP.findUnique({
      where: { email },
    });

    if (!storedOTP)
      return new NextResponse("Invalid Otp", {
        status: 202,
      });

    if (new Date() > storedOTP.expiresAt) {
      await prisma.oTP.delete({ where: { email } });

      return new NextResponse("OTP expired", {
        status: 202,
      });
    }

    const isMatch = await bcrypt.compare(otp, storedOTP.otp);
    if (!isMatch)
      return new NextResponse("Invalid Otp", {
        status: 202,
      });

    const date = new Date();
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        isEmailVerified: true,
        emailVerified: date,
      },
    });

    await prisma.oTP.delete({ where: { email } });

    return new NextResponse("OTP verified successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
