import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Header } from "@/components/header";
import Footer from "@/components/landing/Footer";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <FileQuestion
            className="h-12 w-12 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-bold tracking-tight mb-4">
          Page Not Found
        </h2>

        <p className="text-muted-foreground max-w-md mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved, deleted, or never existed in the first place.
        </p>

        <Button asChild size="lg">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <Footer />
    </div>
  );
}
