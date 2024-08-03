// @ts-nocheck
import { prisma } from "@/lib/db";
import { CURRENCY, STATUS } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ExtendedNextRequest } from "types";
import Web3 from "web3";

const web3 = new Web3("https://bsc-dataseed.binance.org/"); // Use appropriate provider

export async function POST(req: ExtendedNextRequest) {
  try {
    const headersList = headers();
    const userId = headersList.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }
    const { transactionId } = await req.json();

    const depositWallets = await prisma.depositWallet.findMany({
      where: {
        userId,
      },

      select: {
        id: true,
        address: true,
        publicKey: true,
      },
    });

    if (depositWallets.length === 0) {
      return NextResponse.json(
        { error: "No deposit wallets found for the user!" },
        { status: 404 }
      );
    }

    // Fetch transaction details
    const transaction = await web3.eth.getTransaction(transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found!" },
        { status: 404 }
      );
    }

    // Check if the transaction is a token transfer (BEP-20)
    const receipt = await web3.eth.getTransactionReceipt(transactionId);

    const transferEvent = receipt.logs.find(
      (log: any) =>
        log.topics[0] === web3.utils.sha3("Transfer(address,address,uint256)")
    );

    if (!transferEvent) {
      return NextResponse.json(
        { error: "Transaction is not a token transfer!" },
        { status: 400 }
      );
    }

    // Decode the event
    const decodedEvent = web3.eth.abi.decodeLog(
      [
        { type: "address", name: "from", indexed: true },
        { type: "address", name: "to", indexed: true },
        { type: "uint256", name: "value" },
      ],
      transferEvent.data,
      [transferEvent.topics[1], transferEvent.topics[2]]
    );

    const { from, to, value } = decodedEvent;

    // Verify if the transaction is sent to one of the user's deposit wallets
    const wallet = depositWallets.find(
      (wallet) => wallet.address.toLowerCase() === to.toLowerCase()
    );

    if (!wallet) {
      return NextResponse.json(
        { error: "Transaction not sent to any of the user's deposit wallets!" },
        { status: 400 }
      );
    }

    // You can also check if the token contract address matches the expected USDT contract address on BSC
    const usdtContractAddress = "0x55d398326f99059fF775485246999027B3197955"; // Replace with the actual USDT contract address on BSC
    if (transaction.to.toLowerCase() !== usdtContractAddress.toLowerCase()) {
      return NextResponse.json(
        { error: "Transaction is not for the expected USDT contract address!" },
        { status: 400 }
      );
    }

    // Additional checks like amount, etc.
    // const expectedAmount = web3.utils.toWei("10", "ether"); // Example: 10 USDT
    // if (value !== expectedAmount) {
    //   return NextResponse.json(
    //     { error: "Transaction amount does not match the expected amount!" },
    //     { status: 400 }
    //   );
    // }

    const amountInUSDT = web3.utils.fromWei(value, "ether");

    const deposit = await prisma.deposit.create({
      data: {
        userId,
        walletId: wallet.id,
        amount: amountInUSDT,
        transactionId,
        currency: CURRENCY.USDT,
        status: STATUS.SUCCESS,
      },
    });

    return NextResponse.json({
      success: true,
      data: deposit,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: error.message || "Internal server error!" },
      { status: 500 }
    );
  }
}
