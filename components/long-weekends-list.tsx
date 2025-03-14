"use client";

import { useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarPlus, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Using the same interface as the calendar component
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

export default function LongWeekendList() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // const [longWeekends, setLongWeekends] =
  //   useState<LongWeekend[]>(dummyLongWeekends);

  // useEffect(() => {
  //   const getHolidays = async () => {
  //     try {
  //       const response = await axios.get("/api/longweekends?paid=1&unpaid=6");
  //       setLongWeekends(response.data);
  //     } catch (error) {
  //       console.error("Error fetching holidays:", error);
  //       toast.error("Error in fetching holidays");
  //     }
  //   };
  //   getHolidays();
  // }, []);
  const longWeekends: LongWeekend[] = useSelector(
    (state: RootState) => state.longWeekend.longWeekends
  );

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter to show only future long weekends
  const futureWeekends = longWeekends
    .filter((weekend) => new Date(weekend.holiday.date) > new Date())
    .sort(
      (a, b) =>
        new Date(a.holiday.date).getTime() - new Date(b.holiday.date).getTime()
    );

  // Get the first and last date of a long weekend
  const getTimeOffPeriod = (weekend: LongWeekend) => {
    const dates = weekend.totalDays.map((day) => new Date(day.date).getTime());
    const startDate = new Date(Math.min(...dates));
    const endDate = new Date(Math.max(...dates));
    return { startDate, endDate };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
        <Info className="h-4 w-4" />
        <p>
          Take strategic leaves around public holidays to maximize your time
          off. The suggestions below show how to get the most days off with the
          fewest leave days.
        </p>
      </div>

      <div className="space-y-4">
        {futureWeekends.map((weekend, index) => {
          const totalLeaves = weekend.paidLeavesUsed + weekend.unpaidLeavesUsed;
          const { startDate, endDate } = getTimeOffPeriod(weekend);

          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  className="flex cursor-pointer items-center justify-between border-b p-4"
                  onClick={() => toggleExpand(weekend.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{weekend.holiday.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {format(parseISO(weekend.holiday.date), "EEE, MMM d")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Take {totalLeaves} leave day{totalLeaves > 1 ? "s" : ""}{" "}
                      to get {weekend.totalDaysOff} days off
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="secondary">
                            {totalLeaves}:{weekend.totalDaysOff} ratio
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {totalLeaves} leave day{totalLeaves > 1 ? "s" : ""}{" "}
                            for {weekend.totalDaysOff} total days off
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button variant="ghost" size="sm">
                      {expandedId === weekend.id ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>

                {expandedId === weekend.id && (
                  <div className="p-4">
                    <div className="mb-4 space-y-2">
                      <h4 className="text-sm font-medium">
                        Suggested Leave Days
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {weekend.suggestedLeaves.map((leave, i) => (
                          <div
                            key={i}
                            className={`rounded-md border p-2 ${
                              leave.type === "paid"
                                ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20"
                                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {leave.day}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(parseISO(leave.date), "MMMM d, yyyy")}
                            </div>
                            <div className="mt-1 text-xs font-medium">
                              {leave.type === "paid"
                                ? "Paid Leave"
                                : "Unpaid Leave"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        All Days in Long Weekend
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {weekend.totalDays.map((day, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className={`
                              ${
                                day.type === "holiday"
                                  ? "bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                                  : ""
                              }
                              ${
                                day.type === "paid"
                                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                                  : ""
                              }
                              ${
                                day.type === "unpaid"
                                  ? "bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400"
                                  : ""
                              }
                              ${
                                day.type === "weekend"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400"
                                  : ""
                              }
                            `}
                          >
                            {format(parseISO(day.date), "EEE, MMM d")} (
                            {day.type})
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Time Off Period: </span>
                        {format(startDate, "MMM d")} -{" "}
                        {format(endDate, "MMM d, yyyy")}
                      </div>
                      <Button size="sm" className="gap-2">
                        <CalendarPlus className="h-4 w-4" />
                        Request These Days
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {futureWeekends.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No upcoming long weekends found
          </p>
        </div>
      )}
    </div>
  );
}
