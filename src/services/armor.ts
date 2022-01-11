import { ItemClass, ItemSortOption } from "@/constants/items";
import { GameInventoryQueryParamsDto } from "@/dtos/inventory";
import { HttpException } from "@/exceptions/HttpException";
import { ArmorInstance } from "@/interfaces/armor";
import { GameInventoryQueryOptions } from "@/interfaces/inventory";
import { UserInstance } from "@/interfaces/user";
import { Armor } from "@/models/armor";
import { validateGameInventoryQueryParams } from "@/utils/validateInventoryQueryParams";
import _ from "lodash";


export default class ArmorService {
  public async getArmor(tokenId: string, user: UserInstance): Promise<ArmorInstance> {
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const foundArmor = await Armor.findOne({ where: { tokenId } });

    if (!foundArmor) {
      throw new HttpException(404, 'Armor not found');
    }

    if (foundArmor.walletAddress !== user.walletAddress) {
      throw new HttpException(403, 'You have no access to this armor');
    }

    return foundArmor;
  }

  public async getArmors(user: UserInstance, queryParams: GameInventoryQueryParamsDto): Promise<ArmorInstance[]> {
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

    const armorList = await Armor.findAll(queryOptions);

    return armorList;
  }
}
