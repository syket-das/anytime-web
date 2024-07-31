import { prisma } from "@/lib/db";
import { CURRENCY, STATUS } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedNextRequest } from "types";

export async function POST(req: ExtendedNextRequest) {
  try {
    const headersList = headers();
    const userId = headersList.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    const { accountNo, accountName, IFSC, branch, bankName } = await req.json();

    if (
      !accountNo ||
      !accountName ||
      !IFSC ||
      !branch ||
      !bankName ||
      !userId
    ) {
      return NextResponse.json(
        { error: "Please provide all the required fields!" },
        { status: 400 }
      );
    }

    const userBank = await prisma.userBank.create({
      data: {
        userId,
        accountNo,
        accountName,
        IFSC,
        branch,
        bankName,
      },
    });

    return NextResponse.json({
      success: true,
      data: userBank,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: ExtendedNextRequest) {
  try {
    const headersList = headers();
    const userId = headersList.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    const userBanks = await prisma.userBank.findMany({
      where: {
        userId,
      },

      include: {
        exchanges: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: userBanks,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      {
        status: 500,
      }
    );
  }
}
