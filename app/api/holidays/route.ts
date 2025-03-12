import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();
  const country = searchParams.get("country") || "US";

  try {
    // In a real app, this would be a fetch call to the Nager.Date API
    // const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`)
    // const data = await response.json()

    // For demo purposes, we'll return mock data
    const holidays = [
      {
        date: `${year}-01-01`,
        localName: "New Year's Day",
        name: "New Year's Day",
        countryCode: country,
        fixed: true,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-01-15`,
        localName: "Martin Luther King Jr. Day",
        name: "Martin Luther King Jr. Day",
        countryCode: country,
        fixed: false,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-02-19`,
        localName: "Presidents' Day",
        name: "Presidents' Day",
        countryCode: country,
        fixed: false,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-05-27`,
        localName: "Memorial Day",
        name: "Memorial Day",
        countryCode: country,
        fixed: false,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-07-04`,
        localName: "Independence Day",
        name: "Independence Day",
        countryCode: country,
        fixed: true,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-09-02`,
        localName: "Labor Day",
        name: "Labor Day",
        countryCode: country,
        fixed: false,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-10-14`,
        localName: "Columbus Day",
        name: "Columbus Day",
        countryCode: country,
        fixed: false,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-11-11`,
        localName: "Veterans Day",
        name: "Veterans Day",
        countryCode: country,
        fixed: true,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-11-28`,
        localName: "Thanksgiving Day",
        name: "Thanksgiving Day",
        countryCode: country,
        fixed: false,
        global: true,
        type: "Public",
      },
      {
        date: `${year}-12-25`,
        localName: "Christmas Day",
        name: "Christmas Day",
        countryCode: country,
        fixed: true,
        global: true,
        type: "Public",
      },
    ];

    return NextResponse.json(holidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return NextResponse.json(
      { error: "Failed to fetch holidays" },
      { status: 500 }
    );
  }
}
