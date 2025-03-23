import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

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

export default function LeavesPage() {
  return (
    <div className="flex min-h-screen flex-col">
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
