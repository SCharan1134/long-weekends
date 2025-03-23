"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Holiday } from "@/types/Holiday";

// Update the form schema to handle both string and Date types for date and createdAt
const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  countryId: z.string().min(1, "Country ID is required"),
  country: z.string().min(1, "Country is required"),
  date: z.union([
    z.date({
      required_error: "Date is required",
    }),
    z.string().refine((val) => !isNaN(new Date(val).getTime()), {
      message: "Invalid date format",
    }),
  ]),
  year: z.number().int().positive().optional(),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  createdAt: z.union([z.date(), z.string()]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface HolidayFormProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
  initialData?: Holiday;
  title: string;
  isLoading: boolean;
}

export function HolidayForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
  isLoading,
}: HolidayFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      countryId: "",
      country: "",
      date: new Date(),
    },
  });

  // Update the useEffect to properly handle date conversion
  useEffect(() => {
    if (initialData) {
      // Ensure date is a Date object
      const formattedData = {
        ...initialData,
        date:
          initialData.date instanceof Date
            ? initialData.date
            : new Date(initialData.date),
        createdAt:
          initialData.createdAt instanceof Date
            ? initialData.createdAt
            : initialData.createdAt
            ? new Date(initialData.createdAt)
            : undefined,
      };

      form.reset(formattedData);
    }
  }, [initialData, form]);

  // Update the handleSubmit function to ensure proper date handling
  const handleSubmit = async (values: FormValues) => {
    try {
      // Ensure date is a Date object
      const formattedData = {
        ...values,
        date:
          values.date instanceof Date
            ? values.date
            : new Date(values.date as string),
      };

      await onSubmit(formattedData);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.log(error, "submiting holiday");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Holiday name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="countryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Country ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          field.value instanceof Date
                            ? field.value
                            : new Date(field.value)
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Holiday description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
