import { Header } from "@/components/header";
// import { Calendar } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { getServerAuthSession } from "../api/auth/[...nextauth]/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <>
      <Header />
      <div className="flex min-h-svh flex-col items-center justify-center gap-6  p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            {/* <div className="flex h-6 w-6 items-center justify-center rounded-md dark:bg-white bg-blue-600 text-primary-foreground">
              <Calendar className="size-4 dark:text-blue-600" />
            </div> */}
            <Image src={"/logo.png"} alt="logo" width={40} height={40} />
            LongWeekends Inc.
          </Link>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
}
