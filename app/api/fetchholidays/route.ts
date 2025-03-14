import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const CALENDARIFIC_API_URL = "https://calendarific.com/api/v2/holidays";
const API_KEY = "aqzieotOk6VC2BCmOwz5o6FaxH9MNwV1";

export async function GET() {
  try {
    // Fetch data from the external API
    const response = await fetch(
      `${CALENDARIFIC_API_URL}?api_key=${API_KEY}&country=IN&year=2025`
    );
    const data = await response.json();

    if (!data.response || !data.response.holidays) {
      return new NextResponse("Invalid API response", { status: 500 });
    }

    // Filter only "National holiday"
    const nationalHolidays = data.response.holidays.filter((holiday: Holiday) =>
      holiday.type.includes("National holiday")
    );

    // Save to database
    const savedHolidays = await Promise.all(
      nationalHolidays.map((holiday: Holiday) =>
        prisma.holiday.create({
          data: {
            name: holiday.name,
            description: holiday.description,
            countryId: holiday.country.id,
            country: holiday.country.name,
            date: new Date(holiday.date.iso),
            year: holiday.date.datetime.year,
            month: holiday.date.datetime.month,
            day: holiday.date.datetime.day,
            url: holiday.canonical_url,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Holidays saved successfully",
      savedHolidays,
    });
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

interface Holiday {
  name: string;
  description: string;
  country: {
    id: string;
    name: string;
  };
  date: {
    iso: string;
    datetime: {
      year: number;
      month: number;
      day: number;
    };
  };
  type: string[];
  primary_type: string;
  canonical_url: string;
  urlid: string;
  locations: string;
  states: string;
}
