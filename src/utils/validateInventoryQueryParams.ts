import { ItemClass, ItemHeroRace, ItemRarity, ItemSortOption } from "@/constants/items";

import { GameInventoryQueryParamsDto, WebInventoryQueryParamsDto } from "@/dtos/inventory";
import { HttpException } from "@/exceptions/HttpException";
import _ from "lodash";

export function validateGameInventoryQueryParams(queryParams: GameInventoryQueryParamsDto) {
  if (_.isNaN(Number(queryParams.page)) || Number(queryParams.page) < 1) {
    throw new HttpException(400, 'page must be greater than or equal to 1');
  }

  if (_.isNaN(Number(queryParams.limit)) || Number(queryParams.limit) < 1) {
    throw new HttpException(400, 'limit must be greater than or equal to 1');
  }

  if (!Object.keys(ItemClass).includes(queryParams.type)) {
    throw new HttpException(400, 'Unknown inventory type');
  }

  if (queryParams.rank && !Object.values(ItemRarity).includes(queryParams.rank)) {
    throw new HttpException(400, 'Unknown inventory rank');
  }

  if (queryParams.sort && !Object.values(ItemSortOption).includes(queryParams.sort)) {
    throw new HttpException(400, 'Unknown inventory sort option');
  }
}

export function validateWebInventoryQueryParams(queryParams: WebInventoryQueryParamsDto) {
  if (_.isNaN(Number(queryParams.page)) || Number(queryParams.page) < 1) {
    throw new HttpException(400, 'page must be greater than or equal to 1');
  }

  if (_.isNaN(Number(queryParams.limit)) || Number(queryParams.limit) < 1) {
    throw new HttpException(400, 'limit must be greater than or equal to 1');
  }

  if (queryParams.class && !Object.values(ItemClass).includes(queryParams.class)) {
    throw new HttpException(400, 'Unknown inventory class');
  }

  if (queryParams.race && !Object.values(ItemHeroRace).includes(queryParams.race)) {
    throw new HttpException(400, 'Unknown hero race');
  }

  if (queryParams.rarity && !Object.values(ItemRarity).includes(queryParams.rarity)) {
    throw new HttpException(400, 'Unknown inventory rarity');
  }

  if (queryParams.level && (_.isNaN(Number(queryParams.level)) || Number(queryParams.level < 1) || Number(queryParams.level > 99))) {
    throw new HttpException(400, 'level must be from 1 to 99');
  }

  if (queryParams.stars && (_.isNaN(Number(queryParams.stars)) || Number(queryParams.stars < 1) || Number(queryParams.stars > 5))) {
    throw new HttpException(400, 'stars must be from 1 to 5');
  }
}

