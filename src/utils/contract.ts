import { Contract, ethers } from "ethers";
import OLYMAbi from "@/config/ABI/OLYMAbi";
import OLYCAbi from "@/config/ABI/OLYCAbi";
import GameAbi from "@/config/ABI/GameAbi";
import HerosAbi from "@/config/ABI/herosAbi";
import contract from "@/config/contracts/contracts";
import token from "@/config/contracts/token";
import MarketplaceAbi from "@/config/ABI/MarketplaceAbi";
export const provider = new ethers.providers.JsonRpcProvider(`${process.env.PROVIDER_URL}`);

export const OLYMContract = new Contract(token.olym.address, OLYMAbi, provider);

export const OLYCContract = new Contract(token.olyc.address, OLYCAbi, provider);

export const gameContract = new Contract(contract.game.address, GameAbi, provider);

export const herosContract = new Contract(contract.heros.address, HerosAbi, provider);

export const armorsContract = new Contract(contract.armors.address, HerosAbi, provider);

export const weaponsContract = new Contract(contract.armors.address, HerosAbi, provider);

export const marketplaceContract = new Contract(contract.marketplace.address, MarketplaceAbi, provider);
