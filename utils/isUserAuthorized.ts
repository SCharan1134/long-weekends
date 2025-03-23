import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function isUserAuthorized(requireAdmin: boolean = false) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return {
      authorized: false,
      response: new NextResponse("Unauthorized", { status: 401 }),
    };
  }

  const userId = session.user.id;

  if (requireAdmin) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return {
        authorized: false,
        response: new NextResponse("Forbidden", { status: 403 }),
      };
    }
  }

  return { authorized: true, userId };
}
