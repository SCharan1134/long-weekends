import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { HolidayDashboard } from "@/components/user/holiday-dashboard-user";
import { CalendarView } from "@/components/calendar-view";

export default function Home() {
  return (
    <main className=" mx-auto py-4 sm:px-8 px-5">
      <Tabs defaultValue="calendar" className="space-y-4">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Holidays</h1>
          <TabsList>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="long-weekends">List</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="col-span-3">
              <CardContent>
                <CalendarView />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="long-weekends" className="space-y-4">
          <HolidayDashboard />
        </TabsContent>
      </Tabs>
    </main>
  );
}
