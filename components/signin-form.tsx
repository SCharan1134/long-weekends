"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Eye, EyeOff } from "lucide-react";

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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  EMAIL_PASSWORD_REQUIRED: "Please enter both email and password.",
  USER_NOT_FOUND: "No user found with this email.",
  INVALID_CREDENTIALS: "Incorrect password. Try again.",
  AUTHENTICATION_FAILED: "Something went wrong. Please try again.",
};

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function SignInForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;
    toast.error(
      errorMessages[error] || "Something went wrong. Please try again."
    );
  }, [error]);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      // Here you would typically call your authentication API
      const { email, password } = data;
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        // callbackUrl: "/dashboard",
      });
      if (result?.error) {
        toast.error("uh oh! Something went Wrong");
      } else if (result?.ok) {
        toast.success("Login successful! Redirecting...");
        router.push("/dashboard");
      }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleGoogle() {
    const result = await signIn("google", {
      redirect: true,
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      toast.error("Invalid Credentials");
      console.log(result.error);
    } else if (result?.ok) {
      toast.success("Login successfull");
      router.push("/dashboard");
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/send-otp"
                      className="text-sm font-medium text-primary cursor-pointer hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          type="button"
          onClick={handleGoogle}
        >
          <svg
            className="mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Sign in with Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-primary">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignInForm;
