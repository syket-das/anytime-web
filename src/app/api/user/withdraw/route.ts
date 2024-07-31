import { prisma } from "@/lib/db";
import { CURRENCY, STATUS } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedNextRequest } from "types";

export async function GET(req: ExtendedNextRequest) {
  try {
    const headersList = headers();
    const userId = headersList.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    const userWithdrawls = await prisma.withdrawal.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: userWithdrawls,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user withdraws!" },
      { status: 500 }
    );
  }
}

export async function POST(req: ExtendedNextRequest) {
  try {
    const headersList = headers();
    const userId = headersList.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    const { walletAddress, amount } = await req.json();

    if (!walletAddress || !userId) {
      return NextResponse.json(
        { error: "Please provide all the required fields!" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId,
        walletAddress,
        status: STATUS.PENDING,
        currency: CURRENCY.USDT,
        amount: parseFloat(amount),
      },
    });

    return NextResponse.json({
      success: true,
      data: withdrawal,
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

export async function PUT(req: ExtendedNextRequest) {
  try {
    const userId = req.userId;
    const { id, status } = await req.json();

    if (!id || !status || !userId) {
      return NextResponse.json(
        { error: "Please provide all the required fields!" },
        { status: 400 }
      );
    }

    const withdrawal = await prisma.withdrawal.findUnique({
      where: {
        id,
      },
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found!" },
        { status: 404 }
      );
    }

    if (withdrawal.status !== STATUS.PENDING && status !== STATUS.CANCELLED) {
      return NextResponse.json(
        { error: "You can only update pending withdrawals! " },
        { status: 400 }
      );
    }

    if (withdrawal.userId !== userId) {
      return NextResponse.json(
        { error: "You are not authorized to update this withdrawal!" },
        { status: 403 }
      );
    }

    const updatedWithdrawal = await prisma.withdrawal.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedWithdrawal,
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
