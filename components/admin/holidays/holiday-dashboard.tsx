"use client";

import { useState, useEffect } from "react";
import { HolidayTable } from "@/components/admin/holidays/holiday-table";
import { HolidayForm } from "@/components/admin/holidays/holiday-form";
import { HolidayDetail } from "@/components/admin/holidays/holiday-detail";
import { SearchAndFilters } from "@/components/admin/holidays/search-and-filters";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Holiday } from "@/types/Holiday";
import { useHolidays } from "@/hooks/use-holidays";
import { toast } from "sonner";
import axios from "axios";

export function HolidayDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    isHolidayLoading,
    holidays,
    isLoading,
    metadata,
    tabledata,
    fetchHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
  } = useHolidays();

  // Apply filters when they change
  useEffect(() => {
    const filters = {
      search: searchTerm || undefined,
      country: countryFilter || undefined,
      year: yearFilter || undefined,
      month: monthFilter || undefined,
      page: currentPage,
    };

    if (searchTerm) filters.search = searchTerm;
    if (countryFilter) filters.country = countryFilter;
    if (yearFilter) filters.year = yearFilter;
    if (monthFilter) filters.month = monthFilter;

    fetchHolidays(filters);
  }, [
    searchTerm,
    countryFilter,
    yearFilter,
    monthFilter,
    currentPage,
    fetchHolidays,
  ]);

  const handleViewDetail = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteHoliday(id).then(() => {
      toast.success("Holiday deleted successfully");
    });
  };

  const handleCreateSubmit = async (
    data: Omit<Holiday, "id" | "createdAt" | "year" | "month" | "day">
  ) => {
    try {
      await createHoliday(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.log(error, "create holiday");
    }
  };

  const handleEditSubmit = async (data: Holiday) => {
    try {
      await updateHoliday(data);
      setIsEditModalOpen(false);
    } catch (error) {
      // Error is already handled in the hook with toast
      console.log(error, "edit holiday");
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= tabledata.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchHolidaysAPI = async () => {
    try {
      const response = await axios.get("/api/fetchholidays");
      if (response.status === 200) {
        toast.success("Holidays fetched successfully");
      }
    } catch (error) {
      console.log(error, "error in fetch holidays from api");
      toast.error("Holidays fetched successfully");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Holiday Management</h1>
        <div className="flex items-center gap-4">
          <Button onClick={fetchHolidaysAPI}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Fetch Holidays
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Holiday
          </Button>
        </div>
      </div>

      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
        monthFilter={monthFilter}
        onMonthFilterChange={setMonthFilter}
        countries={metadata.countries}
        years={metadata.years}
      />

      <HolidayTable
        holidays={holidays}
        isLoading={isLoading}
        page={currentPage}
        totalPages={tabledata.totalPages}
        onPageChange={handlePageChange}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isCreateModalOpen && (
        <HolidayForm
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
          title="Create New Holiday"
          isLoading={isHolidayLoading}
        />
      )}

      {isEditModalOpen && selectedHoliday && (
        <HolidayForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
          initialData={selectedHoliday}
          title="Edit Holiday"
          isLoading={isHolidayLoading}
        />
      )}

      {isDetailModalOpen && selectedHoliday && (
        <HolidayDetail
          holiday={selectedHoliday}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onEdit={() => {
            setIsDetailModalOpen(false);
            setIsEditModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
