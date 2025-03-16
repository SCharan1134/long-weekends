"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useParams } from "next/navigation";
import allPosts from "../posts.json";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the post with the matching slug
    const foundPost = allPosts.find((p) => p.slug === slug);
    setPost(foundPost);
    setIsLoading(false);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <Link href="/" className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-xl">Long Weekends</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 container py-12">
          <div className="mx-auto max-w-3xl space-y-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Post Not Found</h1>
              <p className="text-muted-foreground">
                The blog post you&apos;re looking for doesn&apos;t exist.
              </p>
              <Button asChild>
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Link href="/" className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl">Long Weekends</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="w-full py-12 md:py-24">
          <div className="mx-auto max-w-3xl space-y-8">
            <Link
              href="/landing/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <article className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  {post.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div
                className="prose prose-gray max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold mb-4">Read More</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {allPosts
                  .filter((p) => p.id !== post.id)
                  .slice(0, 2)
                  .map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/landing/blog/${relatedPost.slug}`}
                      className="group block space-y-2"
                    >
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        <Image
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-primary line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/50">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Long Weekends</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Long Weekends. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
