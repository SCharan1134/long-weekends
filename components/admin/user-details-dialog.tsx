"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "./columns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({
  user,
  open,
  onOpenChange,
}: UserDetailsDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>User Details</span>
            <Badge variant={user.isActive ? "default" : "secondary"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete information about the user.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "User"}
              />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">
                {user.name || "Unnamed User"}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm capitalize">{user.role || "User"}</p>
            </div>
          </div>

          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Company</Label>
                  <p>{user.companyName || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Salary</Label>
                  <p>${user.salary?.toLocaleString() || 0}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Last Active</Label>
                  <p>
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Information */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold mb-4">Leave Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Paid Leaves</Label>
                  <p>{user.paidLeaves || 0} days</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Unpaid Leaves</Label>
                  <p>{user.unpaidLeaves || 0} days</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Total Leaves</Label>
                  <p>
                    {(user.paidLeaves || 0) + (user.unpaidLeaves || 0)} days
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Leave Balance</Label>
                  <p>{user.paidLeaves || 0} days remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="text-sm font-semibold mb-4">
                Account Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">
                    Email Verified
                  </Label>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">
                    Account Status
                  </Label>
                  <Badge variant={user.isActive ? "default" : "secondary"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter>
          <Button onClick={() => redirect(`/super-admin/logs/${user.id}`)}>
            View Logs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
