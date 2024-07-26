import Web3 from "web3";

const web3 = new Web3("https://bsc-dataseed.binance.org/"); // Use appropriate provider

export async function createWallet() {
  try {
    const wallet = await web3.eth.accounts.create();

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
