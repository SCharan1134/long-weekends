"use client";
import { Suspense } from "react";
// import { CalendarDays, Clock, Users } from "lucide-react";

// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LongWeekendCalendar } from "@/components/long-weekend-calendar";
import LongWeekendList from "@/components/long-weekends-list";
import DashboardKpiCards from "@/components/user/dashboard-kpi-cards";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 sm:px-8 px-4 py-4">
        <Tabs defaultValue="calendar" className="space-y-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="long-weekends">List</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="calendar" className="space-y-4">
            <DashboardKpiCards />
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>
                    View holidays, Long weekends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense
                    fallback={
                      <div className="h-[500px] w-full flex items-center justify-center">
                        Loading calendar...
                      </div>
                    }
                  >
                    <LongWeekendCalendar />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="long-weekends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Long Weekend Opportunities</CardTitle>
                <CardDescription>
                  Strategic leave planning to maximize your time off
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading long weekends...</div>}>
                  <LongWeekendList />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
