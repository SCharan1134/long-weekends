"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CalendarDays, FileText, Sun } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface KPIData {
  availableLeaveDays: {
    days: number;
    totalAnnualLeaves: number;
  };
  upcomingHolidays: {
    count: number;
    upcomingHolidays: number;
  };
  longWeekends: {
    count: number;
    inYear: number;
  };
  upcomingLongWeekend: {
    name: string;
    nextDate: number;
  };
}

export default function DashboardKpiCards() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const response = await axios.get("/api/kpi");

        if (response.status !== 200) {
          throw new Error("Failed to fetch KPI data");
        }

        const data = response.data;
        setKpiData(data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
        toast.error("Failed to load dashboard metrics. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchKPIData();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-1"></div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Fallback data in case API fails
  const fallbackData = {
    availableLeaveDays: { days: 0, totalAnnualLeaves: 0 },
    upcomingHolidays: { count: 0, upcomingHolidays: 0 },
    longWeekends: { count: 0, inYear: 0 },
    upcomingLongWeekend: { name: "No Long Weekend", nextDate: 0 },
  };

  const data = kpiData || fallbackData;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Available Leave Days
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.availableLeaveDays.days} paid
          </div>
          <p className="text-xs text-muted-foreground">
            Out of {data.availableLeaveDays.totalAnnualLeaves} leaves
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Holidays
          </CardTitle>
          <Sun className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.upcomingHolidays.count}
          </div>
          <p className="text-xs text-muted-foreground">
            In the next {data.upcomingHolidays.upcomingHolidays} days
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Long weekends</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.longWeekends.count}</div>
          <p className="text-xs text-muted-foreground">
            in {data.longWeekends.inYear} year
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Upcoming Long weekend
          </CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.upcomingLongWeekend.name}
          </div>
          <p className="text-xs text-muted-foreground">
            in the next {data.upcomingLongWeekend.nextDate} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
