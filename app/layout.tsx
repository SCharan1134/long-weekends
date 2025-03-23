import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import ReduxProvider from "@/store/store-provider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LongWeekends - Optimize Your Time Off",
  description:
    "Plan your leaves strategically around public holidays to maximize your time off.",
  keywords: [
    "Long Weekends",
    "time off",
    "holiday optimization",
    "leave planning",
    "work-life balance",
  ],
  metadataBase: new URL("https://long-weekends.vercel.app/"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LongWeekends - Optimize Your Time Off",
    description:
      "Maximize your time off by planning leaves strategically around public holidays.",
    url: "https://yourwebsite.com",
    siteName: "LongWeekends",
    // images: [
    //   {
    //     url: "https://yourwebsite.com/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "LongWeekends preview image",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LongWeekends - Optimize Your Time Off",
    description: "Plan your leaves efficiently and enjoy more long weekends.",
    // images: ["https://yourwebsite.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ReduxProvider>{children}</ReduxProvider>
          </AuthProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
