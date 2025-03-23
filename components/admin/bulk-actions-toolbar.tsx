"use client";

import { Button } from "@/components/ui/button";
import { UserCheck, UserX, Trash2 } from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  onMakeActive: () => void;
  onMakeInactive: () => void;
  onDelete: () => void;
}

export function BulkActionsToolbar({
  selectedCount,
  onMakeActive,
  onMakeInactive,
  onDelete,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-md mb-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <span className="text-sm font-medium mr-auto">
        {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={onMakeActive}
        className="flex items-center gap-1"
      >
        <UserCheck className="h-4 w-4" />
        <span>Make Active</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onMakeInactive}
        className="flex items-center gap-1"
      >
        <UserX className="h-4 w-4" />
        <span>Make Inactive</span>
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="flex items-center gap-1"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </Button>
    </div>
  );
}
