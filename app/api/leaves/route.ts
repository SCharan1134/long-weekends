import { NextResponse } from "next/server";

// In a real app, this would interact with a database using Prisma
export async function GET() {
  // Mock data for leaves
  const leaves = [
    {
      id: 1,
      startDate: "2024-04-10",
      endDate: "2024-04-12",
      type: "paid",
      status: "approved",
      reason: "Vacation",
      appliedOn: "2024-03-15",
    },
    {
      id: 2,
      startDate: "2024-06-20",
      endDate: "2024-06-21",
      type: "unpaid",
      status: "pending",
      reason: "Personal",
      appliedOn: "2024-05-30",
    },
    {
      id: 3,
      startDate: "2024-02-05",
      endDate: "2024-02-07",
      type: "paid",
      status: "approved",
      reason: "Family event",
      appliedOn: "2024-01-20",
    },
  ];

  return NextResponse.json(leaves);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    if (!body.startDate || !body.endDate || !body.type || !body.reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real app, this would create a new leave in the database
    // const newLeave = await prisma.leave.create({
    //   data: {
    //     startDate: new Date(body.startDate),
    //     endDate: new Date(body.endDate),
    //     type: body.type,
    //     reason: body.reason,
    //     status: "pending",
    //     userId: body.userId, // From authenticated user
    //   },
    // })

    // Mock response
    const newLeave = {
      id: Math.floor(Math.random() * 1000),
      startDate: body.startDate,
      endDate: body.endDate,
      type: body.type,
      reason: body.reason,
      status: "pending",
      appliedOn: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json(newLeave, { status: 201 });
  } catch (error) {
    console.error("Error creating leave:", error);
    return NextResponse.json(
      { error: "Failed to create leave request" },
      { status: 500 }
    );
  }
}
