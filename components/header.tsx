"use client";

import Link from "next/link";
import { Calendar, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();

  return (
    <header className="sticky  px-6 top-0 z-50 w-full border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" flex h-16 items-center justify-between  w-full">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold cursor-pointer"
        >
          {/* <div className="flex h-6 w-6 items-center justify-center rounded-md dark:bg-white bg-blue-600 text-primary-foreground">
            <Calendar className="size-4 dark:text-blue-600" />
          </div> */}
          <Image src={"/logo.png"} alt="logo" width={40} height={40} />
          <span className="text-xl">Long Weekends</span>
        </Link>

        {isAuthenticated ? (
          // Logged in navigation - desktop
          <nav className="hidden md:flex gap-6">
            {isAdmin ? (
              <>
                <Link
                  href="/super-admin/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/super-admin/dashboard" ? "text-blue-600" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/super-admin/holidays"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/super-admin/holidays" ? "text-blue-600" : ""
                  }`}
                >
                  Holidays
                </Link>
                <Link
                  href="/super-admin/feedback"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/super-admin/feedback" ? "text-blue-600" : ""
                  }`}
                >
                  Feedback
                </Link>
                <Link
                  href="/super-admin/profile"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/super-admin/profile" ? "text-blue-600" : ""
                  }`}
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/dashboard" ? "text-blue-600" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/holidays"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/holidays" ? "text-blue-600" : ""
                  }`}
                >
                  Holidays
                </Link>
                {/* <Link
                  href="/leaves"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/leaves" ? "text-blue-600" : ""
                  }`}
                >
                  My Leaves
                </Link> */}
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                    pathname === "/profile" ? "text-blue-600" : ""
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
          </nav>
        ) : (
          // Logged out navigation - desktop
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "#features" ? "text-blue-600" : ""
              }`}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "#how-it-works" ? "text-blue-600" : ""
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#roadmap"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === "#roadmap" ? "text-blue-600" : ""
              }`}
            >
              Roadmap
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <>
              <MobileNavAuth isAdmin={isAdmin} pathname={pathname} />
              <div className="hidden md:block">
                <UserNav />
              </div>
            </>
          ) : (
            <>
              <MobileNav />

              <Button
                asChild
                className="hidden md:inline-flex bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-full border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3">
            <div className="flex items-center justify-between px-6 border-b  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold cursor-pointer"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md dark:bg-white bg-blue-600 text-primary-foreground">
                  <Calendar className="size-4 dark:text-blue-600" />
                </div>
                <span className="text-xl">Long Weekends</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="mt-4 flex flex-col gap-6 border-b  bg-background/25 backdrop-blur supports-[backdrop-filter]:bg-background/80 py-3 px-5 w-full">
              <Link
                href="#features"
                className={`text-lg font-medium ${
                  pathname === "#features" ? "text-blue-600" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className={`text-lg font-medium ${
                  pathname === "#how-it-works" ? "text-blue-600" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#roadmap"
                className={`text-lg font-medium ${
                  pathname === "#roadmap" ? "text-blue-600" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                Roadmap
              </Link>

              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Link href="/sign-up" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavAuth({
  isAdmin,
  pathname,
}: {
  isAdmin: boolean;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  //   const { signOut } = useSession();
  return (
    <div className="md:hidden h-full flex items-center justify-center">
      <UserNav />
    </div>
  );
  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed right-0 top-0 h-full w-full bg-white py-3">
            <div className="flex items-center justify-between px-4 bg-white">
              <div className="flex items-center gap-2 font-bold">
                <Calendar className="h-6 w-6 text-blue-600" />
                <span className="text-xl">Long Weekends</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="mt-4 flex flex-col gap-6 bg-white py-3 px-5 w-full">
              {isAdmin ? (
                <>
                  <Link
                    href="/super-admin/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/super-admin/dashboard"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/super-admin/holidays"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/super-admin/holidays"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    Holidays
                  </Link>
                  <Link
                    href="/super-admin/feedback"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/super-admin/feedback"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    Feedback
                  </Link>
                  <Link
                    href="/super-admin/profile"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/super-admin/profile" ? "text-blue-600" : ""
                    }`}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/dashboard" ? "text-blue-600" : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/holidays"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/holidays" ? "text-blue-600" : ""
                    }`}
                  >
                    Holidays
                  </Link>
                  <Link
                    href="/leaves"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/leaves" ? "text-blue-600" : ""
                    }`}
                  >
                    My Leaves
                  </Link>
                  <Link
                    href="/profile"
                    className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                      pathname === "/profile" ? "text-blue-600" : ""
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  signOut();
                  setOpen(false);
                }}
              >
                Log out
              </Button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
