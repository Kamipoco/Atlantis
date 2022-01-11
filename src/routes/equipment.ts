import { Routes } from "@/interfaces/routes";
import { UserInstance } from "@/interfaces/user";
import EquipmentService from "@/services/equipment";
import { routeWrapper } from "@/utils/routeWrapper";
import { Router } from "express";
import passport from "passport";

export default class EquipmentRoutes implements Routes {
  public path = '/equipment';
  public router: Router = Router();

  private EquipmentService = new EquipmentService();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(
      '/equip/:tokenId',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        const message = await this.EquipmentService.equip(tokenId, req.user as UserInstance);

        return { data: message };
      }));

    this.router.post(
      '/unequip/:tokenId',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        await this.EquipmentService.unequip(tokenId, req.user as UserInstance);

        return { data: 'success' };
      }));
  }
}