"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarX, Download, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data - would be fetched from API in a real app
const leaveHistory = [
  {
    id: 1,
    startDate: new Date(2024, 3, 10),
    endDate: new Date(2024, 3, 12),
    type: "paid",
    status: "approved",
    reason: "Vacation",
    appliedOn: new Date(2024, 2, 15),
  },
  {
    id: 2,
    startDate: new Date(2024, 5, 20),
    endDate: new Date(2024, 5, 21),
    type: "unpaid",
    status: "pending",
    reason: "Personal",
    appliedOn: new Date(2024, 4, 30),
  },
  {
    id: 3,
    startDate: new Date(2024, 1, 5),
    endDate: new Date(2024, 1, 7),
    type: "paid",
    status: "approved",
    reason: "Family event",
    appliedOn: new Date(2024, 0, 20),
  },
  {
    id: 4,
    startDate: new Date(2023, 11, 27),
    endDate: new Date(2023, 11, 29),
    type: "paid",
    status: "approved",
    reason: "Year-end holidays",
    appliedOn: new Date(2023, 10, 15),
  },
  {
    id: 5,
    startDate: new Date(2023, 8, 15),
    endDate: new Date(2023, 8, 19),
    type: "paid",
    status: "approved",
    reason: "Vacation",
    appliedOn: new Date(2023, 7, 25),
  },
];

export function LeaveHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLeaves = leaveHistory.filter((leave) => {
    const matchesSearch = leave.reason
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || leave.status === statusFilter;
    const matchesType = typeFilter === "all" || leave.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const cancelLeave = (id: number) => {
    // In a real app, this would call an API to cancel the leave
    console.log(`Cancelling leave ${id}`);
  };

  const exportLeaveHistory = () => {
    // In a real app, this would generate a CSV or PDF
    console.log("Exporting leave history");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={exportLeaveHistory}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredLeaves.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Range</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    {format(leave.startDate, "MMM d")} -{" "}
                    {format(leave.endDate, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {Math.round(
                      (leave.endDate.getTime() - leave.startDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) + 1}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={leave.type === "paid" ? "secondary" : "outline"}
                    >
                      {leave.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>
                    {format(leave.appliedOn, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                    //   variant={
                    //     leave.status === "approved"
                    //       ? "success"
                    //       : leave.status === "rejected"
                    //       ? "destructive"
                    //       : "outline"
                    //   }
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {leave.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelLeave(leave.id)}
                      >
                        <CalendarX className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border py-8 text-center">
          <CalendarX className="mb-2 h-8 w-8 text-muted-foreground" />
          <h3 className="font-medium">No leaves found</h3>
          <p className="text-sm text-muted-foreground">
            No leave records match your current filters
          </p>
        </div>
      )}
    </div>
  );
}
