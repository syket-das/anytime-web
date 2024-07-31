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
    const userExchanges = await prisma.exchange.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: userExchanges,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user exchanges!" },
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
    const { fromAmount, toAmount, userBankId, rateId } = await req.json();

    if (!fromAmount || !toAmount || !userBankId || !userId) {
      return NextResponse.json(
        { error: "Please provide all the required fields!" },
        { status: 400 }
      );
    }

    const userExchange = await prisma.exchange.create({
      data: {
        userId,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
        userBankId: userBankId,
        from: CURRENCY.USDT,
        to: CURRENCY.INR,
        status: STATUS.PENDING,
        rateId: rateId,
      },
    });

    return NextResponse.json({
      success: true,
      data: userExchange,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
