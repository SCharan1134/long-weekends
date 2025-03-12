"use client";

import { useState } from "react";
import {
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data - would be fetched from API in a real app
const currentYear = new Date().getFullYear();
const holidays = [
  { date: new Date(currentYear, 0, 1), name: "New Year's Day", type: "public" },
  {
    date: new Date(currentYear, 0, 15),
    name: "Martin Luther King Jr. Day",
    type: "public",
  },
  {
    date: new Date(currentYear, 1, 19),
    name: "Presidents' Day",
    type: "public",
  },
  { date: new Date(currentYear, 4, 27), name: "Memorial Day", type: "public" },
  {
    date: new Date(currentYear, 6, 4),
    name: "Independence Day",
    type: "public",
  },
  { date: new Date(currentYear, 8, 2), name: "Labor Day", type: "public" },
  { date: new Date(currentYear, 9, 14), name: "Columbus Day", type: "public" },
  { date: new Date(currentYear, 10, 11), name: "Veterans Day", type: "public" },
  {
    date: new Date(currentYear, 10, 28),
    name: "Thanksgiving Day",
    type: "public",
  },
  {
    date: new Date(currentYear, 11, 25),
    name: "Christmas Day",
    type: "public",
  },
];

const leaves = [
  { date: new Date(currentYear, 3, 10), type: "paid" },
  { date: new Date(currentYear, 3, 11), type: "paid" },
  { date: new Date(currentYear, 3, 12), type: "paid" },
  { date: new Date(currentYear, 5, 20), type: "unpaid" },
  { date: new Date(currentYear, 5, 21), type: "unpaid" },
];

const teamLeaves = [
  { date: new Date(currentYear, 2, 15), count: 2 },
  { date: new Date(currentYear, 2, 16), count: 3 },
  { date: new Date(currentYear, 3, 10), count: 1 },
  { date: new Date(currentYear, 3, 11), count: 2 },
];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const rows = [];
  let days = [];
  let day = startDate;

  // Create header with day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create calendar cells
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isToday = isSameDay(day, new Date());
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      // Check if day is a holiday
      const holiday = holidays.find((h) => isSameDay(h.date, day));

      // Check if day is a leave
      const leave = leaves.find((l) => isSameDay(l.date, day));

      // Check if team members are on leave
      const teamLeave = teamLeaves.find((tl) => isSameDay(tl.date, day));

      days.push(
        <TooltipProvider key={day.toString()}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "h-auto min-h-14 border p-1 transition-all hover:bg-accent",
                  isToday && "bg-muted",
                  isSelected && "border-primary",
                  !isCurrentMonth && "text-muted-foreground opacity-50",
                  holiday && "bg-red-50 dark:bg-red-950/20"
                )}
                onClick={() => setSelectedDate(cloneDay)}
              >
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "text-sm",
                      holiday && "font-bold text-destructive"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {teamLeave && (
                    <Badge variant="outline" className="h-5 px-1">
                      {teamLeave.count}
                    </Badge>
                  )}
                </div>

                {holiday && (
                  <div className="mt-1 text-xs font-medium text-destructive truncate">
                    {holiday.name}
                  </div>
                )}

                <div className="mt-1 flex flex-wrap gap-1">
                  {leave && (
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        leave.type === "paid" ? "bg-green-500" : "bg-amber-500"
                      )}
                    />
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-sm">
                <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                {holiday && (
                  <p className="font-medium text-destructive">{holiday.name}</p>
                )}
                {leave && (
                  <p className="font-medium">
                    {leave.type === "paid" ? "Paid Leave" : "Unpaid Leave"}
                  </p>
                )}
                {teamLeave && <p>{teamLeave.count} team member(s) on leave</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div key={day.toString()} className="grid grid-cols-7">
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="grid grid-cols-7 border-b">
          {dayNames.map((day, i) => (
            <div key={i} className="py-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        <div>{rows}</div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-destructive" />
          <span>Public Holiday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Paid Leave</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Unpaid Leave</span>
        </div>
      </div>
    </div>
  );
}
