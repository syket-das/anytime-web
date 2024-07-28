import { prisma } from "@/lib/db";
import { CURRENCY, STATUS } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { rate } = await req.json();

    if (!rate) {
      return NextResponse.json(
        { error: "Please provide all the required fields!" },
        { status: 400 }
      );
    }

    const exchangeRate = await prisma.exchangeRate.create({
      data: {
        from: CURRENCY.USDT,
        to: CURRENCY.INR,
        rate: parseFloat(rate),
      },
    });

    return NextResponse.json({
      success: true,
      data: exchangeRate,
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

export async function GET(req: NextRequest) {
  try {
    const exchangeRates = await prisma.exchangeRate.findMany({
      include: {
        exchanges: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: exchangeRates,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch exchange rates!" },
      { status: 500 }
    );
  }
}
