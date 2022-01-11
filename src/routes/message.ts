import { SignedMessageDto } from "@/dtos/message";
import { Routes } from "@/interfaces/routes";
import MessageService from "@/services/message";
import { routeWrapper } from "@/utils/routeWrapper";
import { Router } from "express";

export default class MessageRoutes implements Routes {
  public path = '/message';
  public router = Router();

  private messageService = new MessageService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/send', routeWrapper(async (req) => {
      const userWalletAddress: string = req.body.userWalletAddress;
      const data = await this.messageService.sendMessageAndNonce(userWalletAddress);
      return { data }
    }));

    this.router.post('/verify', routeWrapper(async (req) => {
      const signedMessage: SignedMessageDto = req.body;
      const dataToSign = await this.messageService.verifySignature(signedMessage);
      const data = this.messageService.makeJWT(dataToSign);
      return { data }
    }));
  }

}
