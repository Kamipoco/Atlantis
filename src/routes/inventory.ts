import contracts from "@/config/contracts/contracts";
import { WebInventoryQueryParamsDto } from "@/dtos/inventory";
import { Routes } from "@/interfaces/routes";
import { UserInstance } from "@/interfaces/user";
import InventoryService from "@/services/inventory";
import { routeWrapper } from "@/utils/routeWrapper";
import { plainToClass } from "class-transformer";
import { Router } from "express";
import passport from "passport";

export default class InventoryRoutes implements Routes {
  public path = '/inventory';
  public router: Router = Router();

  private InventoryService = new InventoryService();

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(
      '/heroes',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const queryParams: WebInventoryQueryParamsDto = plainToClass(WebInventoryQueryParamsDto, req.query);

        const { heroList, total } = await this.InventoryService.getHeroes(req.user as UserInstance, queryParams);

        return {
          data: heroList,
          metadata: {
            contractAddress: contracts.heros.address,
            page: queryParams.page,
            limit: queryParams.limit,
            total
          }
        };
      }));

    this.router.get(
      '/weapons',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const queryParams: WebInventoryQueryParamsDto = plainToClass(WebInventoryQueryParamsDto, req.query);

        const { weaponList, total } = await this.InventoryService.getWeapons(req.user as UserInstance, queryParams);

        return {
          data: weaponList,
          metadata: {
            contractAddress: contracts.weapons.address,
            page: queryParams.page,
            limit: queryParams.limit,
            total
          }
        };
      }));

    this.router.get(
      '/armors',
      passport.authenticate('local', { session: false }),
      routeWrapper(async (req) => {
        const queryParams: WebInventoryQueryParamsDto = plainToClass(WebInventoryQueryParamsDto, req.query);

        const { armorList, total } = await this.InventoryService.getArmors(req.user as UserInstance, queryParams);

        return {
          data: armorList,
          metadata: {
            contractAddress: contracts.armors.address,
            page: queryParams.page,
            limit: queryParams.limit,
            total
          }
        };
      }));
  }
}