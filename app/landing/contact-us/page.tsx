"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "@/components/landing/Footer";

export default function ContactPage() {
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState("submitting");

    // Simulate form submission
    setTimeout(() => {
      setFormState("success");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Link href="/" className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-xl">Long Weekends</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid w-full sm:px-24 px-5 gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-blue-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Contact Us
                </h1>
                <p className="text-muted-foreground">
                  We&apos;d love to hear from you. Fill out the form and
                  we&apos;ll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-muted-foreground">
                      hello@longweekends.app
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-1 h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Support Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9am - 5pm EST
                    </p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Quick answers to common questions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      Is Long Weekends really free?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Yes! Long Weekends is completely free during our beta
                      period. We plan to introduce premium features in the
                      future, but the core functionality will always remain
                      free.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">
                      How do I sync my work calendar?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      After signing up, you can connect your Google Calendar,
                      Outlook, or Apple Calendar from the settings page. We only
                      access your calendar events to help optimize your leave
                      planning.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-medium">Is my data secure?</h3>
                    <p className="text-sm text-muted-foreground">
                      Absolutely. We use industry-standard encryption and never
                      share your personal data with third parties. You can
                      review our privacy policy for more details.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    We&apos;ll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formState === "success" ? (
                    <div className="flex flex-col items-center justify-center space-y-4 py-12">
                      <div className="rounded-full bg-blue-600/10 p-3">
                        <CheckCircle className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-semibold">Message Sent!</h3>
                        <p className="text-muted-foreground">
                          Thank you for reaching out. We&apos;ll get back to you
                          shortly.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setFormState("idle")}
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Your name" required />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>What can we help you with?</Label>
                          <RadioGroup
                            defaultValue="general"
                            className="grid grid-cols-2 gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="general" id="general" />
                              <Label htmlFor="general" className="font-normal">
                                General Inquiry
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="support" id="support" />
                              <Label htmlFor="support" className="font-normal">
                                Technical Support
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="feedback" id="feedback" />
                              <Label htmlFor="feedback" className="font-normal">
                                Feedback
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="font-normal">
                                Other
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Please describe how we can help you..."
                            className="min-h-[150px]"
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={formState === "submitting"}
                      >
                        {formState === "submitting" ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Send Message
                          </span>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  By submitting this form, you agree to our privacy policy and
                  terms of service.
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
