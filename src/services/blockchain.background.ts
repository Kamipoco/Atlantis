import { gameContract, herosContract, marketplaceContract } from "@/utils/contract";
import { BigNumber, Contract } from "ethers";
import { logger } from "@/utils/logger";
import { ContractType, EventName } from "@/constants/eventname";
import { Event } from "@/models/event";

export default class BlockchainBackgroundService {

  private initialized = false;
  private gameContract: Contract = gameContract;
  private herosContract: Contract = herosContract;
  private marketplaceContract: Contract = marketplaceContract;

  public initialize() {
    if (!this.initialized) {
      this.initialized = true;
      this.initializeListener();
    }
  }

  public initializeListener() {
    this.gameContract.on("DepositToken", async (from: string, token: string, amount: BigNumber, timestamp: number, infoEvent: any) => {
      logger.debug("Deposit on Game Contract");
      const parameter = {
        from: from,
        token: token,
        amount: amount.toString(),
        timestamp: parseInt(timestamp.toString())
      }
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = gameContract.address;
      const contractType = ContractType.GameContract;
      const eventName = EventName.DepositToken;
      const blockNumber = infoEvent.blockNumber;
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });
    this.gameContract.on("WithdrawToken", async (from: string, token: string, amount: BigNumber, timestamp: number, infoEvent: any) => {
      logger.debug("Withdraw on Game Contract");
      const parameter = {
        from: from,
        token: token,
        amount: amount.toString(),
        timestamp: parseInt(timestamp.toString())
      }
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = gameContract.address;
      const contractType = ContractType.GameContract;
      const eventName = EventName.WithdrawToken;
      const blockNumber = infoEvent.blockNumber;
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });

    this.gameContract.on("DepositNFT", async (from: string, token: string, tokenId: BigNumber, timestamp: number, infoEvent: any) => {
      logger.debug("DepositNFT on Game Contract");
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = gameContract.address;
      const contractType = ContractType.GameContract;
      const eventName = EventName.DepositNFT;
      const blockNumber = infoEvent.blockNumber;
      const tokenUri = await this.herosContract.functions["tokenURI(uint256)"](tokenId);
      const parameter = {
        from: from,
        token: token,
        tokenId: tokenId.toString(),
        tokenURI: tokenUri,
        timestamp: parseInt(timestamp.toString())
      }
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });

    this.marketplaceContract.on("Offer", async (itemId: BigNumber, tokenId: BigNumber, itemContract: string, owner: string, price: BigNumber, timestamp: number, infoEvent: any) => {
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = gameContract.address;
      const contractType = ContractType.MarketContract;
      const eventName = EventName.Offer;
      const blockNumber = infoEvent.blockNumber;
      const parameter = {
        itemId: itemId.toString(),
        tokenId: tokenId.toString(),
        itemContract: itemContract,
        owner: owner,
        price: price.toString(),
        timestamp: parseInt(timestamp.toString())
      }
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });

    this.marketplaceContract.on("Buy", async (itemId: BigNumber, tokenId: BigNumber, itemContract: string, buyer: string, price: BigNumber, timestamp: number, infoEvent: any) => {
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = gameContract.address;
      const contractType = ContractType.MarketContract;
      const eventName = EventName.Buy;
      const blockNumber = infoEvent.blockNumber;
      const parameter = {
        itemId: itemId.toString(),
        tokenId: tokenId.toString(),
        itemContract: itemContract,
        buyer: buyer,
        price: price.toString(),
        timestamp: parseInt(timestamp.toString())
      }
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });

    this.marketplaceContract.on("Withdraw", async (itemId: BigNumber, tokenId: BigNumber, itemContract: string, owner: string, timestamp: number, infoEvent: any) => {
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = gameContract.address;
      const contractType = ContractType.MarketContract;
      const eventName = EventName.Withdraw;
      const blockNumber = infoEvent.blockNumber;
      const parameter = {
        itemId: itemId.toString(),
        tokenId: tokenId.toString(),
        itemContract: itemContract,
        owner: owner,
        timestamp: parseInt(timestamp.toString())
      }
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });

    this.herosContract.on("Redeem", async (from: string, tokenId: BigNumber, nonce: string, timestamp: number, infoEvent: any) => {
      const transactionHash = infoEvent.transactionHash;
      const contractAddress = herosContract.address;
      const contractType = ContractType.HeroContract;
      const eventName = EventName.Redeem;
      const blockNumber = infoEvent.blockNumber;
      const parameter = {
        from: from,
        tokenId: tokenId.toString(),
        nonce: nonce,
        timestamp: parseInt(timestamp.toString())
      }
      try {
        await Event.create({
          contractType: contractType,
          contractAddress: contractAddress,
          transHash: transactionHash,
          name: eventName,
          param: parameter,
          block: blockNumber
        })
      } catch (error) {
        logger.error("ERROR: ", error);
      }
    });

  }
}
