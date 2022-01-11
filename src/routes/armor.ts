import { GameInventoryQueryParamsDto } from "@/dtos/inventory";
import { Routes } from "@/interfaces/routes";
import { UserInstance } from "@/interfaces/user";
import ArmorService from "@/services/armor";
import { Router } from "express";
import passport from "passport";
import { plainToClass } from 'class-transformer';
import { routeWrapper } from "@/utils/routeWrapper";

export default class ArmorRoutes implements Routes {
  public path = '/armors';
  public router: Router = Router();

  private ArmorService = new ArmorService();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      '/:tokenId',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        const data = await this.ArmorService.getArmor(tokenId, req.user as UserInstance);

        return { data }
      }));

    this.router.get(
      '/',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const queryParams: GameInventoryQueryParamsDto = plainToClass(GameInventoryQueryParamsDto, req.query);

        const data = await this.ArmorService.getArmors(req.user as UserInstance, queryParams);

        return { data }
      }));
  }
}
