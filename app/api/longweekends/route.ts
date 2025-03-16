import dayjs from "dayjs";
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

// Function to calculate long weekends using paid/unpaid leaves
const getLongWeekends = async (
  paidLeaves: number,
  unpaidLeaves: number
): Promise<LongWeekend[]> => {
  const holidays = await prisma.holiday.findMany();
  const longWeekends: LongWeekend[] = [];

  let remainingPaidLeaves = paidLeaves;
  let remainingUnpaidLeaves = unpaidLeaves;

  holidays.forEach((holiday) => {
    const holidayDate = dayjs(holiday.date);
    const dayOfWeek = holidayDate.day(); // 0 = Sunday, 6 = Saturday
    const suggestedLeaves: {
      date: string;
      day: string;
      type: "paid" | "unpaid";
    }[] = [];
    const totalDays: {
      date: string;
      day: string;
      type: "holiday" | "paid" | "unpaid" | "weekend";
    }[] = [];
    let totalDaysOff = 1; // Always count the holiday itself
    let paidLeavesUsed = 0;
    let unpaidLeavesUsed = 0;

    // If holiday falls on a weekend, skip it
    if (dayOfWeek === 0 || dayOfWeek === 6) return;

    // If holiday is on Wednesday, **DO NOT** add any leaves
    if (dayOfWeek === 3) {
      totalDays.push({
        date: holidayDate.format("YYYY-MM-DD"),
        day: "Wednesday",
        type: "holiday",
      });
      longWeekends.push({
        id: holidayDate.format("YYYY-MM-DD"),
        holiday: { date: holidayDate.format("YYYY-MM-DD"), name: holiday.name },
        suggestedLeaves: [],
        totalDaysOff: 1,
        paidLeavesUsed: 0,
        unpaidLeavesUsed: 0,
        totalDays,
      });
      return;
    }

    // Add the holiday itself
    totalDays.push({
      date: holidayDate.format("YYYY-MM-DD"),
      day: holidayDate.format("dddd"),
      type: "holiday",
    });

    // If holiday is on Friday, count Saturday & Sunday as off
    if (dayOfWeek === 5) {
      totalDays.push({
        date: holidayDate.add(1, "day").format("YYYY-MM-DD"),
        day: "Saturday",
        type: "weekend",
      });
      totalDays.push({
        date: holidayDate.add(2, "day").format("YYYY-MM-DD"),
        day: "Sunday",
        type: "weekend",
      });
      totalDaysOff += 2;
    }

    // If holiday is on Monday, count Saturday & Sunday before as off
    if (dayOfWeek === 1) {
      totalDays.push({
        date: holidayDate.subtract(1, "day").format("YYYY-MM-DD"),
        day: "Sunday",
        type: "weekend",
      });
      totalDays.push({
        date: holidayDate.subtract(2, "day").format("YYYY-MM-DD"),
        day: "Saturday",
        type: "weekend",
      });
      totalDaysOff += 2;
    }

    // Function to use a leave and track its type
    const useLeave = (leaveDate: dayjs.Dayjs, leaveDay: string) => {
      if (remainingPaidLeaves > 0) {
        remainingPaidLeaves--;
        paidLeavesUsed++;
        suggestedLeaves.push({
          date: leaveDate.format("YYYY-MM-DD"),
          day: leaveDay,
          type: "paid",
        });
        totalDays.push({
          date: leaveDate.format("YYYY-MM-DD"),
          day: leaveDay,
          type: "paid",
        });
      } else if (remainingUnpaidLeaves > 0) {
        remainingUnpaidLeaves--;
        unpaidLeavesUsed++;
        suggestedLeaves.push({
          date: leaveDate.format("YYYY-MM-DD"),
          day: leaveDay,
          type: "unpaid",
        });
        totalDays.push({
          date: leaveDate.format("YYYY-MM-DD"),
          day: leaveDay,
          type: "unpaid",
        });
      } else {
        return; // No more leaves available, skip
      }
      totalDaysOff++;
    };

    // If holiday is on Tuesday, suggest Monday for a long weekend and add the previous weekend
    if (dayOfWeek === 2) {
      useLeave(holidayDate.subtract(1, "day"), "Monday");
      totalDays.push({
        date: holidayDate.subtract(2, "day").format("YYYY-MM-DD"),
        day: "Sunday",
        type: "weekend",
      });
      totalDays.push({
        date: holidayDate.subtract(3, "day").format("YYYY-MM-DD"),
        day: "Saturday",
        type: "weekend",
      });
      totalDaysOff += 2;
    }

    // If holiday is on Thursday, suggest Friday for a long weekend and add the upcoming weekend
    if (dayOfWeek === 4) {
      useLeave(holidayDate.add(1, "day"), "Friday");
      totalDays.push({
        date: holidayDate.add(2, "day").format("YYYY-MM-DD"),
        day: "Saturday",
        type: "weekend",
      });
      totalDays.push({
        date: holidayDate.add(3, "day").format("YYYY-MM-DD"),
        day: "Sunday",
        type: "weekend",
      });
      totalDaysOff += 2;
    }

    longWeekends.push({
      id: holidayDate.format("YYYY-MM-DD"),
      holiday: {
        date: holidayDate.format("YYYY-MM-DD"),
        name: holiday.name,
      },
      suggestedLeaves,
      totalDaysOff,
      paidLeavesUsed,
      unpaidLeavesUsed,
      totalDays,
    });
  });

  // **Sort by longest long weekends first**
  longWeekends.sort((a, b) => b.totalDaysOff - a.totalDaysOff);

  // **Distribute remaining paid leaves to the longest long weekends**
  longWeekends.forEach((weekend) => {
    if (remainingPaidLeaves <= 0) return;

    const holidayDate = dayjs(weekend.id);

    // Find an extra leave day before or after the weekend
    let leaveDate: dayjs.Dayjs | null = null;
    if (!weekend.totalDays.some((d) => d.day === "Monday")) {
      leaveDate = holidayDate.subtract(3, "day"); // Add Friday before
    } else if (!weekend.totalDays.some((d) => d.day === "Friday")) {
      leaveDate = holidayDate.add(3, "day"); // Add Monday after
    }

    if (leaveDate) {
      weekend.suggestedLeaves.push({
        date: leaveDate.format("YYYY-MM-DD"),
        day: leaveDate.format("dddd"),
        type: "paid",
      });
      weekend.totalDays.push({
        date: leaveDate.format("YYYY-MM-DD"),
        day: leaveDate.format("dddd"),
        type: "paid",
      });
      weekend.totalDaysOff += 1;
      weekend.paidLeavesUsed += 1;
      remainingPaidLeaves--;
    }
  });

  return longWeekends;
};

// API Handler
export async function GET() {
  try {
    // request: Request
    // const { searchParams } = new URL(request.url);
    // const paid = searchParams.get("paid") || "0";
    // const unpaid = searchParams.get("unpaid") || "0";
    // const paidLeaves = parseInt(paid, 10);
    // const unpaidLeaves = parseInt(unpaid, 10);

    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const longWeekends = await getLongWeekends(1, 10);
    return NextResponse.json(longWeekends);
  } catch (error) {
    console.error("Error fetching long weekends:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
