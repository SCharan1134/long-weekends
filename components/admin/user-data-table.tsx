"use client";

import { useState, useEffect } from "react";
import { columns, type User, type NewUser } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { UserDetailsDialog } from "./user-details-dialog";
import { UserFormDialog } from "./user-form-dialog";
import { BulkActionsToolbar } from "./bulk-actions-toolbar";
import type { RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";

interface PaginationInfo {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export function UserDataTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [resetKey, setResetKey] = useState(0);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editMode, setEditMode] = useState<"add" | "edit">("add");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder,
      });

      if (debouncedSearchQuery) {
        queryParams.append("search", debouncedSearchQuery);
      }

      const response = await fetch(
        `/api/admin/users?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when pagination, search, or sort changes
  useEffect(() => {
    fetchUsers();
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearchQuery,
    sortBy,
    sortOrder,
  ]);

  // Get selected user IDs from row selection
  const getSelectedUserIds = (): string[] => {
    return Object.keys(rowSelection).map((index) => {
      return users[Number.parseInt(index)].id;
    });
  };

  const toggleUserActiveStatus = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const action = user.isActive ? "deactivate" : "activate";

      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          userIds: [userId],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} user`);
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                isActive: !user.isActive,
                lastActive: user.isActive ? user.lastActive : new Date(),
              }
            : user
        )
      );

      toast.success(`User ${action}d successfully.`);
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status. Please try again.");
    }
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  // Add this function to handle view details from dropdown
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditMode("edit");
    setAddUserOpen(true);
  };

  const handleUserFormSubmit = async (userData: NewUser) => {
    try {
      let response;

      if (editMode === "add") {
        // Add new user
        response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else {
        // Edit existing user
        if (!selectedUser) return;

        response = await fetch(`/api/admin/users/${selectedUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editMode === "add" ? "create" : "update"} user`
        );
      }

      // Refresh the user list
      fetchUsers();

      toast.success(
        `User ${editMode === "add" ? "created" : "updated"} successfully.`
      );
    } catch (error) {
      console.error(
        `Error ${editMode === "add" ? "creating" : "updating"} user:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${
              editMode === "add" ? "create" : "update"
            } user. Please try again.`
      );
    }
  };

  const resetSelection = () => {
    setRowSelection({});
    setResetKey((prev) => prev + 1);
  };

  const handleBulkMakeActive = async () => {
    const selectedIds = getSelectedUserIds();
    if (selectedIds.length === 0) return;

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "activate",
          userIds: selectedIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to activate users");
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedIds.includes(user.id)
            ? { ...user, isActive: true, lastActive: new Date() }
            : user
        )
      );

      // Clear row selection after action
      resetSelection();

      toast.success(`${selectedIds.length} users have been activated.`);
    } catch (error) {
      console.error("Error activating users:", error);
      toast.error("Failed to activate users. Please try again.");
    }
  };

  const handleBulkMakeInactive = async () => {
    const selectedIds = getSelectedUserIds();
    if (selectedIds.length === 0) return;

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deactivate",
          userIds: selectedIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate users");
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedIds.includes(user.id) ? { ...user, isActive: false } : user
        )
      );

      // Clear row selection after action
      resetSelection();

      toast.success(`${selectedIds.length} users have been deactivated.`);
    } catch (error) {
      console.error("Error deactivating users:", error);
      toast.error("Failed to deactivate users. Please try again.");
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = getSelectedUserIds();
    if (selectedIds.length === 0) return;

    try {
      const response = await fetch("/api/admin/users/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          userIds: selectedIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete users");
      }

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.filter((user) => !selectedIds.includes(user.id))
      );

      // Clear row selection after action
      resetSelection();

      toast.success(`${selectedIds.length} users have been deleted.`);
    } catch (error) {
      console.error("Error deleting users:", error);
      toast.error("Failed to delete users. Please try again.");
    }
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination((prev) => ({ ...prev, page: 1, limit }));
  };

  const handleSort = (column: string, order: "asc" | "desc") => {
    setSortBy(column);
    setSortOrder(order);
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4 border-b  dark:bg-zinc-900 backdrop-blur dark:supports-[backdrop-filter]:bg-zinc-900 p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Management</h2>
        <Button
          variant="default"
          onClick={() => {
            setEditMode("add");
            setSelectedUser(null);
            setAddUserOpen(true);
          }}
        >
          Add User
        </Button>
      </div>

      <BulkActionsToolbar
        selectedCount={selectedCount}
        onMakeActive={handleBulkMakeActive}
        onMakeInactive={handleBulkMakeInactive}
        onDelete={handleBulkDelete}
      />

      <DataTable
        key={resetKey}
        columns={columns}
        data={users}
        onToggleActive={toggleUserActiveStatus}
        onRowClick={handleRowClick}
        onViewDetails={handleViewDetails} // Pass the handler to the DataTable
        onEditUser={handleEditUser}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSort={handleSort}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={loading}
      />

      <UserDetailsDialog
        user={selectedUser}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <UserFormDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSubmit={handleUserFormSubmit}
        user={selectedUser}
        mode={editMode}
      />
    </div>
  );
}
