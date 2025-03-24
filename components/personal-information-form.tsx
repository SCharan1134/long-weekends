"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  //   name: z.string().min(2, {
  //     message: "Name must be at least 2 characters.",
  //   }),
  salary: z.coerce.number().positive({
    message: "Salary must be a positive number.",
  }),
  paidLeaves: z.coerce
    .number()
    .int({
      message: "Paid leaves must be a whole number.",
    })
    .nonnegative({
      message: "Paid leaves cannot be negative.",
    }),
  unpaidLeaves: z.coerce
    .number()
    .int({
      message: "Unpaid leaves must be a whole number.",
    })
    .nonnegative({
      message: "Unpaid leaves cannot be negative.",
    }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

function PersonalInformationForm() {
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      const decodedEmail = decodeURIComponent(session.user.email);
      const match = decodedEmail.match(/@(.+?)\.com/);
      if (match && match[1] !== "gmail") {
        form.setValue("companyName", match[1]);
      } else {
        form.setValue("companyName", "");
      }
      router.replace(`/personal-information?email=${decodedEmail}`);
    }
  }, [session]);
  const params = useSearchParams();
  const email = params.get("email");

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //   name: "",
      salary: 0,
      paidLeaves: 0,
      unpaidLeaves: 0,
      companyName: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);

    try {
      // Here you would typically call your API to save the employee data
      const response = await axios.post("/api/auth/setuser", {
        email: email,
        salary: data.salary,
        paidLeaves: data.paidLeaves,
        unpaidLeaves: data.unpaidLeaves,
        companyName: data.companyName,
      });
      if (response.status === 200) {
        toast.success("User Details Saved Successfully");
        if (session && session.user) {
          router.push(`/dashboard`);
        } else {
          router.push(`/sign-in`);
        }
      } else {
        toast.error("Error in Saving User Details");
        console.log("Error in axios", response);
      }
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Personal Information
        </CardTitle>
        <CardDescription>
          Enter peronsal details and leave allocation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Per Annum</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50000"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(
                          value === "" ? 0 : Number.parseFloat(value)
                        );
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Annual salary in your local currency
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paidLeaves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Leaves</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? 0 : Number.parseInt(value, 10)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unpaidLeaves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unpaid Leaves</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? 0 : Number.parseInt(value, 10)
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Details"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default PersonalInformationForm;
