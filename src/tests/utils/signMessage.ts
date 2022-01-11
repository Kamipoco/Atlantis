import { ethers } from "ethers"
import { InfoVerifySignature } from "../interface/message";
import "dotenv/config";
const privateKey = process.env.PRIVATE_KEY as string;
export const signMessage = async (message: string, walletAddress: string): Promise<InfoVerifySignature> => {
  const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
  const signer = new ethers.Wallet(privateKey, provider);
  const signature = await signer.signMessage(message);
  const info: InfoVerifySignature = {
    _userWalletAddress: walletAddress,
    _signature: signature
  }
  return info;
}
