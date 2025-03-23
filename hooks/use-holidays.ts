"use client";

import { useState, useEffect, useCallback } from "react";
import type { Holiday } from "@/types/Holiday";
import { toast } from "sonner";
import axios from "axios";

export function useHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHolidayLoading, setIsHolidayLoading] = useState(false);
  const [metadata, setMetadata] = useState<{
    countries: string[];
    years: number[];
  }>({ countries: [], years: [] });
  const [tabledata, setTabledata] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Fetch all holidays with optional filters
  const fetchHolidays = useCallback(
    async (filters?: {
      search?: string;
      country?: string;
      year?: number;
      month?: number;
      page?: number;
      limit?: number;
    }) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters?.search) params.append("search", filters.search);
        if (filters?.country) params.append("country", filters.country);
        if (filters?.year) params.append("year", filters.year.toString());
        if (filters?.month) params.append("month", filters.month.toString());
        params.append("page", (filters?.page ?? tabledata.page).toString());
        params.append("limit", (filters?.limit ?? tabledata.limit).toString());

        const response = await axios.get(
          `/api/admin/holidays?${params.toString()}`
        );

        setHolidays(
          response.data.holidays.map((holiday: Holiday) => ({
            ...holiday,
            date: new Date(holiday.date),
            createdAt: new Date(holiday.createdAt),
          }))
        );
        setTabledata(response.data.metadata);
      } catch (error) {
        console.error("Error fetching holidays:", error);
        toast.error("Failed to fetch holidays");
      } finally {
        setIsLoading(false);
      }
    },
    [tabledata.page, tabledata.limit]
  );

  // Fetch metadata for filters
  const fetchMetadata = useCallback(async () => {
    try {
      const response = await axios.get("/api/admin/holidays/metadata");
      setMetadata(response.data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      toast.error("Failed to fetch filter options");
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchHolidays();
    fetchMetadata();
  }, [fetchHolidays, fetchMetadata]);

  // Create a new holiday
  const createHoliday = async (
    data: Omit<Holiday, "id" | "createdAt" | "year" | "month" | "day">
  ) => {
    try {
      setIsHolidayLoading(true);
      const formattedData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : data.date,
      };
      const response = await axios.post("/api/admin/holidays", formattedData);

      await fetchHolidays();
      await fetchMetadata();

      toast.success("Holiday created successfully");

      setIsHolidayLoading(false);
      return {
        ...response.data,
        date: new Date(response.data.date),
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error("Error creating holiday:", error);
      toast.error("Failed to create holiday");
      setIsHolidayLoading(false);
      throw error;
    }
  };

  // Update an existing holiday
  const updateHoliday = async (data: Holiday) => {
    try {
      setIsHolidayLoading(true);
      const response = await axios.put(`/api/admin/holidays/${data.id}`, data);

      await fetchHolidays();
      await fetchMetadata();

      toast.success("Holiday updated successfully");

      setIsHolidayLoading(false);
      return {
        ...response.data,
        date: new Date(response.data.date),
        createdAt: new Date(response.data.createdAt),
      };
    } catch (error) {
      console.error("Error updating holiday:", error);
      toast.error("Failed to update holiday");
      setIsHolidayLoading(false);
      throw error;
    }
  };

  // Delete a holiday
  const deleteHoliday = async (id: string) => {
    try {
      setIsHolidayLoading(true);
      await axios.delete(`/api/admin/holidays/${id}`);

      await fetchHolidays();
      await fetchMetadata();

      toast.success("Holiday deleted successfully");
      setIsHolidayLoading(false);
      return true;
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast.error("Failed to delete holiday");
      setIsHolidayLoading(false);
      throw error;
    }
  };

  return {
    isHolidayLoading,
    holidays,
    isLoading,
    metadata,
    tabledata,
    fetchHolidays,
    createHoliday,
    updateHoliday,
    deleteHoliday,
  };
}
