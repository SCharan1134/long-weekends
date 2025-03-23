"use client";

import Link from "next/link";
// import { ArrowRight, Calendar, Clock, Users } from "lucide-react";
const ArrowRight = dynamic(
  () => import("lucide-react").then((mod) => mod.ArrowRight),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "@/components/landing/Footer";
import { Header } from "@/components/header";
import dynamic from "next/dynamic";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col w-full items-center">
      <Header />
      <main className="flex-1 w-full  flex-col flex items-center">
        <section className="w-full  bg-gradient-to-b from-background to-blue-600/20 h-screen py-12 md:py-24 lg:py-32 space-y-8">
          <div className="mx-auto flex w-full flex-col items-center space-y-4 text-center">
            <div className="rounded-full bg-blue-600/10 px-3 py-1 text-sm text-blue-600">
              Beta Release
            </div>
            <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Plan Your <span className="text-blue-600">Long Weekends</span>{" "}
              Effortlessly
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Maximize your time off by optimizing your leaves. Our app analyzes
              your salary, paid and unpaid leaves to create the perfect long
              weekend calendar.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 text-white">
                <Link href="/sign-up">
                  Try For Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              No credit card required • 100% free
            </div>
          </div>
          {/* <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6 animate-pulse-slow bg-muted/50">
                <Calendar className="h-12 w-12 text-blue-600" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/2 rounded bg-muted"></div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6 animate-pulse-slow delay-300 bg-muted/50">
                <Clock className="h-12 w-12 text-blue-600" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/2 rounded bg-muted"></div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6 animate-pulse-slow delay-700 bg-muted/50">
                <Users className="h-12 w-12 text-blue-600" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/2 rounded bg-muted"></div>
                </div>
              </div>
            </div>
          </div> */}
        </section>

        <section
          id="features"
          className=" px-5 py-12 md:py-24 lg:py-32 w-full bg-muted/50"
        >
          <div className="mx-auto  grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-600">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Smart Leave Planning
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our intelligent algorithm analyzes your work calendar, public
                holidays, and available leaves to suggest the most optimal long
                weekend plans.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[400px] aspect-square overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-md flex items-center justify-center text-sm font-medium ${
                        [5, 6, 12, 13, 19, 20, 26, 27].includes(i)
                          ? "bg-blue-600/10 text-muted-foreground"
                          : [15, 16, 17, 18].includes(i)
                          ? "bg-blue-600 text-white  animate-pulse-slow"
                          : "border"
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-sm">
                  <div className="text-xs font-medium">
                    Optimal 4-day weekend
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Take 2 leaves, get 4 days off
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex items-center justify-center order-last lg:order-first">
              <div className="relative w-full max-w-[400px] aspect-square overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded-md bg-muted animate-pulse-slow"></div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-green-500"></div>
                      <div className="h-4 w-1/2 rounded bg-muted"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <div className="h-4 w-2/3 rounded bg-muted"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-red-500"></div>
                      <div className="h-4 w-1/3 rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="h-32 w-full rounded-md bg-muted/50 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-blue-600/40 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-blue-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Leave Balance Tracking
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Keep track of your paid and unpaid leaves Get notified when
                you&apos;re about to lose your Long Weekends.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-none rounded-full bg-blue-600/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Automatic LongWeekend calculation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-none rounded-full bg-blue-600/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Expiry notifications for unused longweekend
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-6 w-6 flex-none rounded-full bg-blue-600/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Customizable longweekend types
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full px-5 py-12 md:py-24 lg:py-32"
        >
          <div className="mx-auto flex w-full flex-col items-center space-y-4 text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              How It Works
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Three simple steps to optimize your time off and plan the perfect
              long weekends.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="group relative flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                1
              </div>
              <h3 className="text-xl font-bold">Setup Your Account</h3>
              <p className="text-center text-muted-foreground">
                Setup your account through our easy sign-up process.
              </p>
              <div className="absolute top-0 right-0 -z-10 h-full w-full rounded-lg bg-blue-600/5 opacity-0 transition-all group-hover:opacity-100"></div>
            </div>
            <div className="group relative flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                2
              </div>
              <h3 className="text-xl font-bold">Set Your Preferences</h3>
              <p className="text-center text-muted-foreground">
                Tell us your travel preferences and how you like to spend your
                time off.
              </p>
              <div className="absolute top-0 right-0 -z-10 h-full w-full rounded-lg bg-blue-600/5 opacity-0 transition-all group-hover:opacity-100"></div>
            </div>
            <div className="group relative flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-600">
                3
              </div>
              <h3 className="text-xl font-bold">Get Personalized Plans</h3>
              <p className="text-center text-muted-foreground">
                Receive optimized long weekend plans that maximize your time
                off.
              </p>
              <div className="absolute top-0 right-0 -z-10 h-full w-full rounded-lg bg-blue-600/5 opacity-0 transition-all group-hover:opacity-100"></div>
            </div>
          </div>
        </section>

        <section
          id="roadmap"
          className="w-full px-5 py-12 md:py-24 lg:py-32 bg-muted/50"
        >
          <div className="mx-auto flex w-full flex-col items-center space-y-4 text-center">
            <div className="inline-block rounded-lg bg-blue-600/10 px-3 py-1 text-sm text-blue-600">
              Coming Soon
            </div>
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Future Roadmap
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              We&apos;re just getting started! Here&apos;s what we&apos;re
              planning to add in the coming months.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Team Coordination</CardTitle>
                <CardDescription>Coming in Q2 2025</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Coordinate leave plans with your team members to ensure proper
                  coverage while everyone gets to enjoy their time off.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Team calendar view</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Leave request workflow</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Coverage analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Travel Integration</CardTitle>
                <CardDescription>Coming in Q3 2025</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Connect with travel services to find the best deals for your
                  planned long weekends.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Flight price tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Hotel recommendations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Activity suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Coming in Q4 2025</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Get insights into your time off patterns and optimize your
                  work-life balance.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Leave usage patterns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Work-life balance score</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    <span>Personalized recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="w-full px-5 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">
              Ready to Maximize Your Time Off?
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Join our beta program and be among the first to optimize your
              leave days.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 text-white">
                <Link href="/sign-up">
                  Get Started For Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              No credit card required • 100% free
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
