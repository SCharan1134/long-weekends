"use client";

import { useState, useCallback, useEffect } from "react";
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
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { replaceLongWeekends } from "@/store/slices/longWeekendSlice";

// Define the types based on the provided interface
interface Holiday {
  date: string;
  name: string;
}

interface SuggestedLeave {
  date: string;
  day: string;
  type: "paid" | "unpaid";
}

interface DayInfo {
  date: string;
  day: string;
  type: "holiday" | "paid" | "unpaid" | "weekend";
}

interface LongWeekend {
  id: string;
  holiday: Holiday;
  suggestedLeaves: SuggestedLeave[];
  totalDaysOff: number;
  paidLeavesUsed: number;
  unpaidLeavesUsed: number;
  totalDays: DayInfo[];
}

export function LongWeekendCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  //   const [longWeekends, setLongWeekends] =
  //     useState<LongWeekend[]>(dummyLongWeekends);
  const [selectedLongWeekend, setSelectedLongWeekend] =
    useState<LongWeekend | null>(null);

  const dispatch = useDispatch();
  const longWeekends: LongWeekend[] = useSelector(
    (state: RootState) => state.longWeekend.longWeekends
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const prevMonth = useCallback(
    () => setCurrentDate(subMonths(currentDate, 1)),
    [currentDate]
  );
  const nextMonth = useCallback(
    () => setCurrentDate(addMonths(currentDate, 1)),
    [currentDate]
  );
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);

  // Function to get all days from all long weekends
  const getAllDaysFromLongWeekends = useCallback(() => {
    const allDays: {
      date: Date;
      type: string;
      longWeekendId: string;
      name?: string;
    }[] = [];

    longWeekends.forEach((longWeekend) => {
      // Add holiday
      allDays.push({
        date: parseISO(longWeekend.holiday.date),
        type: "holiday",
        longWeekendId: longWeekend.id,
        name: longWeekend.holiday.name,
      });

      // Add suggested leaves
      longWeekend.suggestedLeaves.forEach((leave) => {
        allDays.push({
          date: parseISO(leave.date),
          type: leave.type,
          longWeekendId: longWeekend.id,
        });
      });

      // Add all days from totalDays that are not already added
      longWeekend.totalDays.forEach((day) => {
        if (day.type === "weekend") {
          allDays.push({
            date: parseISO(day.date),
            type: "weekend",
            longWeekendId: longWeekend.id,
          });
        }
      });
    });

    return allDays;
  }, [longWeekends]);

  const allDays = getAllDaysFromLongWeekends();

  useEffect(() => {
    const getHolidays = async () => {
      try {
        const response = await axios.get("/api/longweekends?paid=1&unpaid=6");
        //   setLongWeekends(response.data);
        dispatch(replaceLongWeekends(response.data));
      } catch (error) {
        console.error("Error fetching holidays:", error);
        toast.error("Error in fetching holidays");
      }
    };
    getHolidays();
  }, [dispatch]);

  // Function to find long weekend by date
  const findLongWeekendByDate = useCallback(
    (date: Date) => {
      const matchingDay = allDays.find((day) => isSameDay(day.date, date));
      if (matchingDay) {
        return (
          longWeekends.find((lw) => lw.id === matchingDay.longWeekendId) || null
        );
      }
      return null;
    },
    [allDays, longWeekends]
  );

  // Handle date selection
  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      const longWeekend = findLongWeekendByDate(date);
      setSelectedLongWeekend(longWeekend);
    },
    [findLongWeekendByDate]
  );

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const cloneDay = day;
      const isToday = isSameDay(day, new Date());
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      // Find if this day is part of a long weekend
      const dayInfo = allDays.find((d) => isSameDay(d.date, day));

      days.push(
        <TooltipProvider key={day.toString()}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "h-auto min-h-14 border p-1 transition-all hover:bg-accent cursor-pointer",
                  isToday && "bg-muted",
                  isSelected && "border-primary",
                  !isCurrentMonth && "text-muted-foreground opacity-50",
                  dayInfo?.type === "holiday" &&
                    "bg-green-100 dark:bg-green-950/20",
                  dayInfo?.type === "paid" &&
                    "bg-amber-100 dark:bg-amber-950/20",
                  dayInfo?.type === "unpaid" && "bg-red-100 dark:bg-red-950/20",
                  dayInfo?.type === "weekend" &&
                    dayInfo.longWeekendId &&
                    "bg-blue-100 dark:bg-blue-950/20"
                )}
                onClick={() => handleDateClick(cloneDay)}
              >
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "text-sm",
                      dayInfo?.type === "holiday" &&
                        "font-bold text-green-600 dark:text-green-400"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {dayInfo?.type === "holiday" && (
                  <div className="mt-1 text-xs font-medium text-green-600 dark:text-green-400 truncate">
                    {dayInfo.name}
                  </div>
                )}

                {(dayInfo?.type === "paid" || dayInfo?.type === "unpaid") && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        dayInfo.type === "paid" ? "bg-amber-500" : "bg-red-500"
                      )}
                    />
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-sm">
                <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                {dayInfo?.type === "holiday" && (
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {dayInfo.name}
                  </p>
                )}
                {dayInfo?.type === "paid" && (
                  <p className="font-medium text-amber-600 dark:text-amber-400">
                    Suggested Paid Leave
                  </p>
                )}
                {dayInfo?.type === "unpaid" && (
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Suggested Unpaid Leave
                  </p>
                )}
                {dayInfo?.type === "weekend" && dayInfo.longWeekendId && (
                  <p className="font-medium text-blue-600 dark:text-blue-400">
                    Weekend (Part of Long Weekend)
                  </p>
                )}
                {dayInfo && (
                  <p className="text-xs">
                    Part of a {findLongWeekendByDate(day)?.totalDaysOff}-day
                    long weekend
                  </p>
                )}
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
      <div className="sm:grid grid-cols-3 gap-2 flex flex-col ">
        <div
          className={cn(
            "rounded-md border ",
            selectedLongWeekend ? "col-span-2" : "col-span-3"
          )}
        >
          <div className="grid grid-cols-7 border-b">
            {dayNames.map((day, i) => (
              <div key={i} className="py-2 text-center text-sm font-medium">
                {day}
              </div>
            ))}
          </div>
          <div>{rows}</div>
        </div>

        {selectedLongWeekend && (
          <div className=" rounded-lg border bg-background p-4 w-full">
            <h3 className="text-xl font-semibold mb-4">
              {selectedLongWeekend.holiday.name} Long Weekend
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-base">
                <span>Total Days Off:</span>
                <span className="font-medium">
                  {selectedLongWeekend.totalDaysOff} days
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span>Paid Leaves Required:</span>
                <span className="font-medium">
                  {selectedLongWeekend.paidLeavesUsed}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span>Unpaid Leaves Required:</span>
                <span className="font-medium">
                  {selectedLongWeekend.unpaidLeavesUsed}
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-base mb-2">Days:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLongWeekend.totalDays.map((day, index) => (
                    <span
                      key={index}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm",
                        day.type === "holiday" &&
                          "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400",
                        day.type === "paid" &&
                          "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
                        day.type === "unpaid" &&
                          "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400",
                        day.type === "weekend" &&
                          "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                      )}
                    >
                      {format(parseISO(day.date), "EEE, MMM d")} ({day.type})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span>Public Holiday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Suggested Paid Leave</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>Suggested Unpaid Leave</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span>Weekend (Long Weekend)</span>
        </div>
      </div>
    </div>
  );
}
