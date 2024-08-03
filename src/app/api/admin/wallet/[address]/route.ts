import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Web3 from "web3";

const web3 = new Web3("https://bsc-dataseed.binance.org/");
const usdtContractAddress = "0x55d398326f99059ff775485246999027b3197955";

const usdtAbi = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    type: "function",
  },
];

const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  const address = params.address;

  if (!address) {
    return NextResponse.json(
      { error: "Please provide all the required fields!" },
      { status: 400 }
    );
  }

  try {
    const depositWallet = await prisma.depositWallet.findFirst({
      where: {
        address: address,
      },
    });

    if (!depositWallet) {
      return NextResponse.json(
        { error: "Deposit wallet not found!" },
        { status: 404 }
      );
    }

    const privateKey = depositWallet.privateKey;

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    const balance = await usdtContract.methods.balanceOf(address).call();

    // convert to usdt from smallest unit
    // @ts-ignore

    const usdtBalance = web3.utils.fromWei(balance, "ether");

    return NextResponse.json({
      success: true,
      data: {
        ...depositWallet,
        balance: usdtBalance,
      },
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Failed to fetch deposit wallet!" },
      { status: 500 }
    );
  }
}
