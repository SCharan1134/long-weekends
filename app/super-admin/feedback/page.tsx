"use client";

import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

type Feedback = {
  id: string;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  createdAt: string;
};

type SortOption = "newest" | "oldest" | "a-z" | "z-a";
type FilterOption = "all" | "general" | "bug" | "feedback" | "other";

export default function FeedbackPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterType, setFilterType] = useState<FilterOption>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 9; // 3x3 grid on desktop

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          sortBy: sortBy,
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (filterType !== "all") {
          params.append("type", filterType);
        }

        const response = await axios.get(`/api/feedback?${params.toString()}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch feedback");
        }

        const result = response.data;
        // Convert ISO date strings to Date objects
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedFeedback = result.data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));

        setFeedback(formattedFeedback);
        setTotalPages(result.meta.totalPages);
        setTotalItems(result.meta.total);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load feedback. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [currentPage, searchQuery, sortBy, filterType, itemsPerPage]);

  // Handle page changes
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, filterType]);

  // Handle search input with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search feedback..."
                className="w-full sm:w-[200px] pl-8 md:w-[300px]"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="a-z">Name (A-Z)</SelectItem>
                <SelectItem value="z-a">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterType}
              onValueChange={(value) => setFilterType(value as FilterOption)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {totalItems > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Showing{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              results
            </div>
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 w-full bg-muted animate-pulse rounded"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : feedback.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              No feedback found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedback.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg font-medium">
                      {item.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {item.email}
                    </p>
                  </div>
                  <Badge
                    variant={
                      item.inquiryType === "bug"
                        ? "destructive"
                        : item.inquiryType === "feedback"
                        ? "secondary"
                        : item.inquiryType === "general"
                        ? "default"
                        : "outline"
                    }
                  >
                    {item.inquiryType}
                  </Badge>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-1">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="line-clamp-4 text-sm">{item.message}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/super-admin/feedback/${item.id}`}
                    className="w-full"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first page, last page, current page, and pages around current page
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-muted-foreground">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-9 h-9 p-0"
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={isLoading}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
