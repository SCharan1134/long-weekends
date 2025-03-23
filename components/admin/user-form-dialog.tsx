"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { User, NewUser } from "./columns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: NewUser) => void;
  user?: User | null;
  mode: "add" | "edit";
}

// Update the formSchema to explicitly handle null values for companyName
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  role: z.string().default("user"),
  companyName: z.string().nullable(), // Changed from optional() to make it explicitly nullable
  salary: z.coerce
    .number()
    .min(0, { message: "Salary must be a positive number." })
    .default(0),
  paidLeaves: z.coerce
    .number()
    .min(0, { message: "Paid leaves must be a positive number." })
    .default(0),
  unpaidLeaves: z.coerce
    .number()
    .min(0, { message: "Unpaid leaves must be a positive number." })
    .default(0),
  isActive: z.boolean().default(false),
});

// Rename component to UserFormDialog to better reflect its dual purpose
export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
  mode,
}: UserFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      companyName: null,
      salary: 0,
      paidLeaves: 0,
      unpaidLeaves: 0,
      isActive: false,
    },
  });

  // Update form values when editing a user
  useEffect(() => {
    if (mode === "edit" && user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        companyName: user.companyName,
        salary: user.salary || 0,
        paidLeaves: user.paidLeaves || 0,
        unpaidLeaves: user.unpaidLeaves || 0,
        isActive: user.isActive || false,
      });
    } else if (mode === "add") {
      form.reset({
        name: "",
        email: "",
        role: "user",
        companyName: null,
        salary: 0,
        paidLeaves: 0,
        unpaidLeaves: 0,
        isActive: false,
      });
    }
  }, [form, user, mode, open]);

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Ensure companyName is never undefined
    onSubmit({
      ...values,
      companyName: values.companyName ?? null, // Convert undefined to null if needed
      image: user?.image || null,
    });
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the details to create a new user account."
              : "Update the user details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <FormField
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
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Update the companyName field rendering to handle null properly */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Acme Inc"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? null : value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Financial Information */}
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Leave Information */}
              <FormField
                control={form.control}
                name="paidLeaves"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paid Leaves</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
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
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Is this user account active?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Create User" : "Update User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
