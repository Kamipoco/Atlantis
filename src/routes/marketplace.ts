import contracts from "@/config/contracts/contracts";
import { WebInventoryQueryParamsDto } from "@/dtos/inventory";
import { VoucherDto } from "@/dtos/metadata";
import { Routes } from "@/interfaces/routes";
import MarketplaceService from "@/services/marketplace";
import { routeWrapper } from "@/utils/routeWrapper";
import { plainToClass } from "class-transformer";
import { Router } from "express";

export default class MarketplaceRoutes implements Routes {
  public path = '/market';
  public router = Router();

  private marketPlaceService = new MarketplaceService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/voucher',
      routeWrapper(async (req) => {
        const queryParams: VoucherDto = plainToClass(VoucherDto, req.query);

        const data = await this.marketPlaceService.genesisVoucher(queryParams);

        return { data }
      }));

    this.router.get('/heroes',
      routeWrapper(async (req) => {
        const queryParams: WebInventoryQueryParamsDto = plainToClass(WebInventoryQueryParamsDto, req.query);

        const { heroList, total } = await this.marketPlaceService.getHeroes(queryParams);

        return {
          data: heroList,
          metadata: {
            page: queryParams.page,
            limit: queryParams.limit,
            total,
            contractAddress: contracts.heros.address
          }
        };
      }));

    this.router.get('/weapons',
      routeWrapper(async (req) => {
        const queryParams: WebInventoryQueryParamsDto = plainToClass(WebInventoryQueryParamsDto, req.query);

        const { weaponList, total } = await this.marketPlaceService.getWeapons(queryParams);

        return {
          data: weaponList,
          metadata: {
            page: queryParams.page,
            limit: queryParams.limit,
            total,
            contractAddress: contracts.weapons.address
          }
        };
      }));

    this.router.get('/armors',
      routeWrapper(async (req) => {
        const queryParams: WebInventoryQueryParamsDto = plainToClass(WebInventoryQueryParamsDto, req.query);

        const { armorList, total } = await this.marketPlaceService.getArmors(queryParams);

        return {
          data: armorList,
          metadata: {
            page: queryParams.page,
            limit: queryParams.limit,
            total,
            contractAddress: contracts.armors.address
          }
        };
      }));

    this.router.get('/heroes/:tokenId',
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        const data = await this.marketPlaceService.getHeroByTokenId(tokenId);

        return { data, metadata: { contractAddress: contracts.heros.address } }
      }));

    this.router.get('/weapons/:tokenId',
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        const data = await this.marketPlaceService.getWeaponByTokenId(tokenId);

        return { data, metadata: { contractAddress: contracts.weapons.address } }
      }));

    this.router.get('/armors/:tokenId',
      routeWrapper(async (req) => {
        const tokenId = req.params.tokenId;
        const data = await this.marketPlaceService.getArmorByTokenId(tokenId);

        return { data, metadata: { contractAddress: contracts.armors.address } }
      }));
  }
}
