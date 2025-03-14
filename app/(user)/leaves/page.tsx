import { Suspense } from "react";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaveHistory } from "@/components/leave-history";
import { LeaveBalance } from "@/components/leave-balance";
import { UserNav } from "@/components/user-nav";
import { ModeToggle } from "@/components/mode-toggle";

export default function LeavesPage() {
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
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Leaves</h1>
          <Button asChild>
            <Link href="/leaves/new">
              <Plus className="mr-2 h-4 w-4" />
              Request Leave
            </Link>
          </Button>
        </div>
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList>
            <TabsTrigger value="history">Leave History</TabsTrigger>
            <TabsTrigger value="balance">Leave Balance</TabsTrigger>
          </TabsList>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave History</CardTitle>
                <CardDescription>
                  View all your leave requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading leave history...</div>}>
                  <LeaveHistory />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="balance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance</CardTitle>
                <CardDescription>
                  Track your available leave days and usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading leave balance...</div>}>
                  <LeaveBalance />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
