import type { Metadata } from "next";
import UserKPICards from "@/components/admin/user-kpi-cards";
import { UserDataTable } from "@/components/admin/user-data-table";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for user management",
};

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      </div>
      <UserKPICards />
      <UserDataTable />
    </div>
  );
}
