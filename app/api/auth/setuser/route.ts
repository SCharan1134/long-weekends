import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, salary, paidLeaves, unpaidLeaves, companyName } = body;

    if (!salary || !email || !companyName || !paidLeaves || !unpaidLeaves) {
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
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("An error occurred:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
