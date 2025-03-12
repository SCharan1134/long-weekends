import { NextResponse } from "next/server";
import { addDays, isWeekend } from "date-fns";

// In a real app, this would calculate long weekends based on holidays from the API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  try {
    // In a real app, this would fetch holidays from our holidays API
    // const response = await fetch(`/api/holidays?year=${year}&country=US`)
    // const holidays = await response.json()

    // For demo purposes, we'll use mock data
    const holidays = [
      { date: `${year}-01-01`, name: "New Year's Day" },
      { date: `${year}-01-15`, name: "Martin Luther King Jr. Day" },
      { date: `${year}-02-19`, name: "Presidents' Day" },
      { date: `${year}-05-27`, name: "Memorial Day" },
      { date: `${year}-07-04`, name: "Independence Day" },
      { date: `${year}-09-02`, name: "Labor Day" },
      { date: `${year}-10-14`, name: "Columbus Day" },
      { date: `${year}-11-11`, name: "Veterans Day" },
      { date: `${year}-11-28`, name: "Thanksgiving Day" },
      { date: `${year}-12-25`, name: "Christmas Day" },
    ];

    const longWeekends = holidays
      .map((holiday) => {
        const holidayDate = new Date(holiday.date);
        const dayOfWeek = holidayDate.getDay();

        // Skip weekends as they're already part of the weekend
        if (isWeekend(holidayDate)) {
          return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let suggestedLeaves: Array<any> = [];
        let totalDaysOff = 0;
        let leavesDays = 0;

        // Monday holiday
        if (dayOfWeek === 1) {
          // Suggest taking Tuesday to Friday off
          suggestedLeaves = [
            { date: addDays(holidayDate, 1), day: "Tuesday" },
            { date: addDays(holidayDate, 2), day: "Wednesday" },
            { date: addDays(holidayDate, 3), day: "Thursday" },
            { date: addDays(holidayDate, 4), day: "Friday" },
          ];
          totalDaysOff = 9; // Saturday to next Sunday
          leavesDays = 4;
        }
        // Tuesday holiday
        else if (dayOfWeek === 2) {
          // Suggest taking Monday, Wednesday to Friday off
          suggestedLeaves = [
            { date: addDays(holidayDate, -1), day: "Monday" },
            { date: addDays(holidayDate, 1), day: "Wednesday" },
            { date: addDays(holidayDate, 2), day: "Thursday" },
            { date: addDays(holidayDate, 3), day: "Friday" },
          ];
          totalDaysOff = 9; // Saturday to next Sunday
          leavesDays = 4;
        }
        // Wednesday holiday
        else if (dayOfWeek === 3) {
          // Two options: Monday-Tuesday or Thursday-Friday
          suggestedLeaves = [
            { date: addDays(holidayDate, -2), day: "Monday" },
            { date: addDays(holidayDate, -1), day: "Tuesday" },
            { date: addDays(holidayDate, 1), day: "Thursday" },
            { date: addDays(holidayDate, 2), day: "Friday" },
          ];
          totalDaysOff = 9; // Saturday to next Sunday
          leavesDays = 4;
        }
        // Thursday holiday
        else if (dayOfWeek === 4) {
          // Suggest taking Friday off
          suggestedLeaves = [{ date: addDays(holidayDate, 1), day: "Friday" }];
          totalDaysOff = 4; // Thursday to Sunday
          leavesDays = 1;
        }
        // Friday holiday
        else if (dayOfWeek === 5) {
          // Suggest taking Monday to Thursday off
          suggestedLeaves = [
            { date: addDays(holidayDate, -4), day: "Monday" },
            { date: addDays(holidayDate, -3), day: "Tuesday" },
            { date: addDays(holidayDate, -2), day: "Wednesday" },
            { date: addDays(holidayDate, -1), day: "Thursday" },
          ];
          totalDaysOff = 9; // Saturday to next Sunday
          leavesDays = 4;
        }

        return {
          id: holiday.date,
          holiday: { date: holidayDate, name: holiday.name },
          suggestedLeaves,
          totalDaysOff,
          leavesDays,
        };
      })
      .filter(Boolean);

    return NextResponse.json(longWeekends);
  } catch (error) {
    console.error("Error calculating long weekends:", error);
    return NextResponse.json(
      { error: "Failed to calculate long weekends" },
      { status: 500 }
    );
  }
}
