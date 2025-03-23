"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "@/components/landing/Footer";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  inquiryType: z.enum(["general", "bug", "feedback", "other"], {
    required_error: "Please select an inquiry type",
  }),
  message: z.string().min(1, { message: "Message is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { data: session } = useSession();
  const [formState, setFormState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  // Initialize the form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      inquiryType: "general",
      message: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.setValue("email", session?.user?.email as string);
      form.setValue("name", session?.user?.name as string);
    }
  }, [session]);

  const onSubmit = async (data: FormValues) => {
    setFormState("submitting");

    try {
      const response = await axios.post("/api/feedback/create", data);
      if (response.status === 200) {
        setFormState("success");
        resetForm();
        toast.success("ThankYou for your feedback");
      }
    } catch (error) {
      console.log(error, "submitting feedback");
      setFormState("error");
      toast.error("Failed to submit feedback");
    }
  };

  const resetForm = () => {
    form.reset();
    setFormState("idle");
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
                      sricharanrayala24@gmail.com
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
                      How do I get my Long weekends?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We have implemented a smooth signup flow please follow it
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
                      <Button variant="outline" onClick={resetForm}>
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel htmlFor="name">Name</FormLabel>
                                <FormControl>
                                  <Input
                                    id="name"
                                    placeholder="Your name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <FormControl>
                                  <Input
                                    id="email"
                                    type="email"
                                    placeholder="your.email@example.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="inquiryType"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel>
                                  What can we help you with?
                                </FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-2 gap-2"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="general"
                                        id="general"
                                      />
                                      <Label
                                        htmlFor="general"
                                        className="font-normal"
                                      >
                                        General Inquiry
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="bug" id="bug" />
                                      <Label
                                        htmlFor="bug"
                                        className="font-normal"
                                      >
                                        bug Report
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="feedback"
                                        id="feedback"
                                      />
                                      <Label
                                        htmlFor="feedback"
                                        className="font-normal"
                                      >
                                        Feedback
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="other"
                                        id="other"
                                      />
                                      <Label
                                        htmlFor="other"
                                        className="font-normal"
                                      >
                                        Other
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                              <FormItem className="grid gap-2">
                                <FormLabel htmlFor="message">Message</FormLabel>
                                <FormControl>
                                  <Textarea
                                    id="message"
                                    placeholder="Please describe how we can help you..."
                                    className="min-h-[150px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                    </Form>
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
