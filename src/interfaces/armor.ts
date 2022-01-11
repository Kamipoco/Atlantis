import { Model, Optional } from "sequelize";

export interface ArmorAttributes {
  id: string,
  walletAddress: string,
  tokenId: number,
  hp: number,
  perk: number,
  level: number,
  stars: number,
  rarity: string,
  nftType: string,
  class: string,
  equippedHeroTokenId?: number | null
  marketplaceId?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ArmorCreationAttributes extends Optional<ArmorAttributes, "id"> { }

export interface ArmorInstance extends Model<ArmorAttributes, ArmorCreationAttributes>,
  ArmorAttributes {

}
