import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { processLongWeekends } from "@/utils/processLongWeekends";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

// GET /api/holidays/[id] - Get a specific holiday
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  try {
    const { params } = context;
    const id = params.id;
    const holiday = await prisma.holiday.findUnique({
      where: { id: id },
    });

    if (!holiday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    return NextResponse.json(holiday);
  } catch (error) {
    console.error("Error fetching holiday:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ error }, { status: 500 });
  }
}
// PUT /api/holidays/[id] - Update a holiday
export async function PUT(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const id = params.id;
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

    // Check if holiday exists
    const existingHoliday = await prisma.holiday.findUnique({
      where: { id: id },
    });

    if (!existingHoliday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
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

    // Update holiday with calculated fields
    const holiday = await prisma.holiday.update({
      where: { id: id },
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

    await logUserActivity(userId, UserActionType.HOLIDAY_EDITED, {
      ip: request?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers?.get("user-agent") || "Unknown",
    });

    const users = await prisma.user.findMany({});

    for (const user of users) {
      await processLongWeekends(user.id);
    }

    return NextResponse.json(holiday);
  } catch (error) {
    console.error("Error updating holiday:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update holiday" },
      { status: 500 }
    );
  }
}

// DELETE /api/holidays/[id] - Delete a holiday
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(request: NextRequest, context: any) {
  try {
    const { params } = context;
    const id = params.id;
    // Check if holiday exists
    const existingHoliday = await prisma.holiday.findUnique({
      where: { id: id },
    });

    if (!existingHoliday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    await prisma.holiday.delete({
      where: { id: id },
    });

    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    await logUserActivity(userId, UserActionType.HOLIDAY_DELETED, {
      ip: request?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers?.get("user-agent") || "Unknown",
    });

    const users = await prisma.user.findMany({});

    for (const user of users) {
      await processLongWeekends(user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting holiday:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete holiday" },
      { status: 500 }
    );
  }
}
