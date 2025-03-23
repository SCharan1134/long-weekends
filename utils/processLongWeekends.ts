import dayjs from "dayjs";
import prisma from "@/lib/prisma";
import { UserActionType } from "@/types/UserActionTypes";
import { logUserActivity } from "@/lib/logActivity";

interface SuggestedLeave {
  date: string;
  day: string;
  type: "paid" | "unpaid";
}

interface TotalDay {
  date: string;
  day: string;
  type: "holiday" | "paid" | "unpaid" | "weekend";
}

interface LongWeekend {
  holidayId: string;
  userId: string;
  totalDaysOff: number;
  paidLeavesUsed: number;
  unpaidLeavesUsed: number;
  suggestedLeaves: SuggestedLeave[];
  totalDays: TotalDay[];
}

interface ProcessLongWeekendsResponse {
  success: boolean;
  message: string;
}

export async function processLongWeekends(
  userId: string
): Promise<ProcessLongWeekendsResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return { success: false, message: "User not found" };
    }
    if (user.role === "admin") {
      return { success: false, message: "User is admin" };
    }

    const paidLeaves: number = user.paidLeaves || 0;
    const unpaidLeaves: number = user.unpaidLeaves || 0;
    await prisma.longWeekend.deleteMany({ where: { userId } });

    const holidays = await prisma.holiday.findMany();
    const longWeekends: LongWeekend[] = [];
    let remainingPaidLeaves = paidLeaves;
    let remainingUnpaidLeaves = unpaidLeaves;

    for (const holiday of holidays) {
      const holidayDate = dayjs(holiday.date);
      const dayOfWeek = holidayDate.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const suggestedLeaves: SuggestedLeave[] = [];
      const totalDays: TotalDay[] = [
        {
          date: holidayDate.format("YYYY-MM-DD"),
          day: holidayDate.format("dddd"),
          type: "holiday",
        },
      ];
      let totalDaysOff = 1;
      let paidLeavesUsed = 0;
      let unpaidLeavesUsed = 0;

      const applyLeave = (leaveDate: string, leaveDay: string): boolean => {
        if (remainingPaidLeaves > 0) {
          paidLeavesUsed++;
          remainingPaidLeaves--;
          suggestedLeaves.push({
            date: leaveDate,
            day: leaveDay,
            type: "paid",
          });
          totalDays.push({ date: leaveDate, day: leaveDay, type: "paid" });
          totalDaysOff++;
          return true;
        } else if (remainingUnpaidLeaves > 0) {
          unpaidLeavesUsed++;
          remainingUnpaidLeaves--;
          suggestedLeaves.push({
            date: leaveDate,
            day: leaveDay,
            type: "unpaid",
          });
          totalDays.push({ date: leaveDate, day: leaveDay, type: "unpaid" });
          totalDaysOff++;
          return true;
        }
        return false;
      };

      if (dayOfWeek === 2) {
        applyLeave(
          holidayDate.subtract(1, "day").format("YYYY-MM-DD"),
          "Monday"
        );
      } else if (dayOfWeek === 4) {
        applyLeave(holidayDate.add(1, "day").format("YYYY-MM-DD"), "Friday");
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
      } else if (dayOfWeek === 1 || dayOfWeek === 5) {
        totalDays.push({
          date: holidayDate
            .add(dayOfWeek === 1 ? -1 : 1, "day")
            .format("YYYY-MM-DD"),
          day: dayOfWeek === 1 ? "Sunday" : "Saturday",
          type: "weekend",
        });
        totalDays.push({
          date: holidayDate
            .add(dayOfWeek === 1 ? -2 : 2, "day")
            .format("YYYY-MM-DD"),
          day: dayOfWeek === 1 ? "Saturday" : "Sunday",
          type: "weekend",
        });
        totalDaysOff += 2;
      }

      if (totalDaysOff >= 2) {
        longWeekends.push({
          holidayId: holiday.id,
          userId,
          totalDaysOff,
          paidLeavesUsed,
          unpaidLeavesUsed,
          suggestedLeaves,
          totalDays,
        });
      }
    }

    longWeekends.sort((a, b) => b.totalDaysOff - a.totalDaysOff);
    let extraPaidLeaves = remainingPaidLeaves;
    for (const lw of longWeekends) {
      if (extraPaidLeaves <= 0) break;
      const lastDay = dayjs(lw.totalDays[lw.totalDays.length - 1].date);
      //   const firstDay = dayjs(lw.totalDays[0].date);

      if (
        extraPaidLeaves > 0 &&
        lastDay.add(1, "day").day() !== 0 &&
        lastDay.add(1, "day").day() !== 6
      ) {
        lw.suggestedLeaves.push({
          date: lastDay.add(1, "day").format("YYYY-MM-DD"),
          day: lastDay.add(1, "day").format("dddd"),
          type: "paid",
        });
        lw.totalDays.push({
          date: lastDay.add(1, "day").format("YYYY-MM-DD"),
          day: lastDay.add(1, "day").format("dddd"),
          type: "paid",
        });
        lw.totalDaysOff++;
        lw.paidLeavesUsed++;
        extraPaidLeaves--;
      }
    }

    await prisma.$transaction(
      longWeekends.map((lw) =>
        prisma.longWeekend.create({
          data: {
            holidayId: lw.holidayId,
            userId: lw.userId,
            totalDaysOff: lw.totalDaysOff,
            paidLeavesUsed: lw.paidLeavesUsed,
            unpaidLeavesUsed: lw.unpaidLeavesUsed,
            suggestedLeaves: {
              create: lw.suggestedLeaves.map((sl) => ({
                date: new Date(sl.date),
                day: sl.day,
                type: sl.type,
              })),
            },
            totalDays: {
              create: lw.totalDays.map((td) => ({
                date: new Date(td.date),
                day: td.day,
                type: td.type,
              })),
            },
          },
        })
      )
    );

    await logUserActivity(user.id, UserActionType.LONG_WEEKEND_CREATED, {
      from: "profile update or holiday added",
    });

    return { success: true, message: "Long weekends processed successfully" };
  } catch (error) {
    console.error("Error processing long weekends:", error);
    return { success: false, message: "Internal Server Error" };
  }
}
