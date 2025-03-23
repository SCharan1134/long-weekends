import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/holidays/metadata - Get metadata for filters (countries, years)
export async function GET() {
  try {
    // Get unique countries
    const countries = await prisma.holiday.findMany({
      select: { country: true },
      distinct: ["country"],
      orderBy: { country: "asc" },
    });

    // Get unique years
    const years = await prisma.holiday.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });

    return NextResponse.json({
      countries: countries.map((c) => c.country),
      years: years.map((y) => y.year),
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
