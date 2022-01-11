import { ItemClass, ItemSortOption } from "@/constants/items";
import { GameInventoryQueryParamsDto } from "@/dtos/inventory";
import { HttpException } from "@/exceptions/HttpException";
import { HeroInstance } from "@/interfaces/hero";
import { GameInventoryQueryOptions } from "@/interfaces/inventory";
import { UserInstance } from "@/interfaces/user";
import { Hero } from "@/models/hero";
import { validateGameInventoryQueryParams } from "@/utils/validateInventoryQueryParams";
import _ from "lodash";


export default class HeroService {
  public async getHero(tokenId: string, user: UserInstance): Promise<HeroInstance> {
    if (!tokenId) {
      throw new HttpException(400, 'tokenId is required');
    }

    const foundHero = await Hero.findOne({ where: { tokenId } });

    if (!foundHero) {
      throw new HttpException(404, 'Hero not found');
    }

    if (foundHero.walletAddress !== user.walletAddress) {
      throw new HttpException(403, 'You have no access to this hero');
    }

    return foundHero;
  }

  public async getHeroes(user: UserInstance, queryParams: GameInventoryQueryParamsDto): Promise<HeroInstance[]> {
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

    const heroList = await Hero.findAll(queryOptions);

    return heroList;
  }
}
