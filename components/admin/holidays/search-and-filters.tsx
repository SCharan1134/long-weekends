"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { format } from "date-fns";

interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  countryFilter: string | null;
  onCountryFilterChange: (value: string | null) => void;
  yearFilter: number | null;
  onYearFilterChange: (value: number | null) => void;
  monthFilter: number | null;
  onMonthFilterChange: (value: number | null) => void;
  countries: string[];
  years: number[];
}

export function SearchAndFilters({
  searchTerm,
  onSearchChange,
  countryFilter,
  onCountryFilterChange,
  yearFilter,
  onYearFilterChange,
  monthFilter,
  onMonthFilterChange,
  countries,
  years,
}: SearchAndFiltersProps) {
  const [searchInputValue, setSearchInputValue] = useState(searchTerm);

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: format(new Date(0, i), "MMMM"),
  }));

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInputValue !== searchTerm) {
        onSearchChange(searchInputValue);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInputValue, searchTerm, onSearchChange]);

  const clearFilters = () => {
    setSearchInputValue("");
    onSearchChange("");
    onCountryFilterChange(null);
    onYearFilterChange(null);
    onMonthFilterChange(null);
  };

  const hasActiveFilters =
    searchTerm || countryFilter || yearFilter || monthFilter;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search holidays..."
          className="pl-8"
          value={searchInputValue}
          onChange={(e) => setSearchInputValue(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Select
          value={countryFilter || "all"}
          onValueChange={(value) =>
            onCountryFilterChange(value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={yearFilter?.toString() || "all"}
          onValueChange={(value) =>
            onYearFilterChange(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={monthFilter?.toString() || "all"}
          onValueChange={(value) =>
            onMonthFilterChange(value === "all" ? null : Number(value))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
