import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedNextRequest } from "types";

export async function GET(req: ExtendedNextRequest) {
  try {
    const userId = req.userId;

    const depositWallets = await prisma.depositWallet.findMany({
      where: {
        userId,
      },

      select: {
        address: true,
        publicKey: true,
      },
    });

    if (!depositWallets) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: depositWallets,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user deposit wallets!" },
      { status: 500 }
    );
  }
}
