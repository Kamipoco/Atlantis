import { WebInventoryQueryParamsDto } from "@/dtos/inventory";
import { ArmorInstance } from "@/interfaces/armor";
import { HeroInstance } from "@/interfaces/hero";
import { WebInventoryQueryOptions } from "@/interfaces/inventory";
import { UserInstance } from "@/interfaces/user";
import { WeaponInstance } from "@/interfaces/weapon";
import { Armor } from "@/models/armor";
import { Hero } from "@/models/hero";
import { Marketplace } from "@/models/marketplace";
import { Weapon } from "@/models/weapon";
import { validateWebInventoryQueryParams } from "@/utils/validateInventoryQueryParams";

export default class InventoryService {
  public async getHeroes(user: UserInstance, queryParams: WebInventoryQueryParamsDto): Promise<{ heroList: HeroInstance[], total: number }> {
    validateWebInventoryQueryParams(queryParams);

    const queryOptions: WebInventoryQueryOptions = {
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit,
      where: {
        walletAddress: user.walletAddress
      }
    };

    if (queryParams.class) queryOptions.where!.class = queryParams.class;
    if (queryParams.race) queryOptions.where!.race = queryParams.race;
    if (queryParams.rarity) queryOptions.where!.rarity = queryParams.rarity;
    if (queryParams.level) queryOptions.where!.level = queryParams.level;
    if (queryParams.stars) queryOptions.where!.stars = queryParams.stars;

    const result = await Hero.findAndCountAll({
      ...queryOptions,
      include: { model: Marketplace }
    });

    return { heroList: result.rows, total: result.count };
  }

  public async getWeapons(user: UserInstance, queryParams: WebInventoryQueryParamsDto): Promise<{ weaponList: WeaponInstance[], total: number }> {
    validateWebInventoryQueryParams(queryParams);

    const queryOptions: WebInventoryQueryOptions = {
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit,
      where: {
        walletAddress: user.walletAddress
      }
    };

    if (queryParams.class) queryOptions.where!.class = queryParams.class;
    if (queryParams.rarity) queryOptions.where!.rarity = queryParams.rarity;
    if (queryParams.level) queryOptions.where!.level = queryParams.level;
    if (queryParams.stars) queryOptions.where!.stars = queryParams.stars;

    const result = await Weapon.findAndCountAll({
      ...queryOptions,
      include: { model: Marketplace }
    });

    return { weaponList: result.rows, total: result.count };
  }

  public async getArmors(user: UserInstance, queryParams: WebInventoryQueryParamsDto): Promise<{ armorList: ArmorInstance[], total: number }> {
    validateWebInventoryQueryParams(queryParams);

    const queryOptions: WebInventoryQueryOptions = {
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit,
      where: {
        walletAddress: user.walletAddress
      }
    };

    if (queryParams.class) queryOptions.where!.class = queryParams.class;
    if (queryParams.rarity) queryOptions.where!.rarity = queryParams.rarity;
    if (queryParams.level) queryOptions.where!.level = queryParams.level;
    if (queryParams.stars) queryOptions.where!.stars = queryParams.stars;

    const result = await Armor.findAndCountAll({
      ...queryOptions,
      include: { model: Marketplace }
    });

    return { armorList: result.rows, total: result.count };
  }
}