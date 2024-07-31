import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(req: NextRequest) {
  try {
    const exchangeRates = await prisma.exchangeRate.findMany({});

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
