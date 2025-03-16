import { Suspense } from "react";
import Link from "next/link";
import { CalendarDays, Clock, Users } from "lucide-react";

// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { CalendarView } from "@/components/calendar-view";
// import { UpcomingLeaves } from "@/components/upcoming-leaves";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { LongWeekendCalendar } from "@/components/long-weekend-calendar";
import LongWeekendList from "@/components/long-weekends-list";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CalendarDays className="h-6 w-6" />
          <span>Long Weekends</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 md:gap-6">
          <Link
            href="/leaves"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
      <main className="flex-1 space-y-4 sm:px-8 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Button asChild>
              <Link href="/leaves/new">Request Leave</Link>
            </Button> */}
          </div>
        </div>
        <Tabs defaultValue="calendar" className="space-y-4">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="long-weekends">List</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Leave Days
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18 days</div>
                  <p className="text-xs text-muted-foreground">
                    Out of 24 annual leaves
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Holidays
                  </CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    In the next 30 days
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Long weekends
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">in this year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Upcoming Long weekend
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">
                    in the next days
                  </p>
                </CardContent>
              </Card>
            </div>
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
              {/* <Card>
                <CardHeader>
                  <CardTitle>Upcoming Leaves</CardTitle>
                  <CardDescription>Your scheduled time off</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading leaves...</div>}>
                    <UpcomingLeaves />
                  </Suspense>
                </CardContent>
              </Card> */}
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
