"use client";

import React from "react";

import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const formSchema = z.object({
  otp: z
    .string()
    .min(6, {
      message: "OTP must be 6 digits.",
    })
    .max(6),
});

type FormValues = z.infer<typeof formSchema>;
function VerifyOtpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);

  const params = useSearchParams();
  const email = params.get("email");
  const isReset = params.get("isreset");

  const router = useRouter();

  const inputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef<HTMLInputElement>());

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const startTimer = useCallback(() => {
    setTimer(30);
  }, []);

  useEffect(() => {
    startTimer();
    // Focus the first input on mount
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Update the form value
    form.setValue("otp", newOtp.join(""));

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1]?.current?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
      setActiveInput(index - 1);
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1]?.current?.focus();
      setActiveInput(index - 1);
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
      setActiveInput(index + 1);
    }
  };

  const handleFocus = (index: number) => {
    setActiveInput(index);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Check if pasted content is a number and has correct length
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.substring(0, 6).split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);
    form.setValue("otp", newOtp.join(""));

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((val) => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs[focusIndex]?.current?.focus();
    setActiveInput(focusIndex);
  };

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      // Here you would typically call your OTP verification API
      // console.log(data);
      const response = await axios.post("/api/auth/verify-otp", {
        email: email,
        otp: data.otp,
      });

      if (response.status === 200) {
        toast.success("User Verified Successfully");
        if (isReset) {
          router.push(`reset-password?email=${email}`);
        } else {
          router.push(`personal-information?email=${email}`);
        }
      } else {
        toast.error(response.data);
        // console.log("Error in axios", response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendOTP() {
    if (timer > 0) return;

    setIsResending(true);

    try {
      // Here you would typically call your resend OTP API
      const response = await axios.post("/api/auth/send-otp", {
        email: email,
      });

      if (response.status === 200) {
        toast.success("OTP sent successfully");
      } else {
        toast.error("Error in sending OTP");
        console.log("Error in axios", response);
      }
      // Reset the timer
      startTimer();
    } catch (error) {
      console.error(error);
    } finally {
      setIsResending(false);
    }
  }

  const formatTime = (seconds: number) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
      seconds % 60
    ).padStart(2, "0")}`;
  };

  return (
    <Card className="mx-auto w-full max-w-md border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Verify your account
        </CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to your email or phone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({}) => (
                <FormItem className="mx-auto">
                  <FormControl>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <div
                          key={index}
                          className={cn(
                            "relative h-12 w-full max-w-[50px] rounded-xl border border-input bg-background",
                            activeInput === index &&
                              "ring-2 ring-[#0072f5] border-[#0072f5]"
                          )}
                        >
                          <input
                            ref={inputRefs[index]}
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            pattern="\d{1}"
                            maxLength={1}
                            className="absolute inset-0 w-full h-full bg-transparent text-center text-lg font-medium focus:outline-none focus:ring-0 border-0"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={() => handleFocus(index)}
                            onPaste={index === 0 ? handlePaste : undefined}
                          />
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {timer > 0 && <p>{formatTime(timer)}</p>}
              </div>
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto cursor-pointer hover:underline"
                disabled={timer > 0 || isResending}
                onClick={handleResendOTP}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Please check your inbox for the verification code
        </p>
      </CardFooter>
    </Card>
  );
}

export default VerifyOtpForm;
