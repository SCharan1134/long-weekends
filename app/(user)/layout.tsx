import type React from "react";
import { getServerAuthSession } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
// import ProtectedRoute from "@/components/protected-route";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect("/sign-in");
  }
  return <div>{children}</div>;
}
