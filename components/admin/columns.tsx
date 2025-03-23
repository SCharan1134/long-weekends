"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define the User type based on the schema
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  companyName: string | null;
  salary: number | null;
  paidLeaves: number | null;
  unpaidLeaves: number | null;
  isActive: boolean | null;
  lastActive: Date | null;
  image: string | null;
};

export type NewUser = {
  name: string | null;
  email: string | null;
  role: string | null;
  companyName: string | null;
  salary: number | null;
  paidLeaves: number | null;
  unpaidLeaves: number | null;
  isActive: boolean | null;
  image: string | null;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: ({ row, table }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            // Remove this part that was calling onCheckboxClick
          }}
          onClick={(e) => {
            // Stop propagation to prevent row click
            e.stopPropagation();
          }}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback>
              {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name || "Unnamed"}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div>{row.getValue("role") || "user"}</div>,
  },
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => <div>{row.getValue("companyName") || "N/A"}</div>,
  },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Salary
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const salary = row.getValue("salary") as number | null;
      return <div>₹{salary?.toLocaleString() || 0}</div>;
    },
  },
  {
    accessorKey: "paidLeaves",
    header: "Paid Leaves",
    cell: ({ row }) => <div>{row.getValue("paidLeaves") || 0}</div>,
  },
  {
    accessorKey: "unpaidLeaves",
    header: "Unpaid Leaves",
    cell: ({ row }) => <div>{row.getValue("unpaidLeaves") || 0}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean | null;
      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => {
      const lastActive = row.getValue("lastActive") as Date | null;
      return (
        <div>
          {lastActive ? new Date(lastActive).toLocaleDateString() : "Never"}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original;
      const meta = table.options.meta as {
        onToggleActive?: (userId: string) => void;
        onViewDetails?: (user: User) => void;
        onEditUser?: (user: User) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()} // Prevent row click
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(user.id);
                toast.success("copied to clipboard");
              }}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.onViewDetails?.(user)}>
              View user details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta.onEditUser?.(user)}>
              Edit user
            </DropdownMenuItem>
            {user.isActive ? (
              <DropdownMenuItem onClick={() => meta.onToggleActive?.(user.id)}>
                Make inactive
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => meta.onToggleActive?.(user.id)}>
                Make active
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
