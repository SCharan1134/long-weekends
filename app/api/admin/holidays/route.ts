import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { processLongWeekends } from "@/utils/processLongWeekends";
import { logUserActivity } from "@/lib/logActivity";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { UserActionType } from "@/types/UserActionTypes";

// GET /api/holidays - Get all holidays with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract filter parameters
    const search = searchParams.get("search");
    const country = searchParams.get("country");
    const year = searchParams.get("year")
      ? Number.parseInt(searchParams.get("year") as string)
      : null;
    const month = searchParams.get("month")
      ? Number.parseInt(searchParams.get("month") as string)
      : null;

    // Pagination parameters
    const page = searchParams.get("page")
      ? Number.parseInt(searchParams.get("page") as string)
      : 1;
    const limit = searchParams.get("limit")
      ? Number.parseInt(searchParams.get("limit") as string)
      : 10;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: Prisma.HolidayWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    if (country) where.country = country;
    if (year) where.year = year;
    if (month) where.month = month;

    // Query holidays with filters and pagination
    const holidays = await prisma.holiday.findMany({
      where,
      orderBy: { date: "asc" },
      skip,
      take: limit,
    });

    // Get total count for pagination metadata
    const totalHolidays = await prisma.holiday.count({ where });

    return NextResponse.json({
      holidays,
      metadata: {
        total: totalHolidays,
        page,
        limit,
        totalPages: Math.ceil(totalHolidays / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch holidays" },
      { status: 500 }
    );
  }
}

// POST /api/holidays - Create a new holiday
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      !body.description ||
      !body.countryId ||
      !body.country ||
      !body.date
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract date components
    const date = new Date(body.date);

    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Create holiday with calculated fields
    const holiday = await prisma.holiday.create({
      data: {
        name: body.name,
        description: body.description,
        countryId: body.countryId,
        country: body.country,
        date,
        year,
        month,
        day,
      },
    });

    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    await logUserActivity(userId, UserActionType.HOLIDAY_ADDED, {
      ip: request?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers?.get("user-agent") || "Unknown",
    });

    const users = await prisma.user.findMany({});

    for (const user of users) {
      await processLongWeekends(user.id);
    }

    return NextResponse.json(holiday, { status: 201 });
  } catch (error) {
    console.error("Error creating holiday:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create holiday" },
      { status: 500 }
    );
  }
}
