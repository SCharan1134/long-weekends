import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();

    // Get active users count
    const activeUsers = await prisma.user.count({
      where: {
        isActive: true,
      },
    });

    // Calculate inactive users
    const inactiveUsers = totalUsers - activeUsers;

    // Calculate average salary
    const salaryResult = await prisma.user.aggregate({
      _avg: {
        salary: true,
      },
      where: {
        salary: {
          not: null,
        },
      },
    });

    // Get month-over-month growth
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    // Count users created in the previous month
    const usersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: lastMonth,
        },
      },
    });

    // Count users created in the current month
    const usersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastMonth,
        },
      },
    });

    // Calculate growth percentage with a fallback for when there were no users last month
    let growthPercentage = 0;
    if (usersLastMonth > 0) {
      growthPercentage = Math.round(
        ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100
      );
    } else if (usersThisMonth > 0) {
      // If there were no users last month but there are users this month, that's 100% growth
      growthPercentage = 100;
    }

    // If there are no users at all, ensure we're not showing growth
    if (totalUsers === 0) {
      growthPercentage = 0;
    }

    // Calculate active percentage
    const activePercentage =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;

    // Calculate inactive percentage
    const inactivePercentage =
      totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0;

    // Calculate salary growth (mock data for now)
    const salaryGrowthPercentage = 5; // In a real app, you would calculate this from historical data

    return NextResponse.json({
      totalUsers: {
        count: totalUsers,
        growthPercentage: growthPercentage,
      },
      activeUsers: {
        count: activeUsers,
        percentage: activePercentage,
      },
      inactiveUsers: {
        count: inactiveUsers,
        percentage: inactivePercentage,
      },
      averageSalary: {
        amount: Math.round(salaryResult._avg.salary || 0),
        growthPercentage: salaryGrowthPercentage,
      },
    });
  } catch (error) {
    console.error("Error fetching KPI data:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPI data" },
      { status: 500 }
    );
  }
}
