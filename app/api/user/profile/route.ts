import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { processLongWeekends } from "@/utils/processLongWeekends";
import { logUserActivity } from "@/lib/logActivity";
import { UserActionType } from "@/types/UserActionTypes";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log(body);
    const { name, image, companyName, salary, paidLeaves, unpaidLeaves } = body;
    console.log("started executions");

    if (
      !name ||
      !image ||
      !companyName ||
      !salary ||
      paidLeaves === undefined ||
      paidLeaves === null ||
      unpaidLeaves === undefined ||
      unpaidLeaves === null
    ) {
      return new NextResponse(
        "Missing name, image,salary,paidLeaves,unpaidLeaves or companyName",
        {
          status: 401,
        }
      );
    }
    console.log("fetched data", body);
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;
    console.log(userId);
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        image,
        companyName,
        salary,
        paidLeaves,
        unpaidLeaves,
        updatedAt: new Date(),
      },
    });
    console.log("updated user", user);
    // await logUserActivity(user.id, UserActionType.PROFILE_UPDATED, {
    //   ip: req?.headers?.get("x-forwarded-for") || "Unknown",
    //   userAgent: req?.headers?.get("user-agent") || "Unknown",
    // });
    // console.log("logged activity");

    // console.log("starting long weekends");
    // await processLongWeekends(user.id);
    // console.log("processed long weekends");

    Promise.all([
      logUserActivity(user.id, UserActionType.PROFILE_UPDATED, {
        ip: req.headers.get("x-forwarded-for") || "Unknown",
        userAgent: req.headers.get("user-agent") || "Unknown",
      }),
      processLongWeekends(user.id),
    ])
      .then(() => console.log("Background tasks completed successfully"))
      .catch((error) =>
        console.error("Error processing background tasks:", error)
      );
    console.log("ended executions");
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
