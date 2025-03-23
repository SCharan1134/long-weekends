import { logUserActivity } from "@/lib/logActivity";
import prisma from "@/lib/prisma";
import { UserActionType } from "@/types/UserActionTypes";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "name";
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const isActive = searchParams.get("isActive");

    // Calculate pagination values
    const skip = (page - 1) * limit;

    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Add search filter if provided
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Add active filter if provided
    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === "true";
    }

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyName: true,
        salary: true,
        paidLeaves: true,
        unpaidLeaves: true,
        isActive: true,
        lastActive: true,
        image: true,
      },
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where });
    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        pages: totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    // Validate required fields
    if (!userData.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name: userData.name || null,
        email: userData.email,
        role: userData.role || "user",
        companyName: userData.companyName || null,
        salary: userData.salary || 0,
        paidLeaves: userData.paidLeaves || 0,
        unpaidLeaves: userData.unpaidLeaves || 0,
        isActive: userData.isActive || false,
        lastActive: new Date(),
      },
    });

    await logUserActivity(newUser.id, UserActionType.ADMIN_CREATED_USER, {
      ip: request?.headers?.get("x-forwarded-for") || "Unknown",
      userAgent: request?.headers?.get("user-agent") || "Unknown",
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
