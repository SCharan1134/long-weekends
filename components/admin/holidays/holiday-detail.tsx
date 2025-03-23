"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil } from "lucide-react";
import type { Holiday } from "@/types/Holiday";
import { format } from "date-fns";

interface HolidayDetailProps {
  holiday: Holiday;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function HolidayDetail({
  holiday,
  isOpen,
  onClose,
  onEdit,
}: HolidayDetailProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{holiday.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(holiday.date), "PPP")}</span>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Country
            </h3>
            <p>{holiday.country}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Description
            </h3>
            <p className="whitespace-pre-line">{holiday.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Year
              </h3>
              <p>{holiday.year}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Month
              </h3>
              <p>{format(new Date(0, holiday.month - 1), "MMMM")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Day</h3>
              <p>{holiday.day}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Created At
            </h3>
            <p>{format(new Date(holiday.createdAt), "PPP")}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
