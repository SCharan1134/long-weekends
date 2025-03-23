import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    // Fetch available leave days (Assuming leaves are managed via paidLeaves & unpaidLeaves)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const availableLeaveDays = user ? user.paidLeaves || 0 : 0; // Assuming only paid leaves are counted

    const totalAnnualLeaves = (user.paidLeaves || 0) + (user.unpaidLeaves || 0); // Assuming 24 as per UI (Modify if needed)

    // Count upcoming holidays in the next 30 days
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const upcomingHolidays = await prisma.holiday.count({
      where: {
        date: {
          gte: today,
          lt: next30Days,
        },
      },
    });

    // Count long weekends in the current year
    const currentYear = new Date().getFullYear();

    const longWeekends = await prisma.longWeekend.count({
      where: {
        userId: userId,
        holiday: {
          year: currentYear,
        },
      },
    });

    // Find the next long weekend
    const nextLongWeekend = await prisma.longWeekend.findFirst({
      where: {
        userId: userId,
        holiday: {
          date: {
            gte: today,
          },
        },
      },
      include: {
        holiday: true,
        totalDays: {
          orderBy: {
            date: "asc",
          },
        },
      },
      orderBy: {
        holiday: {
          date: "asc",
        },
      },
    });

    const upcomingLongWeekendName = nextLongWeekend
      ? nextLongWeekend.holiday.name
      : "Enjoy";

    const nextLongWeekendDate = nextLongWeekend?.totalDays[0]?.date;

    const timeDiff = nextLongWeekendDate
      ? new Date(nextLongWeekendDate).getTime() - today.getTime()
      : 0;
    const daysUntilNextLongWeekend = Math.ceil(
      timeDiff / (1000 * 60 * 60 * 24)
    );

    return NextResponse.json(
      {
        availableLeaveDays: {
          days: availableLeaveDays,
          totalAnnualLeaves: totalAnnualLeaves,
        },
        upcomingHolidays: {
          count: upcomingHolidays,
          upcomingHolidays: 30,
        },
        longWeekends: {
          count: longWeekends,
          inYear: currentYear,
        },
        upcomingLongWeekend: {
          name: upcomingLongWeekendName,
          nextDate: daysUntilNextLongWeekend,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching KPI data:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPI data" },
      { status: 500 }
    );
  }
}
