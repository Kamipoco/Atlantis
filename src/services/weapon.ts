import { ItemClass, ItemSortOption } from "@/constants/items";
import { GameInventoryQueryParamsDto } from "@/dtos/inventory";
import { HttpException } from "@/exceptions/HttpException";
import { GameInventoryQueryOptions } from "@/interfaces/inventory";
import { UserInstance } from "@/interfaces/user";
import { WeaponInstance } from "@/interfaces/weapon";
import { Weapon } from "@/models/weapon";
import { validateGameInventoryQueryParams } from "@/utils/validateInventoryQueryParams";
import _ from "lodash";

export default class WeaponService {
  public async getWeapon(tokenId: string, user: UserInstance): Promise<WeaponInstance> {
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const foundWeapon = await Weapon.findOne({ where: { tokenId } });

    if (!foundWeapon) {
      throw new HttpException(404, 'Weapon not found');
    }

    if (foundWeapon.walletAddress !== user.walletAddress) {
      throw new HttpException(403, 'You have no access to this weapon');
    }

    return foundWeapon;
  }

  public async getWeapons(user: UserInstance, queryParams: GameInventoryQueryParamsDto): Promise<WeaponInstance[]> {
    validateGameInventoryQueryParams(queryParams);

    const queryOptions: GameInventoryQueryOptions = {
      where: { walletAddress: user.walletAddress },
      limit: queryParams.limit,
      offset: (queryParams.page - 1) * queryParams.limit
    };

    if (queryParams.type !== ItemClass.ALL) {
      queryOptions.where.class = queryParams.type.charAt(0) + queryParams.type.slice(1).toLowerCase();
    }

    if (queryParams.rank) {
      queryOptions.where.rarity = queryParams.rank;
    }

    if (queryParams.sort) {
      if (queryParams.sort === ItemSortOption.HIGHEST_RANK) {
        queryOptions.order = [
          ['rarity', 'DESC']
        ];
      } else {
        queryOptions.order = [
          ['level', 'DESC']
        ];
      }
    }

    const weaponList = await Weapon.findAll(queryOptions);

    return weaponList;
  }

}
