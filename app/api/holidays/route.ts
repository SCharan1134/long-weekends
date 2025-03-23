import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const country = searchParams.get("country") || "US";

  try {
    console.log(year, country);

    const holidays = await prisma.holiday.findMany({});

    return NextResponse.json(holidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return NextResponse.json(
      { error: "Failed to fetch holidays" },
      { status: 500 }
    );
  }
}
