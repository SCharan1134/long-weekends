"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import policyData from "./policy.json";
import Footer from "@/components/landing/Footer";
import { Header } from "@/components/header";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Register section refs
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    // Observe all section elements
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      observer.observe(section);
      sectionRefs.current[section.id] = section as HTMLElement;
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId];
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
      setIsSidebarOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="w-full sm:px-24 px-5 py-8 md:py-12">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mt-8 flex flex-col lg:flex-row lg:gap-12 ">
            {/* Mobile Navigation */}
            <div className="mb-8 lg:hidden">
              <Button
                variant="outline"
                className="flex w-full items-center justify-between"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <span>Navigate Policy</span>
                {isSidebarOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {isSidebarOpen && (
                <div className="mt-2 rounded-md border bg-background p-4 shadow-sm">
                  <nav className="flex flex-col space-y-1">
                    <button
                      onClick={() => scrollToSection("introduction")}
                      className={cn(
                        "rounded-md px-3 py-2 text-left text-sm hover:bg-blue-600/10",
                        activeSection === "introduction" &&
                          "bg-blue-600/10 font-medium text-blue-600"
                      )}
                    >
                      Introduction
                    </button>
                    {policyData.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "rounded-md px-3 py-2 text-left text-sm hover:bg-blue-600/10",
                          activeSection === section.id &&
                            "bg-blue-600/10 font-medium text-blue-600"
                        )}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
              <div className="sticky top-32">
                <div className="mb-4 rounded-md border bg-muted/50 p-4">
                  <h3 className="mb-2 font-medium">Last Updated</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(policyData.lastUpdated)}
                  </p>
                </div>
                <div className="rounded-md border bg-background p-4">
                  <h3 className="mb-4 font-medium">On This Page</h3>
                  <nav className="flex flex-col space-y-1">
                    <button
                      onClick={() => scrollToSection("introduction")}
                      className={cn(
                        "rounded-md px-3 py-2 text-left text-sm hover:bg-blue-600/10",
                        activeSection === "introduction" &&
                          "bg-blue-600/10 font-medium text-blue-600"
                      )}
                    >
                      Introduction
                    </button>
                    {policyData.sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "rounded-md px-3 py-2 text-left text-sm hover:bg-blue-600/10",
                          activeSection === section.id &&
                            "bg-blue-600/10 font-medium text-blue-600"
                        )}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/landing/contact-us">
                      <span className="flex items-center gap-2">
                        Contact Us
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:flex-1">
              <div className="mb-8 space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Privacy Policy
                </h1>
                <p className="text-muted-foreground">
                  Last updated: {formatDate(policyData.lastUpdated)}
                </p>
              </div>

              <div className="prose prose-gray max-w-none dark:prose-invert">
                <section
                  id="introduction"
                  ref={(el) => {
                    sectionRefs.current["introduction"] = el;
                  }}
                >
                  <h2 className="text-xl ">{policyData.introduction.title}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: policyData.introduction.content,
                    }}
                  />
                </section>

                {policyData.sections.map((section) => (
                  <section
                    key={section.id}
                    id={section.id}
                    ref={(el) => {
                      sectionRefs.current[section.id] = el;
                    }}
                    className="mt-8 pt-4"
                  >
                    <h2 className="text-xl ">{section.title}</h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
