import { GameInventoryQueryParamsDto } from "@/dtos/inventory";
import { Routes } from "@/interfaces/routes";
import { UserInstance } from "@/interfaces/user";
import WeaponService from "@/services/weapon";
import { routeWrapper } from "@/utils/routeWrapper";
import { plainToClass } from "class-transformer";
import { Router } from "express";
import passport from "passport";

export default class WeaponRoutes implements Routes {
  public path = '/weapons';
  public router: Router = Router();

  private WeaponService = new WeaponService();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      '/:tokenId',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        const data = await this.WeaponService.getWeapon(tokenId, req.user as UserInstance);

        return { data }
      }));

    this.router.get(
      '/',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const queryParams: GameInventoryQueryParamsDto = plainToClass(GameInventoryQueryParamsDto, req.query);

        const data = await this.WeaponService.getWeapons(req.user as UserInstance, queryParams);

        return { data }
      }));
  }
}
