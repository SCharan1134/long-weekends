"use client";

import { formatDistanceToNow } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const id = params.id as string;

  // Fetch feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/feedback/${id}`);

        if (response.status !== 200) {
          if (response.status === 404) {
            toast.error(
              "The feedback you're looking for doesn't exist or has been deleted."
            );
            router.push("/feedback");
            return;
          }
          throw new Error("Failed to fetch feedback");
        }

        const data = response.data;
        setFeedback(data);
        setIsResolved(data.isResolved);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        toast.error("Failed to load feedback details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [id, router]);

  // Handle marking as resolved
  const handleMarkAsResolved = async () => {
    try {
      setIsResolved(true);

      const response = await axios.patch(`/api/feedback/${id}`, {
        isResolved: true,
      });

      if (response.status !== 200) {
        throw new Error("Failed to mark feedback as resolved");
      }
      toast.success("Feedback has been marked as resolved.");
    } catch (error) {
      console.error("Error marking feedback as resolved:", error);
      toast.error("Failed to mark feedback as resolved.");
      setIsResolved(false);
    }
  };

  // Handle deleting feedback
  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      const response = await axios.delete(`/api/feedback/${id}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete feedback");
      }

      toast.success("Feedback has been deleted.");

      router.push("/super-admin/feedback");
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback.");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-40 bg-muted animate-pulse rounded mb-4"></div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="h-10 w-40 bg-muted animate-pulse rounded"></div>
              <div className="h-10 w-40 bg-muted animate-pulse rounded"></div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Feedback not found.</p>
            <Link href="/super-admin/feedback">
              <Button variant="link" className="mt-4">
                Return to feedback list
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/super-admin/feedback">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to feedback</span>
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Feedback Details
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-xl font-medium">
                {feedback.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{feedback.email}</p>
            </div>
            <Badge
              variant={
                feedback.inquiryType === "bug"
                  ? "destructive"
                  : feedback.inquiryType === "feedback"
                  ? "secondary"
                  : feedback.inquiryType === "general"
                  ? "default"
                  : "outline"
              }
            >
              {feedback.inquiryType}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-4">
              Submitted{" "}
              {formatDistanceToNow(new Date(feedback.createdAt), {
                addSuffix: true,
              })}
            </div>
            <Separator className="my-4" />
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>{feedback.message}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant={isResolved ? "default" : "outline"}
              onClick={handleMarkAsResolved}
              disabled={isResolved}
            >
              {isResolved ? "Resolved" : "Mark as Resolved"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Feedback"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this feedback from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 dark:bg-red-800 dark:text-white"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
