"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { addDays, format } from "date-fns";
import { CalendarDays, ChevronLeft, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";

export default function NewLeavePage() {
  const [date, setDate] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: new Date(),
    to: addDays(new Date(), 2),
  });
  const [leaveType, setLeaveType] = useState("paid");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form data to an API
    console.log("Form submitted", { date, leaveType });
    const dat = new Date();
    setDate({ from: dat, to: dat });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CalendarDays className="h-6 w-6" />
          <span>WeekendPlanner</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/leaves"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            My Leaves
          </Link>
          <Link
            href="/team"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Team
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Settings
          </Link>
          <ModeToggle />
          <UserNav />
        </nav>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/leaves">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Request Leave</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Details</CardTitle>
                <CardDescription>
                  Provide the details for your leave request
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-range"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        // onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="text-sm text-muted-foreground">
                    {date.from && date.to && (
                      <>
                        {Math.round(
                          (date.to.getTime() - date.from.getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1}{" "}
                        day(s) selected
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leave-type">Leave Type</Label>
                  <RadioGroup
                    id="leave-type"
                    value={leaveType}
                    onValueChange={setLeaveType}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label htmlFor="paid" className="font-normal">
                        Paid Leave
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unpaid" id="unpaid" />
                      <Label htmlFor="unpaid" className="font-normal">
                        Unpaid Leave
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leave-reason">Leave Category</Label>
                  <Select defaultValue="vacation">
                    <SelectTrigger id="leave-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide additional details about your leave request"
                    rows={3}
                  />
                </div>

                <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
                  <Info className="h-4 w-4" />
                  <p>
                    Your manager will be notified of this request. You&apos;ll
                    receive an email once it&apos;s approved.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/leaves">Cancel</Link>
                </Button>
                <Button type="submit">Submit Request</Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
