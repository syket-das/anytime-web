import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const headersList = headers();
    const userId = headersList.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        banks: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user profile!" },
      { status: 500 }
    );
  }
}
