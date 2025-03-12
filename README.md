This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
\
model Holiday {
id String @id @default(uuid())
name String
description String
country String
date DateTime
url String
createdAt DateTime @default(now())
}

http://localhost:3000/api/fetchHolidays
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CALENDARIFIC_API_URL = "https://calendarific.com/api/v2/holidays";
const API_KEY = "aqzieotOk6VC2BCmOwz5o6FaxH9MNwV1";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== "GET") {
return res.status(405).json({ message: "Only GET requests allowed" });
}

try {
// Fetch data from the external API
const response = await fetch(`${CALENDARIFIC_API_URL}?api_key=${API_KEY}&country=IN&year=2025`);
const data = await response.json();

    if (!data.response || !data.response.holidays) {
      return res.status(500).json({ message: "Invalid API response" });
    }

    // Filter only "National holiday"
    const nationalHolidays = data.response.holidays.filter((holiday: any) =>
      holiday.type.includes("National holiday")
    );

    // Save to database
    const savedHolidays = await Promise.all(
      nationalHolidays.map((holiday: any) =>
        prisma.holiday.upsert({
          where: { name: holiday.name },
          update: {},
          create: {
            name: holiday.name,
            description: holiday.description,
            country: holiday.country.name,
            date: new Date(holiday.date.iso),
            url: holiday.canonical_url,
          },
        })
      )
    );

    return res.status(200).json({ message: "Holidays saved successfully", savedHolidays });

} catch (error) {
console.error("Error fetching holidays:", error);
return res.status(500).json({ message: "Internal Server Error" });
}
}

/pages/api/getHolidays.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
if (req.method !== "GET") {
return res.status(405).json({ message: "Only GET requests allowed" });
}

try {
const holidays = await prisma.holiday.findMany();
return res.status(200).json(holidays);
} catch (error) {
console.error("Error fetching holidays:", error);
return res.status(500).json({ message: "Internal Server Error" });
}
}
