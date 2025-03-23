import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "9");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || undefined;
    const sortBy = searchParams.get("sortBy") || "newest";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    if (type && type !== "all") {
      where.inquiryType = type;
    }

    // Build orderBy for sorting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = {};
    switch (sortBy) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "a-z":
        orderBy = { name: "asc" };
        break;
      case "z-a":
        orderBy = { name: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    // Get total count for pagination
    const total = await prisma.feedback.count({ where });

    // Get paginated feedback
    const feedback = await prisma.feedback.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: feedback,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
