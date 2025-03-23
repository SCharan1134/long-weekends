"use client";

import { useState, useEffect } from "react";
import { HolidayTable } from "@/components/user/holiday-table";
import { HolidayDetail } from "@/components/user/holiday-detail";
import { SearchAndFilters } from "@/components/user/search-and-filters";
import type { Holiday } from "@/types/Holiday";
import { useHolidays } from "@/hooks/use-holidays";

export function HolidayDashboard() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState<number | null>(null);
  const [monthFilter, setMonthFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { holidays, isLoading, metadata, tabledata, fetchHolidays } =
    useHolidays();

  // Apply filters when they change
  useEffect(() => {
    const filters = {
      search: searchTerm || undefined,
      country: "India",
      year: yearFilter || undefined,
      month: monthFilter || undefined,
      page: currentPage,
    };

    if (searchTerm) filters.search = searchTerm;
    filters.country = "India";
    if (yearFilter) filters.year = yearFilter;
    if (monthFilter) filters.month = monthFilter;

    fetchHolidays(filters);
  }, [searchTerm, yearFilter, monthFilter, currentPage, fetchHolidays]);

  const handleViewDetail = (holiday: Holiday) => {
    setSelectedHoliday(holiday);
    setIsDetailModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= tabledata.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <SearchAndFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
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
      />

      {isDetailModalOpen && selectedHoliday && (
        <HolidayDetail
          holiday={selectedHoliday}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
}
