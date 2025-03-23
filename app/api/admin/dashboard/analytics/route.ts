import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "month"; // 'week', 'month', 'year'

    // Calculate date ranges based on period
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "year":
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "month":
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    // Get user registration trend
    const userRegistrations = await prisma.user.groupBy({
      by: ["createdAt"],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Get company distribution
    const companyDistribution = await prisma.user.groupBy({
      by: ["companyName"],
      _count: {
        id: true,
      },
      where: {
        companyName: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5, // Top 5 companies
    });

    // Get role distribution
    const roleDistribution = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        id: true,
      },
      where: {
        role: {
          not: null,
        },
      },
    });

    // Get salary ranges
    const salaryRanges = [
      { min: 0, max: 30000, label: "0-30K" },
      { min: 30001, max: 50000, label: "30K-50K" },
      { min: 50001, max: 70000, label: "50K-70K" },
      { min: 70001, max: 100000, label: "70K-100K" },
      { min: 100001, max: null, label: "100K+" },
    ];

    const salaryDistribution = await Promise.all(
      salaryRanges.map(async (range) => {
        const count = await prisma.user.count({
          where: {
            salary: {
              gte: range.min,
              ...(range.max ? { lte: range.max } : {}),
            },
          },
        });
        return {
          label: range.label,
          count,
        };
      })
    );

    return NextResponse.json({
      userRegistrations,
      companyDistribution,
      roleDistribution,
      salaryDistribution,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
