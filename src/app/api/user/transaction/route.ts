import { prisma } from "@/lib/db";
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

    const userDeposits = await prisma.deposit.findMany({
      where: {
        userId,
      },
    });

    const userExchanges = await prisma.exchange.findMany({
      where: {
        userId,
      },
    });

    const modifyWithdrawls = userWithdrawls.map((withdrawl) => {
      return {
        ...withdrawl,
        type: "withdraw",
      };
    });

    const modifyDeposits = userDeposits.map((deposit) => {
      return {
        ...deposit,
        type: "deposit",
      };
    });

    const modifyExchanges = userExchanges.map((exchange) => {
      return {
        ...exchange,
        type: "exchange",
      };
    });

    // mix all but according to the date

    const allTransactions = [
      ...modifyWithdrawls,
      ...modifyDeposits,
      ...modifyExchanges,
    ];

    allTransactions.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      data: allTransactions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user transactions!" },
      { status: 500 }
    );
  }
}
