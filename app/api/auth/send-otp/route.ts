import { NextRequest, NextResponse } from "next/server";
import { generateAndSendOtp } from "@/utils/generateAndSendOtp";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new NextResponse("Missing email", {
        status: 400,
      });
    }

    await generateAndSendOtp(email);

    return new NextResponse("OTP Sent successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
