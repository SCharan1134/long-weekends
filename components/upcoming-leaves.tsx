"use client";

import { format } from "date-fns";
import { CalendarX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data - would be fetched from API in a real app
const upcomingLeaves = [
  {
    id: 1,
    startDate: new Date(2024, 3, 10),
    endDate: new Date(2024, 3, 12),
    type: "paid",
    status: "approved",
    reason: "Vacation",
  },
  {
    id: 2,
    startDate: new Date(2024, 5, 20),
    endDate: new Date(2024, 5, 21),
    type: "unpaid",
    status: "pending",
    reason: "Personal",
  },
];

export function UpcomingLeaves() {
  const cancelLeave = (id: number) => {
    // In a real app, this would call an API to cancel the leave
    console.log(`Cancelling leave ${id}`);
  };

  return (
    <div className="space-y-4">
      {upcomingLeaves.length > 0 ? (
        upcomingLeaves.map((leave) => (
          <div
            key={leave.id}
            className="flex items-start justify-between rounded-md border p-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {format(leave.startDate, "MMM d")} -{" "}
                  {format(leave.endDate, "MMM d, yyyy")}
                </span>
                {/* <Badge
                  variant={leave.status === "approved" ? "success" : "outline"}
                >
                  {leave.status}
                </Badge> */}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge
                  variant={leave.type === "paid" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {leave.type}
                </Badge>
                <span>{leave.reason}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(
                  (leave.endDate.getTime() - leave.startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{" "}
                day(s)
              </div>
            </div>
            {leave.status === "pending" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
                onClick={() => cancelLeave(leave.id)}
              >
                <CalendarX className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CalendarX className="mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="font-medium">No upcoming leaves</h3>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have any scheduled leaves coming up
          </p>
        </div>
      )}
    </div>
  );
}
