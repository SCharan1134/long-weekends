"use client";

// import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";
import type { Holiday } from "@/types/Holiday";
import { format } from "date-fns";

interface HolidayTableProps {
  holidays: Holiday[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onView: (holiday: Holiday) => void;
  onEdit: (holiday: Holiday) => void;
  onDelete: (id: string) => void;
}

export function HolidayTable({
  holidays,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
}: HolidayTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : holidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No holidays found.
                </TableCell>
              </TableRow>
            ) : (
              holidays.map((holiday) => (
                <TableRow key={holiday.id}>
                  <TableCell className="font-medium">{holiday.name}</TableCell>
                  <TableCell>{holiday.country}</TableCell>
                  <TableCell>{format(new Date(holiday.date), "PPP")}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {holiday.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(holiday)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(holiday)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(holiday.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Server-side Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>
          <div className="text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      )}
    </div>
  );
}
