"use client";

import { useEffect, useState, useCallback } from "react";
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
// import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Holiday } from "@prisma/client";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { replaceHolidays } from "@/store/slices/holidaySlice";
import { Skeleton } from "./ui/skeleton";

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [holidays, setHolidays] = useState<Holiday[]>([]);
  const dispatch = useDispatch();
  const holidays = useSelector((state: RootState) =>
    state.holiday.holidays.map((holiday) => ({
      ...holiday,
      date:
        typeof holiday.date === "string"
          ? new Date(holiday.date)
          : holiday.date,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const prevMonth = useCallback(
    () => setCurrentDate(subMonths(currentDate, 1)),
    [currentDate]
  );
  const nextMonth = useCallback(
    () => setCurrentDate(addMonths(currentDate, 1)),
    [currentDate]
  );
  const goToToday = useCallback(() => setCurrentDate(new Date()), []);

  useEffect(() => {
    const getHolidays = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/holidays");
        // setHolidays(response.data);
        dispatch(replaceHolidays(response.data));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        toast.error("Error in fetching holidays");
      }
    };
    getHolidays();
  }, []);

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

      const holiday = holidays.find((h) => isSameDay(new Date(h.date), day));

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
                  holiday && "bg-green-100 dark:bg-green-950/60"
                )}
                onClick={() => setSelectedDate(cloneDay)}
              >
                <div className="flex justify-between">
                  <span
                    className={cn(
                      "text-sm",
                      holiday && "font-bold text-green-500"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {holiday && (
                  <div className="mt-1 text-xs font-medium text-green-500 truncate">
                    {holiday.name}
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1 text-sm">
                <p>{format(day, "EEEE, MMMM d, yyyy")}</p>
                {holiday && (
                  <p className="font-medium text-green-500">{holiday.name}</p>
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
      {isLoading ? (
        <div className="w-full  mx-auto p-4 bg-background">
          <div className="space-y-4">
            {/* Calendar grid */}
            <div className="w-full grid grid-cols-7 gap-1">
              {/* Days of week header */}
              {dayNames.map((day, index) => (
                <div key={index} className="text-center py-2">
                  <Skeleton className="h-4 w-10 mx-auto" />
                </div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: 6 }).map((_, weekIndex) =>
                Array.from({ length: 7 }).map((_, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="aspect-video p-1"
                  >
                    <Skeleton className="h-full w-full rounded-md" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
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
      )}

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full  bg-green-500" />{" "}
          <span>Public Holiday</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-amber-500" />{" "}
          <span>Paid Leave</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full  bg-destructive" />{" "}
          <span>Unpaid Leave</span>
        </div>
      </div>
    </div>
  );
}
