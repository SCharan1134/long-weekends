import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

export async function GET(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const id = params.id;

    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const id = params.id;
    const body = await request.json();
    const { isResolved } = body;

    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Update feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id },
      data: { isResolved },
    });

    if (updatedFeedback) {
      const user = await prisma.user.findUnique({
        where: { email: updatedFeedback.email },
      });

      if (user) {
        await logUserActivity(
          user.id,
          UserActionType.FEEDBACK_MARKED_RESOLVED,
          {
            ip: request?.headers?.get("x-forwarded-for") || "Unknown",
            userAgent: request?.headers?.get("user-agent") || "Unknown",
          }
        );
      }
    }

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any
) {
  try {
    const { params } = context;
    const id = params.id;

    // Check if feedback exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!existingFeedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      );
    }

    // Delete feedback
    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
