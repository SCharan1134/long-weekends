"use client";
// import { Calendar } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50 w-full sm:px-24 px-5">
      <div className="container flex flex-col gap-8 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex items-center gap-2 font-bold">
              <Image src={"/logo.png"} alt="logo" width={40} height={40} />
              <span className="text-xl">Long Weekends</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Maximize your time off by optimizing your leaves. Our app analyzes
              your salary, paid and unpaid leaves to create the perfect long
              weekend calendar.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://www.facebook.com/share/1BZVVbYDde/"
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              {/* <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link> */}
              <Link
                href="https://www.instagram.com/sricharan_0234?utm_source=qr&igsh=MXJxeTFianZ0eGc1YQ=="
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M7.5 2h9a5.5 5.5 0 0 1 5.5 5.5v9a5.5 5.5 0 0 1-5.5 5.5h-9a5.5 5.5 0 0 1-5.5-5.5v-9A5.5 5.5 0 0 1 7.5 2z"></path>
                  <path d="M12 8.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7z"></path>
                  <path d="M16.5 7.5h.01"></path>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.linkedin.com/in/sri-charan-rayala-18244b228?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                className="text-muted-foreground hover:text-foreground"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#roadmap"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Roadmap
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Beta Program
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/landing/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                {/* <li>
                  <Link
                    href="/landing/blog"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li> */}
                <li>
                  <Link
                    href="/landing/contact-us"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/landing/privacy-policy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/landing/terms-of-service"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/landing/cookie-policy"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Long Weekends. All rights
            reserved.
          </p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
