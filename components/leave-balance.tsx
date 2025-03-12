"use client";

import { CalendarClock, CalendarDays, Clock, HelpCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data - would be fetched from API in a real app
const leaveBalanceData = {
  annual: {
    total: 24,
    used: 6,
    pending: 2,
    remaining: 16,
  },
  sick: {
    total: 12,
    used: 2,
    pending: 0,
    remaining: 10,
  },
  unpaid: {
    used: 2,
    pending: 2,
  },
  carryOver: 2,
  expiryDate: new Date(2024, 11, 31),
};

export function LeaveBalance() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Annual Leave Balance
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveBalanceData.annual.remaining} days
            </div>
            <Progress
              value={
                (leaveBalanceData.annual.used / leaveBalanceData.annual.total) *
                100
              }
              className="mt-2 h-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {leaveBalanceData.annual.used} used,{" "}
              {leaveBalanceData.annual.pending} pending out of{" "}
              {leaveBalanceData.annual.total} days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sick Leave Balance
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveBalanceData.sick.remaining} days
            </div>
            <Progress
              value={
                (leaveBalanceData.sick.used / leaveBalanceData.sick.total) * 100
              }
              className="mt-2 h-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {leaveBalanceData.sick.used} used out of{" "}
              {leaveBalanceData.sick.total} days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Leave</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveBalanceData.unpaid.used + leaveBalanceData.unpaid.pending}{" "}
              days
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {leaveBalanceData.unpaid.used} used,{" "}
              {leaveBalanceData.unpaid.pending} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Leave Details</h3>
        <div className="rounded-md border">
          <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Total Annual Leave
              </div>
              <div className="mt-1 text-xl font-bold">
                {leaveBalanceData.annual.total} days
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Used Annual Leave
              </div>
              <div className="mt-1 text-xl font-bold">
                {leaveBalanceData.annual.used} days
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </div>
              <div className="mt-1 text-xl font-bold">
                {leaveBalanceData.annual.pending} days
              </div>
            </div>
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    Carried Over
                    <HelpCircle className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      Days carried over from previous year
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="mt-1 text-xl font-bold">
                {leaveBalanceData.carryOver} days
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-muted-foreground" />
          <div>
            <h4 className="font-medium">Leave Policy Reminder</h4>
            <p className="text-sm text-muted-foreground">
              Your annual leave expires on December 31, 2024. Unused leave days
              (except {leaveBalanceData.carryOver} carried over) will be
              forfeited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
