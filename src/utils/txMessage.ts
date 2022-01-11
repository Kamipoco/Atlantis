import { SetTokenURIParams } from "@/interfaces/metadata";
import { ethers } from "ethers";
import { provider } from "./contract";
import contract from "@/config/contracts/contracts";
import { TypedDataDomain, TypedDataField } from "@ethersproject/abstract-signer";

export const deployer = new ethers.Wallet(`${process.env.DEPLOYER_PRIVATE_KEY}`, provider);

export const signMessage = async (message: string) => {
  const signature = await deployer.signMessage(ethers.utils.arrayify(message));
  return signature;
}

export const signTypeData = async (domain: TypedDataDomain, types: Record<string, TypedDataField[]>, voucher: Record<string, any>) => {
  const signature = await deployer._signTypedData(domain, types, voucher);
  return signature
}
export const messageSetTokenURI = (
  messageData: SetTokenURIParams,
  tokenURI: string
) => {
  const from = messageData.from;
  const tokenId = messageData.tokenId;
  const nonce = messageData.nonce;

  return ethers.utils.solidityKeccak256(
    ["address", "uint256", "string", "uint256", "address"],
    [from, tokenId, tokenURI, nonce, contract.heros.address]
  );
};
