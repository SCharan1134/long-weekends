"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileImageUpload } from "@/components/common/profile-image-upload";
import { toast } from "sonner";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Skeleton } from "../ui/skeleton";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  image: z.string().optional(),
  companyName: z.string().optional(),
  salary: z.coerce.number().int().nonnegative().optional(),
  paidLeaves: z.coerce.number().int().nonnegative().optional(),
  unpaidLeaves: z.coerce.number().int().nonnegative().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { data: session } = useSession();
  const user = session?.user;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      companyName: "",
      salary: 0,
      paidLeaves: 0,
      unpaidLeaves: 0,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);

    try {
      // Simulate API call
      const response = await axios.post("/api/user/profile", data);

      if (response.status === 200) {
        toast.success("Your profile has been updated successfully.");
      }
      // In a real app, you would update the user profile here
      //   await updateUserProfile(data)
    } catch (error) {
      toast.error("Your profile could not be updated. Please try again.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/user/profile");
        if (response.status === 200) {
          form.setValue("name", response.data.name);
          form.setValue("email", response.data.email);
          form.setValue("companyName", response.data.companyName);
          form.setValue("salary", response.data.salary);
          form.setValue("paidLeaves", response.data.paidLeaves);
          form.setValue("unpaidLeaves", response.data.unpaidLeaves);
          if (response.data.image) {
            form.setValue("image", response.data.image);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
          <ProfileImageUpload
            currentImage={form.getValues("image") || session?.user?.image}
            name={form.getValues("name") || session?.user?.name}
            onImageUploaded={(url: string) => {
              form.setValue("image", url);
            }}
          />
          <div>
            <h3 className="text-lg font-medium">
              {form.getValues("name") || session?.user?.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {form.getValues("email") || session?.user?.email}
            </p>
            <div className="flex items-center mt-1">
              <div
                className={`h-2 w-2 rounded-full mr-2 ${
                  user?.isEmailVerified ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-xs">
                {user?.isEmailVerified
                  ? "Email verified"
                  : "Email not verified"}
              </span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="Your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your company" {...field} />
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
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidLeaves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Leaves</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
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
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen  text-white p-6">
      {/* Profile section with avatar and basic info */}
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-20 w-20 rounded-full bg-gray-700" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-4 w-48 bg-gray-700" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full bg-gray-700" />
            <Skeleton className="h-4 w-24 bg-gray-700" />
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Name</p>
          <Skeleton className="h-10 w-full bg-gray-700 rounded" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Email</p>
          <Skeleton className="h-10 w-full bg-gray-700 rounded" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Company Name</p>
          <Skeleton className="h-10 w-full bg-gray-700 rounded" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Salary</p>
          <Skeleton className="h-10 w-full bg-gray-700 rounded" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Paid Leaves</p>
          <Skeleton className="h-10 w-full bg-gray-700 rounded" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Unpaid Leaves</p>
          <Skeleton className="h-10 w-full bg-gray-700 rounded" />
        </div>
      </div>

      {/* Save button */}
      <div className="mt-8">
        <Skeleton className="h-12 w-36 bg-gray-700 rounded" />
      </div>
    </div>
  );
}
