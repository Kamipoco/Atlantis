import { ItemClass, ItemHeroRace, ItemRarity, ItemSortOption } from "@/constants/items";
import { IsEnum, IsNumber } from "class-validator";

export class GameInventoryQueryParamsDto {
  @IsNumber()
  page!: number;

  @IsNumber()
  limit!: number;

  @IsEnum(ItemClass)
  type!: ItemClass;

  @IsEnum(ItemRarity)
  rank?: ItemRarity;

  @IsEnum(ItemSortOption)
  sort?: ItemSortOption;
}

export class WebInventoryQueryParamsDto {
  @IsNumber()
  page!: number;

  @IsNumber()
  limit!: number;

  @IsEnum(ItemClass)
  class?: ItemClass;

  @IsEnum(ItemHeroRace)
  race?: ItemHeroRace

  @IsEnum(ItemRarity)
  rarity?: ItemRarity;

  @IsNumber()
  level?: number;

  @IsNumber()
  stars?: number;
}