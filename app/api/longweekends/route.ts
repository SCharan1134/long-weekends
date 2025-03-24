import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";

export interface LongWeekend {
  id: string;
  holiday: {
    date: string;
    name: string;
  };
  suggestedLeaves: { date: string; day: string; type: "paid" | "unpaid" }[];
  totalDaysOff: number;
  paidLeavesUsed: number;
  unpaidLeavesUsed: number;
  totalDays: {
    date: string;
    day: string;
    type: "holiday" | "paid" | "unpaid" | "weekend";
  }[];
}

// API Handler
export async function GET() {
  try {
    // const { searchParams } = new URL(request.url);
    // const userId = searchParams.get("userId") || "";

    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // const longWeekends = await getLongWeekends(1, 10);
    const longWeekends = await prisma.longWeekend.findMany({
      where: {
        userId: userId,
      },
      include: {
        holiday: true,
        suggestedLeaves: true,
        totalDays: true,
      },
    });
    return NextResponse.json(longWeekends);
  } catch (error) {
    console.error("Error fetching long weekends:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
