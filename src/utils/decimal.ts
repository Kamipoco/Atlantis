import { ethers } from "ethers"

export const etherToWei = (value: string) => {
  return ethers.utils.parseEther(value).toString();
}

export const weiToEther = (value: string) => {
  return parseInt(ethers.utils.formatEther(value));
}
