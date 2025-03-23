"use client";

import Link from "next/link";
import { ArrowLeft, LightbulbIcon, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/landing/Footer";
import { Header } from "@/components/header";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl space-y-12">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>

              <div className="mt-6 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  About Long Weekends
                </h1>
                <p className="text-xl text-muted-foreground">
                  Helping you make the most of your time off.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Our Story</h2>
              <div className="space-y-4">
                <p>
                  Long Weekends was born out of a simple observation: most
                  people don&apos;t optimize their leave days effectively. We
                  noticed that with strategic planning around public holidays
                  and weekends, it&apos;s possible to turn a few days of leave
                  into extended breaks – but calculating these optimal
                  combinations manually is time-consuming.
                </p>
                <p>
                  we created Long Weekends to solve this problem. Our
                  application automatically analyzes your work calendar, leave
                  policy, and public holidays to suggest the most efficient ways
                  to plan your time off.
                </p>
                <p>
                  What started as a simple tool for ourselves has evolved into a
                  comprehensive leave planning solution that we&apos;re excited
                  to share with you in this first release.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <LightbulbIcon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To help people maximize their time off and achieve better
                      work-life balance through smart leave planning.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Our Vision</h3>
                    <p className="text-muted-foreground">
                      A world where everyone can make the most of their personal
                      time without compromising professional responsibilities.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Our Values</h3>
                    <p className="text-muted-foreground">
                      Simplicity, privacy, work-life balance, and making every
                      day off count.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">
                The Problem We&apos;re Solving
              </h2>
              <div className="space-y-4">
                <p>
                  Did you know that the average employee leaves 5-7 days of paid
                  time off unused each year? And even when people do use their
                  leave, they often don&apos;t maximize its potential by
                  strategically planning around weekends and holidays.
                </p>
                <p>Long Weekends helps you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Identify the optimal days to take off for maximum time away
                  </li>
                  <li>
                    Track your leave balances to ensure you don&apos;t lose
                    unused days
                  </li>
                  <li>
                    Plan ahead for the entire year with a visual calendar of
                    potential long weekends
                  </li>
                  {/* <li>
                    Coordinate with your team to ensure coverage while everyone
                    gets to enjoy time off
                  </li> */}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Meet the Founder</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Image
                  src={"/about.jpg"}
                  width={300}
                  height={300}
                  alt={"founder photo"}
                  className="w-32 h-32 rounded-full aspect-square object-cover"
                />
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Sri Charan Rayala</h3>
                  <p className="text-muted-foreground">
                    Sri Charan is a final year Btech Grad studing in Mahatma
                    Gandhi Institute Of Technology.He has been working in
                    Startups as a Full Stack Developer and got to know a problem
                    that people face in planning their time off as a LongWeekend
                    then he came up with the idea of LongWeekends.
                  </p>
                  <p className="text-muted-foreground">
                    &quot;I believe that time is our most precious resource.
                    Long Weekends is about helping people reclaim that resource
                    and use it in the most fulfilling way possible.&quot;
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Our Commitment</h2>
              <div className="space-y-4">
                <p>As a new application, we&apos;re committed to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Continuously improving based on user feedback</li>
                  <li>
                    Maintaining a free core offering that delivers real value
                  </li>
                  <li>Respecting your privacy and securing your data</li>
                  <li>
                    Building features that genuinely help you make the most of
                    your time off
                  </li>
                </ul>
                <p>
                  We&apos;re just getting started, and we&apos;re excited to
                  have you join us on this journey.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/sign-up">Try Long Weekends</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
