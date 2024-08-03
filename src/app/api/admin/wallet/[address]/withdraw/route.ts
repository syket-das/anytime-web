import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import axios from "axios";

// Connect to BSC
const provider = new ethers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/"
);
const usdtContractAddress = "0x55d398326f99059ff775485246999027b3197955";
const usdtAbi = [
  "function balanceOf(address _owner) view returns (uint256)",
  "function transfer(address _to, uint256 _value) returns (bool)",
];

// Create a contract instance
const usdtContract = new ethers.Contract(
  usdtContractAddress,
  usdtAbi,
  provider
);

async function fetchBnbToUsdtRate() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
    );
    return ethers.BigNumber.from(
      Math.floor(response.data.binancecoin.usd * 1e8)
    ); // Convert to BigNumber with 8 decimal places
  } catch (error) {
    console.error("Error fetching BNB to USDT rate:", error);
    throw new Error("Unable to fetch BNB to USDT exchange rate");
  }
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      address: string;
    };
  }
) {
  const address = params.address;
  const { receiveAddress } = await req.json();

  if (!address || !receiveAddress) {
    return NextResponse.json(
      { error: "Please provide all the required fields!" },
      { status: 400 }
    );
  }

  try {
    const wallet = await prisma.depositWallet.findFirst({
      where: { address: address },
    });

    if (!wallet) {
      return NextResponse.json({ error: "Wallet not found!" }, { status: 404 });
    }

    const privateKey = wallet.privateKey;
    const walletSigner = new ethers.Wallet(privateKey, provider);

    // Fetch USDT balance
    const balance = await usdtContract.balanceOf(address);
    const usdtBalance = ethers.BigNumber.from(balance);

    // Fetch BNB gas price and calculate gas fee in BNB
    const gasPrice = await provider.getGasPrice();
    const gasPriceBNB = ethers.BigNumber.from(gasPrice.toString());
    const gasLimit = ethers.BigNumber.from(60000); // Adjust as necessary
    const gasFeeBNB = gasPriceBNB.mul(gasLimit);

    // Fetch current BNB to USDT exchange rate
    const bnbToUsdtRate = await fetchBnbToUsdtRate();
    const gasFeeUSDT = gasFeeBNB
      .mul(bnbToUsdtRate)
      .div(ethers.BigNumber.from(1e26)); // Assuming 18 decimal places for BNB and 8 for USDT

    // Calculate the amount of USDT to send after deducting gas fees
    const usdtAmountToSend = usdtBalance.sub(gasFeeUSDT);

    if (usdtAmountToSend.lte(0)) {
      return NextResponse.json(
        { error: "Insufficient USDT balance to cover gas fees!" },
        { status: 400 }
      );
    }

    // Prepare transaction
    const tx = {
      to: usdtContractAddress,
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
      data: usdtContract.interface.encodeFunctionData("transfer", [
        receiveAddress,
        usdtAmountToSend.toString(),
      ]),
    };

    // Sign and send transaction
    const txResponse = await walletSigner.sendTransaction(tx);
    await txResponse.wait();

    return NextResponse.json({
      success: true,
      message: `Transferred ${usdtAmountToSend.toString()} USDT from ${address} to ${receiveAddress}`,
      transactionHash: txResponse.hash,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to perform the transfer!" },
      { status: 500 }
    );
  }
}
