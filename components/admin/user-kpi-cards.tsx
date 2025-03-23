"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface KPIData {
  totalUsers: {
    count: number;
    growthPercentage: number;
  };
  activeUsers: {
    count: number;
    percentage: number;
  };
  inactiveUsers: {
    count: number;
    percentage: number;
  };
  averageSalary: {
    amount: number;
    growthPercentage: number;
  };
}

export default function UserKPICards() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard/kpi");

        if (!response.ok) {
          throw new Error("Failed to fetch KPI data");
        }

        const data = await response.json();
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
    totalUsers: { count: 0, growthPercentage: 0 },
    activeUsers: { count: 0, percentage: 0 },
    inactiveUsers: { count: 0, percentage: 0 },
    averageSalary: { amount: 0, growthPercentage: 0 },
  };

  const data = kpiData || fallbackData;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.totalUsers.count.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.totalUsers.growthPercentage > 0 ? "+" : ""}
            {data.totalUsers.growthPercentage}% from last month
          </p>
        </CardContent>
      </Card>
      <Card className="border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.activeUsers.count.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.activeUsers.percentage}% of total users
          </p>
        </CardContent>
      </Card>
      <Card className="border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.inactiveUsers.count.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.inactiveUsers.percentage}% of total users
          </p>
        </CardContent>
      </Card>
      <Card className="border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{data.averageSalary.amount.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            +{data.averageSalary.growthPercentage}% from last quarter
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
