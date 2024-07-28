import { prisma } from "@/lib/db";
import { CURRENCY, STATUS } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedNextRequest } from "types";

export async function GET(req: ExtendedNextRequest) {
  try {
    const userId = req.userId;

    const userWithdraws = await prisma.withdrawal.findMany({
      where: {
        userId,
      },
    });

    const userExchanges = await prisma.exchange.findMany({
      where: {
        userId,
      },
    });

    const userDeposits = await prisma.deposit.findMany({
      where: {
        userId,
      },
    });

    const successfullDeposits = userDeposits.filter(
      (deposit) => deposit.status === STATUS.SUCCESS
    );

    const successfullExchanges = userExchanges.filter(
      (exchange) => exchange.status === STATUS.SUCCESS
    );

    const successfullWithdraws = userWithdraws.filter(
      (withdraw) => withdraw.status === STATUS.SUCCESS
    );

    const depositAmount = successfullDeposits.reduce(
      (acc, deposit) => acc + (deposit.amount - deposit.convienceFee),
      0
    );

    const exchangeAmount = successfullExchanges.reduce(
      (acc, exchange) => acc + (exchange.fromAmount - exchange.convienceFee),
      0
    );

    const withdrawAmount = successfullWithdraws.reduce(
      (acc, withdraw) => acc + (withdraw.amount - withdraw.convienceFee),
      0
    );

    const totalAmount = depositAmount - exchangeAmount - withdrawAmount;

    return NextResponse.json({
      success: true,
      data: {
        balance: totalAmount,
        depositAmount: depositAmount,
        exchangeAmount: exchangeAmount,
        withdrawAmount: withdrawAmount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user withdraws!" },
      { status: 500 }
    );
  }
}
