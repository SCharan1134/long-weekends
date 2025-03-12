"use client";

import { useState } from "react";
import { format, addDays } from "date-fns";
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

// Update the mock data to use the current year
const currentYear = new Date().getFullYear();
const longWeekends = [
  {
    id: 1,
    holiday: { date: new Date(currentYear, 0, 1), name: "New Year's Day" },
    suggestedLeaves: [
      { date: new Date(currentYear - 1, 11, 29), day: "Friday" },
      { date: new Date(currentYear - 1, 11, 28), day: "Thursday" },
    ],
    totalDaysOff: 5,
    leavesDays: 2,
  },
  {
    id: 2,
    holiday: {
      date: new Date(currentYear, 0, 15),
      name: "Martin Luther King Jr. Day",
    },
    suggestedLeaves: [
      { date: new Date(currentYear, 0, 16), day: "Tuesday" },
      { date: new Date(currentYear, 0, 17), day: "Wednesday" },
      { date: new Date(currentYear, 0, 18), day: "Thursday" },
      { date: new Date(currentYear, 0, 19), day: "Friday" },
    ],
    totalDaysOff: 9,
    leavesDays: 4,
  },
  {
    id: 3,
    holiday: { date: new Date(currentYear, 4, 27), name: "Memorial Day" },
    suggestedLeaves: [
      { date: new Date(currentYear, 4, 28), day: "Tuesday" },
      { date: new Date(currentYear, 4, 29), day: "Wednesday" },
      { date: new Date(currentYear, 4, 30), day: "Thursday" },
      { date: new Date(currentYear, 4, 31), day: "Friday" },
    ],
    totalDaysOff: 9,
    leavesDays: 4,
  },
  {
    id: 4,
    holiday: { date: new Date(currentYear, 6, 4), name: "Independence Day" },
    suggestedLeaves: [{ date: new Date(currentYear, 6, 5), day: "Friday" }],
    totalDaysOff: 4,
    leavesDays: 1,
  },
  {
    id: 5,
    holiday: { date: new Date(currentYear, 8, 2), name: "Labor Day" },
    suggestedLeaves: [
      { date: new Date(currentYear, 8, 3), day: "Tuesday" },
      { date: new Date(currentYear, 8, 4), day: "Wednesday" },
      { date: new Date(currentYear, 8, 5), day: "Thursday" },
      { date: new Date(currentYear, 8, 6), day: "Friday" },
    ],
    totalDaysOff: 9,
    leavesDays: 4,
  },
];

export function LongWeekendsList() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter to show only future long weekends
  const futureWeekends = longWeekends.filter(
    (weekend) =>
      weekend.holiday.date > new Date() ||
      weekend.suggestedLeaves.some((leave) => leave.date > new Date())
  );

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
        {futureWeekends.map((weekend) => (
          <Card key={weekend.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="flex cursor-pointer items-center justify-between border-b p-4"
                onClick={() => toggleExpand(weekend.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{weekend.holiday.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {format(weekend.holiday.date, "EEE, MMM d")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Take {weekend.leavesDays} leave day
                    {weekend.leavesDays > 1 ? "s" : ""} to get{" "}
                    {weekend.totalDaysOff} days off
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary">
                          {weekend.leavesDays}:{weekend.totalDaysOff} ratio
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {weekend.leavesDays} leave days for{" "}
                          {weekend.totalDaysOff} total days off
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
                        <div key={i} className="rounded-md border p-2">
                          <div className="text-sm font-medium">
                            {format(leave.date, "EEEE")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(leave.date, "MMMM d, yyyy")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="font-medium">Time Off Period: </span>
                      {format(
                        weekend.suggestedLeaves.length > 0
                          ? new Date(
                              Math.min(
                                ...weekend.suggestedLeaves.map((l) =>
                                  l.date.getTime()
                                )
                              )
                            )
                          : weekend.holiday.date,
                        "MMM d"
                      )}{" "}
                      -{" "}
                      {format(
                        addDays(
                          weekend.holiday.date,
                          weekend.holiday.date.getDay() === 1
                            ? 0
                            : weekend.holiday.date.getDay() === 0
                            ? 0
                            : 7 - weekend.holiday.date.getDay()
                        ),
                        "MMM d, yyyy"
                      )}
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
        ))}
      </div>
    </div>
  );
}
