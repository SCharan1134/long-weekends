import type { Metadata } from "next";
import type React from "react";
// import ProtectedRoute from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile details",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
